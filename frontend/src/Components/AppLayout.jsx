import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import Icon from './Icon'
import { useAuth } from '../context/AuthContext'

const APP_LINKS = [
  { to: '/app', label: 'Home', icon: 'home', end: true },
  { to: '/app/community', label: 'Community', icon: 'people' },
  { to: '/app/check-ins', label: 'Check-ins', icon: 'chat' },
  { to: '/app/call', label: 'Call room', icon: 'video' },
]

// Shared frame (top bar + footer note) for every signed-in page
function AppLayout() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="container app-topbar-inner">
          <Link to="/app" className="brand">
            <Logo />
            <span className="brand-name">samvaad</span>
          </Link>

          <nav className="app-nav" aria-label="Main">
            {APP_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className="app-nav-link">
                <Icon name={link.icon} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="app-user">
            <span className="app-handle">{session.handle}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="app-foot">
        <div className="container">
          <p>
            Prototype preview: content here is illustrative. Samvaad is not an emergency service and does
            not replace professional mental healthcare. If you are in immediate danger, please contact your
            local emergency services.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
