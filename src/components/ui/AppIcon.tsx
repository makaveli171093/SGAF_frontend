const paths = {
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18",
  database:
    "M21 5c0 2-4 3-9 3S3 7 3 5s4-3 9-3 9 1 9 3ZM3 5v14c0 2 4 3 9 3s9-1 9-3V5M3 12c0 2 4 3 9 3s9-1 9-3",
  science: "M9 3h6m-5 0v7L4 20q-1 2 2 2h12q3 0 2-2l-6-10V3M7 16h10M10 12h4",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  chart: "M4 3v17h17M8 15v-4m5 4V7m5 8V4",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  users:
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-2a7 7 0 0 1 14 0v2M17 4a4 4 0 0 1 0 7m3 10v-2a6 6 0 0 0-3-5",
  book: "M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z",
  calendar:
    "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2ZM7 14h2m6 0h2m-10 3h2",
  grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",
  task: "M9 3h6v4H9ZM9 5H5v16h14V5h-4M8 13l2 2 5-5M8 18h7",
  wallet: "M3 7V5a2 2 0 0 1 2-2h14v4M3 7h18v14H3ZM16 12h5v5h-5Zm-3-8H3",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  menu: "M4 6h16M4 12h16M4 18h16",
  exit: "M9 3H3v18h6m6-5 5-4-5-4m-7 4h12",
  check: "m5 12 4 4L19 6",
};
type AppIconName = keyof typeof paths;
export default function AppIcon({
  name,
  className = "",
}: {
  name: AppIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 ${className}`}
    >
      <path d={paths[name]} />
    </svg>
  );
}
