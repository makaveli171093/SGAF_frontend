import type { User } from "../../types/auth";
export default function Avatar({
  user,
}: {
  user: Pick<User, "firstName" | "lastName" | "avatarData">;
}) {
  return user.avatarData ? (
    <img
      src={user.avatarData}
      alt={`Foto de ${user.firstName} ${user.lastName}`}
      className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
    />
  ) : (
    <span
      aria-label={`${user.firstName} ${user.lastName}`}
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-lg font-bold text-brand"
    >
      {user.firstName.trim().charAt(0)}
      {user.lastName.trim().charAt(0)}
    </span>
  );
}
