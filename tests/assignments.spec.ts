import { expect, test, type Page } from "@playwright/test";
import type { StudentAssignment, StudentSubmission, TeacherSubmission } from "../src/types/assignments";
import type { UserRole } from "../src/types/auth";

const now = new Date("2030-03-01T12:00:00Z");
const deadline = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString();
const group = {
  id: "group-1",
  name: "Grupo B",
  subject: { name: "Programación", code: "PRO" },
  academicPeriod: { name: "2030", status: "ACTIVE" },
  teacher: { user: { firstName: "Alex", lastName: "López" } },
};
const received: StudentSubmission = {
  id: "submission-1",
  grade: null,
  feedback: null,
  gradedAt: null,
  fileUrl: null,
  textContent: "Mi respuesta",
  submittedAt: now.toISOString(),
};

function assignment(n: number, overrides: Partial<StudentAssignment> = {}): StudentAssignment {
  return { id: String(n), tittle: `Práctica ${n}`, instructions: "Resuelve los ejercicios.", dueDate: deadline(n), group, submissions: [], ...overrides };
}

async function signIn(page: Page, role: UserRole) {
  await page.clock.setFixedTime(now);
  await page.addInitScript(() => sessionStorage.setItem("sgaf-session", JSON.stringify({
    state: { accessToken: "token-de-prueba" },
    version: 0,
  })));
  await page.route("**/test-api/auth/me", (route) => route.fulfill({
    json: { user: { id: role, email: "demo@example.com", firstName: "Alex", lastName: "López", phone: null, role, status: "ACTIVE" } },
  }));
}

function gate() {
  let release!: () => void;
  const wait = new Promise<void>((resolve) => { release = resolve; });
  return { release, wait };
}

test("estudiante filtra, ordena y pagina sin perder resultados al actualizar", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await signIn(page, "STUDENT");
  const initial = gate();
  const refresh = gate();
  let shouldFail = false;
  const assignments = Array.from({ length: 8 }, (_, index) => assignment(index + 1));
  await page.route("**/test-api/assignments/my-assignments", async (route) => {
    if (shouldFail) {
      await refresh.wait;
      await route.fulfill({ status: 500, json: { message: "Servicio temporalmente no disponible" } });
    } else {
      await initial.wait;
      await route.fulfill({ json: { assignments } });
    }
  });

  await page.goto("/mis-tareas");
  await expect(page.getByText("Consultando tus tareas…")).toBeVisible();
  initial.release();
  await expect(page.getByText("8 resultados · Página 1 de 2")).toBeVisible();
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByRole("heading", { name: "Práctica 7" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Buscar tareas" }).fill("practica 8");
  await expect(page.getByText("1 resultados · Página 1 de 1")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Práctica 8" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Buscar tareas" }).clear();
  await page.getByLabel("Ordenar por").selectOption("latest");
  await expect(page.getByRole("article").first()).toContainText("Práctica 8");
  await page.getByRole("combobox", { name: "Estado", exact: true }).selectOption("graded");
  await expect(page.getByText("No hay tareas que coincidan con los filtros.")).toBeVisible();
  await page.getByRole("combobox", { name: "Estado", exact: true }).selectOption("");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);

  shouldFail = true;
  await page.getByRole("button", { name: "Actualizar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Actualizando…" })).toBeDisabled();
  await expect(page.getByRole("heading", { name: "Práctica 8" })).toBeVisible();
  refresh.release();
  await expect(page.getByRole("alert")).toContainText("No pudimos cargar tus tareas");
  await expect(page.getByRole("heading", { name: "Práctica 8" })).toBeVisible();
});

test("una entrega informa el fallo y se registra al reintentar", async ({ page }) => {
  await signIn(page, "STUDENT");
  const firstAttempt = gate();
  let attempts = 0;
  await page.route("**/test-api/assignments/my-assignments", (route) => route.fulfill({
    json: { assignments: [assignment(1)] },
  }));
  await page.route("**/test-api/submissions", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toEqual({ assignmentId: "1", textContent: "Mi respuesta" });
    attempts++;
    if (attempts === 1) {
      await firstAttempt.wait;
      await route.fulfill({ status: 400, json: { message: "No se pudo registrar" } });
    } else {
      await route.fulfill({ status: 201, json: { submission: received } });
    }
  });

  await page.goto("/mis-tareas");
  await page.getByLabel("Respuesta", { exact: true }).fill("Mi respuesta");
  await page.getByRole("button", { name: "Entregar tarea" }).click();
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Enviando…" })).toBeDisabled();
  firstAttempt.release();
  await expect(page.getByRole("button", { name: "Cerrar aviso" })).toBeVisible();
  await expect(page.getByLabel("Respuesta", { exact: true })).toHaveValue("Mi respuesta");
  await page.getByRole("button", { name: "Cerrar aviso" }).click();
  await page.getByRole("button", { name: "Entregar tarea" }).click();
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Entrega registrada." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tu entrega" })).toBeVisible();
});

