import React from 'react'

type IconProps = { className?: string; style?: React.CSSProperties }

function IconSvg({ children, className, style }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/** Carrot with a leafy top — vegetables */
function CarrotIcon(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path
        d="M14.5 9.5c2 2 1.6 4.2-.6 6.4-2.6 2.6-6.3 4.6-8.4 5-1.4.3-2.7-1-2.4-2.4.4-2.1 2.4-5.8 5-8.4 2.2-2.2 4.4-2.6 6.4-.6Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M10.5 13.5 12 15" />
      <path d="M7.5 16.5 9 18" />
      <path d="M14.5 9.5c0-2.5 1.5-5 4-6" />
      <path d="M14.5 9.5c2.5 0 5-1.5 6-4" />
      <path d="M14.5 9.5c-.8-1.8-2.6-3-4.8-3" />
    </IconSvg>
  )
}

/** Wheat head on a stem — grains */
function WheatIcon(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path d="M12 22V8" />
      <path d="M12 14c0-3-2.3-5.2-5.3-5.2 0 3 2.3 5.2 5.3 5.2Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 14c0-3 2.3-5.2 5.3-5.2 0 3-2.3 5.2-5.3 5.2Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 9c0-2.6-2-4.6-4.6-4.6 0 2.6 2 4.6 4.6 4.6Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 9c0-2.6 2-4.6 4.6-4.6 0 2.6-2 4.6-4.6 4.6Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 8V5.5" />
      <path d="M12 5.5c-.2-1.3.2-2.6 1.2-3.5" />
      <path d="M12 5.5c.2-1.3-.2-2.6-1.2-3.5" />
    </IconSvg>
  )
}

/** Pea pod with peas — legumes */
function PeaPodIcon(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path
        d="M4.5 5.5C4.5 13.5 10.5 19.5 18.5 19.5c.7-1.1 1-2.4 1-3.9C19.5 9.3 14.7 4.5 8.4 4.5c-1.5 0-2.8.3-3.9 1Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M4.5 5.5C3.7 4.7 3.3 3.4 3.4 2" />
      <circle cx="9" cy="9" r="1.7" />
      <circle cx="12.6" cy="12.6" r="1.7" />
      <circle cx="16" cy="15.8" r="1.7" />
    </IconSvg>
  )
}

/** Acorn with cap and stem — other (nuts, seeds…) */
function AcornIcon(props: IconProps) {
  return (
    <IconSvg {...props}>
      <path
        d="M12 4.5c3.6 0 6.5 1.9 6.5 4.3 0 .7-.6 1.2-1.3 1.2H6.8c-.7 0-1.3-.5-1.3-1.2 0-2.4 2.9-4.3 6.5-4.3Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M7.5 10c0 4.3 1.8 7.2 4.5 9.7 2.7-2.5 4.5-5.4 4.5-9.7" />
      <path d="M12 4.5c0-1 .5-1.9 1.5-2.4" />
      <path d="M10.2 13.5c.4 1.9 1.1 3.4 2.1 4.7" />
    </IconSvg>
  )
}

const FOOD_TYPE_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  Carrot: CarrotIcon,
  Wheat: WheatIcon,
  PeaPod: PeaPodIcon,
  Acorn: AcornIcon,
}

export function FoodTypeIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = FOOD_TYPE_ICONS[name] ?? CarrotIcon
  return <Icon className={className} style={style} />
}
