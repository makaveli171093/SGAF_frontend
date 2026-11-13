import { Link } from "react-router";
import NexoraLogo from "../components/brand/NexoraLogo";

const whatsappUrl =
  "https://wa.me/591611700006?text=" +
  encodeURIComponent(
    "Hola, quiero información sobre la formación y los horarios de NEXORA.",
  );

const areas = [
  {
    number: "01",
    title: "Programación",
    description:
      "Desarrolla tu pensamiento lógico y aprende a construir soluciones mediante código.",
    detail: "Lógica · Desarrollo de software · Resolución de problemas",
  },
  {
    number: "02",
    title: "Bases de datos",
    description:
      "Comprende cómo organizar, consultar y trabajar con la información que utilizan las aplicaciones.",
    detail: "Datos · Consultas · Organización de información",
  },
  {
    number: "03",
    title: "Matemáticas y ciencias",
    description:
      "Refuerza los conceptos que necesitas y aborda tus ejercicios con mayor comprensión.",
    detail: "Apoyo académico · Matemáticas · Ciencias puras",
  },
];

const benefits = [
  {
    title: "Modalidad virtual",
    description:
      "Estudia desde donde te encuentres y mantén tu formación cerca.",
  },
  {
    title: "Mañana, tarde y noche",
    description:
      "Consulta las opciones de horario y encuentra una que se adapte a tu rutina.",
  },
  {
    title: "Mensualidades accesibles",
    description:
      "Solicita información sobre los costos de la formación que te interesa.",
  },
  {
    title: "Tutorías gratuitas",
    description:
      "Recibe acompañamiento para resolver dudas y reforzar tu aprendizaje.",
  },
];

