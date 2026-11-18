/** Composición decorativa. No representa métricas ni información académica. */
export default function CampusArtwork() {
  return (
    <svg
      className="campus-art"
      viewBox="0 0 280 240"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="140" cy="120" r="108" stroke="#7087AC" strokeOpacity=".3" />
      <circle cx="140" cy="120" r="80" stroke="#7087AC" strokeOpacity=".25" />
      <path d="M56 181V95a84 84 0 0 1 168 0v86" fill="#284365" />
      <path d="M84 181V99a56 56 0 0 1 112 0v82" fill="#3155D9" />
      <path d="M112 181V105a28 28 0 0 1 56 0v76" fill="#14253F" />
      <path
        d="M38 182h204M54 198h172M77 214h126"
        stroke="#9AB0D1"
        strokeOpacity=".5"
      />
      <circle cx="225" cy="48" r="22" fill="#65E3CF" />
      <path d="M216 48h18m-9-9v18" stroke="#14253F" strokeWidth="2" />
      <rect
        x="27"
        y="112"
        width="40"
        height="40"
        rx="10"
        fill="#DCE6FE"
        transform="rotate(-12 27 112)"
      />
      <path
        d="m37 131 7 5 8-13"
        stroke="#3155D9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="208" cy="172" r="7" fill="#BBA5EF" />
      <circle cx="64" cy="51" r="4" fill="#65E3CF" />
    </svg>
  );
}
