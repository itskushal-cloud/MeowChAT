import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { THERAPISTS } from '../data/demoData'

function CheckInsPage() {
  const { setBooking } = useAuth()
  const [openId, setOpenId] = useState(null)
  const [slot, setSlot] = useState('')
  const [confirmedId, setConfirmedId] = useState(null)

  const toggle = (id) => {
    setOpenId(openId === id ? null : id)
    setSlot('')
    setConfirmedId(null)
  }

  const confirm = (therapist) => {
    setBooking({ therapistId: therapist.id, slot })
    setConfirmedId(therapist.id)
  }

  return (
    <>
      <div className="page-head">
        <h1>Therapist check-ins</h1>
        <p>Short 15-minute conversations with trainee therapists. Take a look at who they are and how they are supervised.</p>
      </div>

      <p className="notice">
        Prototype: these profiles and times are illustrative, not real people or real availability.{' '}
        <Link className="text-link" to="/app/call">Preview the call room</Link>
      </p>

      <div className="therapist-grid">
        {THERAPISTS.map((t) => (
          <article className="therapist-card" key={t.id}>
            <div className="therapist-head">
              <span className="avatar">{t.initials}</span>
              <div>
                <h2>{t.name}</h2>
                <p className="muted">Trainee therapist <span className="badge">Demo profile</span></p>
              </div>
            </div>

            <dl className="therapist-facts">
              <div><dt>Training</dt><dd>{t.training}</dd></div>
              <div><dt>Supervision</dt><dd>{t.supervision}</dd></div>
              <div><dt>Languages</dt><dd>{t.languages.join(', ')}</dd></div>
            </dl>

            <p className="tags">
              {t.topics.map((topic) => <span className="tag" key={topic}>{topic}</span>)}
            </p>

            {openId === t.id ? (
              <div className="booking">
                <p className="muted">Choose a time (illustrative)</p>
                <div className="slot-list" role="group" aria-label={`Times with ${t.name}`}>
                  {t.slots.map((s) => (
                    <button key={s} className="slot" aria-pressed={slot === s} onClick={() => setSlot(s)}>
                      {s}
                    </button>
                  ))}
                </div>

                {confirmedId === t.id ? (
                  <p className="confirmed">
                    Saved as a demo booking. <Link className="text-link" to="/app/call">Join call room</Link>
                  </p>
                ) : (
                  <div className="inline-actions">
                    <button className="btn btn-primary btn-sm" disabled={!slot} onClick={() => confirm(t)}>
                      Confirm check-in
                    </button>
                    <button className="text-link" onClick={() => toggle(t.id)}>Cancel</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => toggle(t.id)}>
                Choose a time
              </button>
            )}
          </article>
        ))}
      </div>
    </>
  )
}

export default CheckInsPage
