export default function NexoraLogo({
  light = false,
  campus = false,
}: {
  light?: boolean;
  campus?: boolean;
}) {
  return (
    <span className={`brand-logo${light ? " brand-logo--light" : ""}`}>
      <svg
        viewBox="0 0 48 48"
        width="44"
        height="44"
        fill="none"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="14" fill="#3155d9" />
        <path
          d="M14 34V14L34 34V14"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="14" r="4" fill="#65e3cf" />
      </svg>

      <span>
        <strong>NEXORA</strong>
        <small>
          {campus ? "Campus virtual · Bolivia" : "Formación técnica · Bolivia"}
        </small>
      </span>
    </span>
  );
}
