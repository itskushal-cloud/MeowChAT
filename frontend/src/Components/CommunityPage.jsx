import { useState } from 'react'
import Icon from '../component/Icon'
import { useAuth } from '../context/AuthContext'
import { INITIAL_POSTS, SPACES } from '../data/demoData'

const spaceLabel = (id) => SPACES.find((s) => s.id === id)?.label ?? ''

function PostCard({ post, onLike, onReply }) {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [reported, setReported] = useState(false)

  const submitReply = (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    onReply(post.id, { id: crypto.randomUUID(), author: session.handle, text: reply.trim() })
    setReply('')
  }

  return (
    <article className="feed-post">
      <p className="feed-meta">
        <span className="tag">{spaceLabel(post.space)}</span>
        {post.author} · {post.time}
      </p>
      <h3>{post.title}</h3>
      {post.text && <p>{post.text}</p>}

      <div className="feed-actions">
        <button className="chip" aria-pressed={post.liked} onClick={() => onLike(post.id)}>
          <Icon name="heart" /> {post.hearts}
        </button>
        <button className="chip" aria-expanded={open} onClick={() => setOpen(!open)}>
          <Icon name="chat" /> {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
        </button>
        <button className="text-link quiet" onClick={() => setReported(true)} disabled={reported}>
          {reported ? 'Reported (demo)' : 'Report'}
        </button>
      </div>

      {open && (
        <div className="replies">
          {post.replies.map((r) => (
            <p className="reply" key={r.id}><strong>{r.author}</strong> {r.text}</p>
          ))}
          <form className="reply-form" onSubmit={submitReply}>
            <label htmlFor={`reply-${post.id}`} className="sr-only">Write a reply</label>
            <input
              id={`reply-${post.id}`}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Add a kind reply"
              maxLength={300}
            />
            <button type="submit" className="btn btn-ghost btn-sm">Reply</button>
          </form>
        </div>
      )}
    </article>
  )
}

function CommunityPage() {
  const { session } = useAuth()
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [active, setActive] = useState('all')
  const [draft, setDraft] = useState({ title: '', text: '', space: 'everyday' })

  const visible = active === 'all' ? posts : posts.filter((p) => p.space === active)

  const handleLike = (id) =>
    setPosts(posts.map((p) => (p.id === id ? { ...p, liked: !p.liked, hearts: p.hearts + (p.liked ? -1 : 1) } : p)))

  const handleReply = (id, reply) =>
    setPosts(posts.map((p) => (p.id === id ? { ...p, replies: [...p.replies, reply] } : p)))

  const handlePost = (e) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    const post = {
      id: crypto.randomUUID(), space: draft.space, author: session.handle, time: 'Just now',
      title: draft.title.trim(), text: draft.text.trim(), hearts: 0, liked: false, replies: [],
    }
    setPosts([post, ...posts])
    setDraft({ title: '', text: '', space: draft.space })
  }

  return (
    <>
      <div className="page-head">
        <h1>Community</h1>
        <p>A space to share and listen. Everything here is a demo, so posts stay in this browser tab only.</p>
      </div>

      <div className="community-layout">
        <aside className="community-side">
          <nav aria-label="Community spaces" className="space-list">
            {SPACES.map((s) => (
              <button
                key={s.id}
                className="space-btn"
                aria-current={active === s.id ? 'true' : undefined}
                onClick={() => setActive(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <section className="guidelines" aria-labelledby="guidelines-title">
            <Icon name="shield" />
            <h2 id="guidelines-title">Community guidelines</h2>
            <ul>
              <li>Listen first and be kind.</li>
              <li>Keep stories anonymous. Avoid personal details.</li>
              <li>Share experiences, not medical advice.</li>
              <li>Report anything that feels unsafe.</li>
            </ul>
            <p className="fine-print left">
              This is not an emergency service. If you are in immediate danger, contact local emergency services.
            </p>
          </section>
        </aside>

        <div className="community-feed">
          <form className="composer" onSubmit={handlePost}>
            <label htmlFor="post-title" className="sr-only">Post title</label>
            <input
              id="post-title"
              placeholder="What would you like to talk about?"
              value={draft.title}
              maxLength={120}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <label htmlFor="post-text" className="sr-only">Details (optional)</label>
            <textarea
              id="post-text"
              rows={3}
              placeholder="Add a little more, if you like"
              value={draft.text}
              maxLength={600}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            />
            <div className="composer-row">
              <label htmlFor="post-space" className="sr-only">Space</label>
              <select
                id="post-space"
                value={draft.space}
                onChange={(e) => setDraft({ ...draft, space: e.target.value })}
              >
                {SPACES.filter((s) => s.id !== 'all').map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!draft.title.trim()}>
                Share
              </button>
            </div>
            <p className="fine-print left">Posting as <strong>{session.handle}</strong></p>
          </form>

          {visible.length === 0 && <p className="empty">Nothing here yet. You could start the first conversation.</p>}
          {visible.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} onReply={handleReply} />
          ))}
        </div>
      </div>
    </>
  )
}

export default CommunityPage
