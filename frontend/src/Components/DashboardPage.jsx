import { Link } from 'react-router-dom'
import Icon from '../component/Icon'
import { useAuth } from '../context/AuthContext'
import { THERAPISTS } from '../data/demoData'

function DashboardPage() {
  const { session, setBooking } = useAuth()
  const booked = session.booking && THERAPISTS.find((t) => t.id === session.booking.therapistId)

  return (
    <>
      <div className="page-head">
        <h1>Welcome, {session.name}.</h1>
        <p>Take things at your own pace. Here are a few places you can begin.</p>
      </div>

      <div className="dash-grid">
        <article className="dash-card tone-peach">
          <Icon name="people" />
          <h2>Community</h2>
          <p>Read, share, and reply in gentle peer spaces. You appear under your anonymous name, <strong>{session.handle}</strong>.</p>
          <Link className="text-link" to="/app/community">Open community</Link>
        </article>

        <article className="dash-card tone-sage">
          <Icon name="chat" />
          <h2>Therapist check-ins</h2>
          <p>Browse trainee therapists, see how they are supervised, and pick a short 15-minute check-in.</p>
          <Link className="text-link" to="/app/check-ins">Browse check-ins</Link>
        </article>
      </div>

      <section className="upcoming" aria-labelledby="upcoming-title">
        <Icon name="calendar" />
        <div className="upcoming-body">
          <h2 id="upcoming-title">Your next check-in</h2>
          {booked ? (
            <>
              <p>
                <strong>{booked.name}</strong> · {session.booking.slot}
                <span className="badge">Demo booking</span>
              </p>
              <div className="inline-actions">
                <Link className="btn btn-primary btn-sm" to="/app/call">Join call room</Link>
                <button className="text-link" onClick={() => setBooking(null)}>Remove</button>
              </div>
            </>
          ) : (
            <p>
              Nothing planned yet, and that is completely fine.{' '}
              <Link className="text-link" to="/app/check-ins">Find a check-in</Link>
            </p>
          )}
        </div>
      </section>
    </>
  )
}

export default DashboardPage
