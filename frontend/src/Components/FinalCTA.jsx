import { useNavigate } from 'react-router-dom'
import scrollToSection from './scrollToSection'

function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section className="final-cta">
      <div className="container final-inner">
        <h2>You don't have to figure everything out at once.</h2>
        <p className="lead">
          Start with a conversation, explore a community, or simply take a moment for yourself.
        </p>
        <div className="hero-actions center">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Get started</button>
          <button className="text-link" onClick={() => scrollToSection('approach')}>Explore our approach</button>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
