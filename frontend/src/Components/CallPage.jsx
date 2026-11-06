import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../component/Icon'
import { useAuth } from '../context/AuthContext'
import { THERAPISTS } from '../data/demoData'

const CALL_SECONDS = 15 * 60

/* Opens the visitor's own camera and mic. Nothing is sent anywhere. */
function useLocalMedia() {
  const streamRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState('')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('This browser does not support camera access.')
        setMicOn(false)
        setCamOn(false)
        return
      }
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = s
        setStream(s)
      } catch {
        setError("We couldn't reach your camera or microphone. You can still look around the call screen.")
        setMicOn(false)
        setCamOn(false)
      }
    }

    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const toggleMic = () => {
    stream?.getAudioTracks().forEach((t) => { t.enabled = !micOn })
    setMicOn(!micOn)
  }
  const toggleCam = () => {
    stream?.getVideoTracks().forEach((t) => { t.enabled = !camOn })
    setCamOn(!camOn)
  }

  return { stream, error, micOn, camOn, toggleMic, toggleCam }
}

function VideoTile({ stream, camOn, label }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream || null
  }, [stream])

  const showVideo = stream && camOn

  return (
    <div className={`video-tile ${showVideo ? '' : 'cam-off'}`}>
      <video ref={ref} autoPlay playsInline muted />
      {!showVideo && <span className="avatar">{label}</span>}
    </div>
  )
}

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

function CallPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const media = useLocalMedia()
  const [joined, setJoined] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(CALL_SECONDS)

  const booked = session.booking && THERAPISTS.find((t) => t.id === session.booking.therapistId)
  const therapist = booked || THERAPISTS[0]
  const initials = (session.name || 'You').slice(0, 1).toUpperCase()

  useEffect(() => {
    if (!joined) return
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [joined])

  const endCall = () => navigate('/app')

  /* ---------- Lobby ---------- */
  if (!joined) {
    return (
      <>
        <div className="page-head">
          <h1>Call room</h1>
          <p>Check your camera and microphone before you join. Take a moment to settle in.</p>
        </div>

        <div className="lobby-grid">
          <div className="lobby-preview">
            <VideoTile stream={media.stream} camOn={media.camOn} label={initials} />
          </div>

          <div className="lobby-side">
            <h2>{booked ? `Check-in with ${therapist.name}` : 'Demo call room'}</h2>
            <p className="muted">{booked ? session.booking.slot : 'No check-in booked, so this is a preview.'}</p>

            {media.error && <p className="notice">{media.error}</p>}

            <div className="call-controls left">
              <button className={`call-btn ${media.micOn ? '' : 'is-off'}`} onClick={media.toggleMic}
                aria-label={media.micOn ? 'Mute microphone' : 'Unmute microphone'} aria-pressed={!media.micOn}>
                <Icon name={media.micOn ? 'mic' : 'micOff'} />
              </button>
              <button className={`call-btn ${media.camOn ? '' : 'is-off'}`} onClick={media.toggleCam}
                aria-label={media.camOn ? 'Turn camera off' : 'Turn camera on'} aria-pressed={!media.camOn}>
                <Icon name={media.camOn ? 'video' : 'videoOff'} />
              </button>
            </div>

            <button className="btn btn-primary" onClick={() => setJoined(true)}>Join call</button>
            <p className="fine-print left">
              Prototype only: this previews the call experience. Nobody else can see or hear you, nothing is
              recorded, and your camera stays on your device.
            </p>
          </div>
        </div>
      </>
    )
  }

  /* ---------- In the call ---------- */
  return (
    <>
      <div className="call-stage">
        <span className="call-timer">
          {secondsLeft > 0 ? `${formatTime(secondsLeft)} left` : "Your 15 minutes are up"}
        </span>

        <div className="call-remote">
          <span className="avatar avatar-lg">{therapist.initials}</span>
          <p className="call-name">{therapist.name}</p>
          <p className="call-sub">Demo room. In the full version, your therapist would appear here.</p>
        </div>

        <div className="call-self">
          <VideoTile stream={media.stream} camOn={media.camOn} label={initials} />
        </div>
      </div>

      <div className="call-controls">
        <button className={`call-btn ${media.micOn ? '' : 'is-off'}`} onClick={media.toggleMic}
          aria-label={media.micOn ? 'Mute microphone' : 'Unmute microphone'} aria-pressed={!media.micOn}>
          <Icon name={media.micOn ? 'mic' : 'micOff'} />
        </button>
        <button className={`call-btn ${media.camOn ? '' : 'is-off'}`} onClick={media.toggleCam}
          aria-label={media.camOn ? 'Turn camera off' : 'Turn camera on'} aria-pressed={!media.camOn}>
          <Icon name={media.camOn ? 'video' : 'videoOff'} />
        </button>
        <button className="call-btn end" onClick={endCall}>
          <Icon name="phoneOff" /> Leave call
        </button>
      </div>

      <p className="fine-print">
        Prototype only: nobody else can see or hear you, and nothing is recorded.
      </p>
    </>
  )
}

export default CallPage