test("docente pagina tareas y califica una entrega filtrada por estudiante", async ({ page }) => {
  await signIn(page, "TEACHER");
  const assignments = Array.from({ length: 7 }, (_, index) => ({
    ...assignment(index + 1),
    _count: { submissions: 1 },
  }));
  const submission: TeacherSubmission = {
    ...received,
    student: { id: "student-1", enrollmentCode: "BO123", user: { firstName: "Ana", lastName: "Díaz" } },
  };
  await page.route("**/test-api/assignments/teacher", (route) => route.fulfill({ json: { assignments } }));
  await page.route("**/test-api/submissions/assignment/7", (route) =>
    route.fulfill({ json: { submissions: [submission] } }),
  );
  await page.route("**/test-api/submissions/submission-1/grade", (route) => {
    expect(route.request().method()).toBe("PATCH");
    expect(route.request().postDataJSON()).toEqual({ grade: 95, feedback: "Bien hecho" });
    return route.fulfill({ json: { submission: { ...submission, grade: 95, feedback: "Bien hecho" } } });
  });

  await page.goto("/docente/tareas");
  await page.getByLabel("Materia").selectOption("PRO");
  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByRole("heading", { name: "Práctica 7" })).toBeVisible();
  await page.getByRole("link", { name: "Revisar entregas" }).click();
  await page.getByRole("searchbox", { name: "Buscar por nombre o matrícula" }).fill("diaz BO123");
  await page.getByRole("combobox", { name: "Calificación", exact: true }).selectOption("pending");
  await page.getByText("Calificar entrega", { exact: true }).click();
  await page.getByLabel("Calificación — de 1 a 100").fill("95");
  await page.getByLabel("Comentarios para el estudiante — opcional").fill("Bien hecho");
  await page.getByRole("button", { name: "Guardar calificación" }).click();
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(page.getByText("Calificación guardada.", { exact: true })).toBeVisible();
  await expect(page.getByText("No hay entregas que coincidan con los filtros.")).toBeVisible();
  await page.getByRole("combobox", { name: "Calificación", exact: true }).selectOption("graded");
  await expect(page.getByText("Calificación: 95 / 100")).toBeVisible();
});

test("dashboard cuenta vencimientos de siete días y omite tareas entregadas", async ({ page }) => {
  await signIn(page, "STUDENT");
  await page.route("**/test-api/account/summary", (route) =>
    route.fulfill({ json: { cards: [], generatedAt: now.toISOString() } }),
  );
  await page.route("**/test-api/assignments/my-assignments", (route) => route.fulfill({
    json: { assignments: [
      assignment(8), assignment(7), assignment(1, { submissions: [received] }), assignment(-1),
    ] },
  }));
  await page.goto("/inicio");
  const panel = page.getByRole("region", { name: "Tareas próximas a vencer" });
  await expect(panel.getByText("1 tarea vence en los siguientes 7 días", { exact: false })).toBeVisible();
  await expect(panel.getByText("Práctica 7")).toBeVisible();
  await expect(panel.getByRole("listitem")).toHaveCount(1);
  await expect(panel.getByRole("link", { name: "Ver tareas" })).toHaveAttribute("href", "/mis-tareas");
});

test("docente publica una tarea y el grupo actualiza su contador", async ({ page }) => {
  await signIn(page, "TEACHER");
  const publish = gate();
  await page.route("**/test-api/groups/my-groups", (route) => route.fulfill({
    json: { groups: [{ ...group, maxCapacity: 20, _count: { enrollments: 10, assignments: 2 }, scheduleBlocks: [] }] },
  }));
  await page.route("**/test-api/assignments", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toEqual({
      groupId: group.id, title: "Ejercicio final", instructions: "Resolver las preguntas.", dueDate: "2030-03-03T14:00:00.000Z",
    });
    await publish.wait;
    await route.fulfill({ status: 201, json: { message: "Tarea creada", assignment: { id: "new", tittle: "Ejercicio final", dueDate: "2030-03-03T14:00:00.000Z" } } });
  });

  await page.goto("/docente/grupos");
  const card = page.getByRole("article");
  await card.getByText("Publicar una tarea", { exact: true }).click();
  await card.getByLabel("Título").fill("Ejercicio final");
  await card.getByLabel("Instrucciones").fill("Resolver las preguntas.");
  await card.getByLabel("Fecha y hora límite — Bolivia").fill("2030-03-03T10:00");
  await card.getByRole("button", { name: "Publicar tarea" }).click();
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(card.getByRole("button", { name: "Publicando…" })).toBeDisabled();
  publish.release();
  await expect(page.getByText("Tarea publicada.", { exact: true })).toBeVisible();
  await expect(card.getByRole("definition").getByText("3", { exact: true })).toBeVisible();
});
