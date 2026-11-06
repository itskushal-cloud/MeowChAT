import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Logo from '../component/Logo'
import { useAuth } from '../context/AuthContext'

// Demo sign-in: no account is created and nothing is sent to a server
function LoginPage() {
  const { session, login } = useAuth()
  const [name, setName] = useState('')

  if (session) return <Navigate to="/app" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    login(name.trim())
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="brand">
          <Logo />
          <span className="brand-name">samvaad</span>
        </Link>

        <h1>Welcome in.</h1>
        <p className="lead">
          Take a look around the Samvaad experience. Tell us what to call you, or leave it blank.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="name">What should we call you? (optional)</label>
          <input
            id="name"
            type="text"
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="A first name or nickname"
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary">Continue to the demo</button>
        </form>

        <p className="fine-print left">
          Prototype sign-in: no account is created and nothing is stored on a server. You will be given a
          random anonymous name for community spaces.
        </p>
        <Link to="/" className="text-link">Back to home</Link>
      </div>
    </div>
  )
}

export default LoginPage
