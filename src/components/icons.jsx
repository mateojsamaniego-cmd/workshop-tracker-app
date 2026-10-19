// Iconos de trazo fino (estilo Notion), dibujados a mano para no sumar dependencias
function Svg({ children, size = 22, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconChevronLeft = (p) => <Svg {...p}><path d="M15 18l-6-6 6-6" /></Svg>
export const IconChevronDown = (p) => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>
export const IconSearch = (p) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></Svg>
export const IconCompose = (p) => <Svg {...p}><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><path d="M18.4 3.6a2 2 0 0 1 2.8 2.8L12 15.6 8.5 16.5l.9-3.5z" /></Svg>
export const IconFilter = (p) => <Svg {...p}><path d="M4 7h16M7 12h10M10 17h4" /></Svg>
export const IconHome = (p) => <Svg {...p}><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></Svg>
export const IconCar = (p) => <Svg {...p}><path d="M5 16V12l2-5h10l2 5v4z" /><path d="M5 12h14" /><circle cx="8" cy="16.5" r="1.5" /><circle cx="16" cy="16.5" r="1.5" /></Svg>
export const IconUser = (p) => <Svg {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></Svg>
export const IconPhone = (p) => <Svg {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></Svg>
export const IconCalendar = (p) => <Svg {...p}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></Svg>
export const IconClock = (p) => <Svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></Svg>
export const IconStatus = (p) => <Svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></Svg>
export const IconPage = (p) => <Svg {...p}><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Svg>
export const IconCamera = (p) => <Svg {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></Svg>
export const IconSend = (p) => <Svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Svg>
export const IconShare = (p) => <Svg {...p}><path d="M12 15V3M8 7l4-4 4 4" /><path d="M6 11H5v9h14v-9h-1" /></Svg>
export const IconCopy = (p) => <Svg {...p}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></Svg>
export const IconChat = (p) => <Svg {...p}><path d="M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6z" /></Svg>
export const IconLogout = (p) => <Svg {...p}><path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h10" /></Svg>
export const IconCheck = (p) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>
export const IconEye = (p) => <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>
export const IconLock = (p) => <Svg {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
export const IconExternal = (p) => <Svg {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Svg>
