export function OrnamentRule({ label }: { label?: string }) {
  return (
    <div className="ornament-rule" aria-hidden="true">
      <span className="ornament-rule__line" />
      {label ? (
        <span className="ornament-rule__label">{label}</span>
      ) : (
        <span className="ornament-rule__diamond" />
      )}
      <span className="ornament-rule__line" />
    </div>
  )
}

export function CloudCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`cloud-corner ${className}`}
      viewBox="0 0 120 44"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 38c9 0 11-9 20-9s9 9 18 9 11-9 20-9 9 9 18 9 11-9 20-9 9 9 18 9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M18 27c7 0 8-6 15-6s8 6 15 6 8-6 15-6 8 6 15 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="96" cy="12" r="2.4" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
