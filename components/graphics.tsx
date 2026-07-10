// Lightweight, dependency-free background graphics (inline SVG) used to add depth
// and a modern, on-brand texture to sections. All CSP-safe (no external assets).

// A stylized Giza pyramids silhouette (three triangles on a shared baseline),
// in a 0..120 x 0..80 coordinate box. Reads unmistakably "Egypt" and stays crisp
// at any scale.
export const EGYPT_PATH =
  'M2 74 L22 44 L42 74 Z M20 74 L50 16 L80 74 Z M60 74 L86 30 L112 74 Z'

// A faint dotted grid, absolutely positioned to fill its (relative) parent.
export function DotGrid({
  className = '',
  color = '#ffffff',
  opacity = 0.12,
  gap = 22,
  radius = 1.4,
}: {
  className?: string
  color?: string
  opacity?: number
  gap?: number
  radius?: number
}) {
  const id = `dots-${gap}-${Math.round(opacity * 100)}`
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity }}>
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={gap / 2} cy={gap / 2} r={radius} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// A large decorative pyramids silhouette watermark for hero/section backgrounds.
export function EgyptWatermark({
  className = '',
  fill = '#ffffff',
  opacity = 0.06,
}: {
  className?: string
  fill?: string
  opacity?: number
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 80"
      className={`pointer-events-none absolute ${className}`}
      style={{ opacity }}
      fill={fill}
    >
      <path d={EGYPT_PATH} />
    </svg>
  )
}