const primaryButton =
  "inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function PublicHomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#contenido-publico"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only focus:rounded-lg focus:bg-surface focus:p-3"
      >
        Saltar al contenido
      </a>

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <Link to="/" aria-label="NEXORA, inicio">
            <NexoraLogo />
          </Link>

          <nav
            aria-label="Navegación pública"
            className="flex flex-wrap items-center gap-4 text-sm font-medium sm:gap-6"
          >
            <a href="#formacion" className="hover:text-brand">
              Formación
            </a>
            <a href="#nosotros" className="hover:text-brand">
              Nosotros
            </a>
            <a href="#contacto" className="hover:text-brand">
              Contacto
            </a>

            <Link
              to="/login"
              className="rounded-lg border border-brand px-4 py-2 text-brand hover:bg-accent-soft"
            >
              Aula virtual
            </Link>
            <Link
              to="/registro"
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-hover"
            >
              Postularme
            </Link>
          </nav>
        </div>
      </header>

      <main id="contenido-publico" tabIndex={-1}>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-xs font-semibold tracking-widest text-brand">
              DESDE LA PAZ, HACIA TU FUTURO
            </p>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-brand sm:text-5xl lg:text-6xl">
              Conecta tu talento con lo que viene.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
              Formación técnica en programación y bases de datos, con apoyo
              académico en matemáticas y ciencias. Aprende en modalidad virtual,
              con horarios que se adaptan a tu día.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/registro" className={primaryButton}>
                Postularme
              </Link>

              <a
                href="#formacion"
                className="inline-flex items-center justify-center rounded-xl border border-brand px-5 py-3 font-semibold text-brand hover:bg-accent-soft"
              >
                Explorar nuestra formación
              </a>
            </div>

            <p className="mt-6 text-sm text-ink/70">
              Modalidad virtual · Tutorías gratuitas · Horarios flexibles
            </p>
          </div>

          <div className="relative">
            <img
              src="/images/nexora-hero.png"
              alt="Ilustración de tecnología y ciencias con una computadora, bases de datos y montañas andinas"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="w-full rounded-[2rem] border border-border object-cover shadow-xl shadow-brand/10"
            />

            <div className="relative mx-5 -mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <p className="font-semibold text-brand">
                Tecnología, ciencia y nuevas posibilidades.
              </p>
              <p className="mt-1 text-sm text-ink/70">
                Tu siguiente paso comienza con lo que quieres aprender.
              </p>
            </div>
          </div>
        </section>

        <section
          id="formacion"
          aria-labelledby="formation-title"
          className="scroll-mt-6 border-y border-border bg-surface"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <p className="text-sm font-semibold tracking-widest text-brand">
              ENCUENTRA TU CAMINO
            </p>

            <h2
              id="formation-title"
              className="mt-3 text-3xl font-bold text-brand sm:text-4xl"
            >
              Conocimiento que abre posibilidades.
            </h2>

            <p className="mt-4 max-w-2xl leading-relaxed text-ink/70">
              Explora nuestras áreas de formación técnica y apoyo académico.
              Consulta los programas, niveles y horarios disponibles con nuestro
              equipo.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {areas.map((area) => (
                <article
                  key={area.number}
                  className="flex flex-col rounded-2xl border border-border bg-canvas p-7"
                >
                  <span className="text-sm font-bold tracking-widest text-brand/60">
                    {area.number}
                  </span>

                  <h3 className="mt-5 text-2xl font-semibold text-brand">
                    {area.title}
                  </h3>

                  <p className="mt-4 flex-1 leading-relaxed text-ink/80">
                    {area.description}
                  </p>

                  <p className="mt-6 border-t border-border pt-4 text-sm text-ink/70">
                    {area.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="nosotros"
          aria-labelledby="about-title"
          className="mx-auto grid max-w-7xl scroll-mt-6 gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="rounded-[2rem] bg-brand p-8 text-white sm:p-10">
            <p className="text-sm font-semibold tracking-widest text-white/70">
              SOMOS NEXORA
            </p>

            <h2
              id="about-title"
              className="mt-5 text-3xl font-bold leading-tight sm:text-4xl"
            >
              Aprender también es encontrar tu próxima oportunidad.
            </h2>

            <div
              aria-hidden="true"
              className="mt-7 h-1 w-14 rounded-full bg-accent"
            />

            <p className="mt-7 leading-relaxed text-white/85">
              Desde La Paz, Bolivia, acercamos la formación técnica y el apoyo
              académico a quienes quieren desarrollar nuevas habilidades y
              fortalecer sus conocimientos.
            </p>

            <p className="mt-4 leading-relaxed text-white/85">
              Nuestra propuesta combina modalidad virtual, mensualidades
              accesibles y tutorías gratuitas para acompañarte mientras
              aprendes.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span
                  aria-hidden="true"
                  className="block h-2 w-8 rounded-full bg-accent"
                />

                <h3 className="mt-5 text-xl font-semibold text-brand">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-relaxed text-ink/75">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contacto"
          aria-labelledby="contact-title"
          className="scroll-mt-6 border-t border-border bg-accent-soft"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold tracking-widest text-brand">
                HABLEMOS DE TU SIGUIENTE PASO
              </p>

              <h2
                id="contact-title"
                className="mt-4 text-3xl font-bold text-brand sm:text-4xl"
              >
                ¿Qué te gustaría aprender?
              </h2>

              <p className="mt-5 max-w-lg leading-relaxed text-ink/80">
                Cuéntanos qué área te interesa. Consulta requisitos, costos y
                horarios antes de iniciar tu postulación.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${primaryButton} mt-7`}
              >
                Conversar por WhatsApp
              </a>
            </div>

            <address className="rounded-2xl border border-border bg-surface p-7 not-italic">
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm text-ink/70">WhatsApp</dt>
                  <dd className="mt-1 font-semibold text-brand">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      +591 611700006
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Correo electrónico</dt>
                  <dd className="mt-1 break-words font-semibold text-brand">
                    <a
                      href="mailto:nexora@edu.bo"
                      className="underline-offset-4 hover:underline"
                    >
                      nexora@edu.bo
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Ubicación</dt>
                  <dd className="mt-1 font-semibold text-brand">
                    La Paz, Bolivia
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Turnos de formación</dt>
                  <dd className="mt-1 font-semibold text-brand">
                    Mañana · Tarde · Noche
                  </dd>
                </div>
              </dl>
            </address>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-8 sm:px-8">
          <NexoraLogo />

          <p className="text-sm text-ink/70">NEXORA · La Paz, Bolivia</p>

          <Link
            to="/login"
            className="text-sm font-semibold text-brand underline underline-offset-4"
          >
            Acceder al aula virtual
          </Link>
        </div>
      </footer>
    </div>
  );
}
