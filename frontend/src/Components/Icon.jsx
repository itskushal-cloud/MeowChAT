// Small inline SVG icon set (no extra dependency needed)
function Icon({ name }) {
  const paths = {
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
    ear: <path d="M8 10a4 4 0 1 1 8 0c0 2-2 3-2 5a3 3 0 0 1-5 2M12 10a1.5 1.5 0 0 1 1.5 1.5" />,
    chat: <path d="M4 5h16v11H9l-5 4V5z" />,
    people: <><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2.2" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5M15.5 14.3c3 0 5.5 1.6 5.5 4.2" /></>,
    leaf: <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19c2-5 5-8 9-10" />,
    home: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
    video: <><rect x="3" y="6" width="12" height="12" rx="2" /><path d="M15 10l6-3v10l-6-3" /></>,
    videoOff: <><path d="M3 3l18 18" /><path d="M6 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1M15 9.5V8a2 2 0 0 0-2-2H9.5" /><path d="M15 10l6-3v10" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
    micOff: <><path d="M3 3l18 18" /><path d="M9 9v2a3 3 0 0 0 5 2M15 10V6a3 3 0 0 0-5.5-1.7M5 11a7 7 0 0 0 11 5.7M12 18v3" /></>,
    phoneOff: <path d="M3 13c4-4 14-4 18 0l-2 3-4-1v-2c-2-.7-4-.7-6 0v2l-4 1z" />,
    shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  }

  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export default Icon
