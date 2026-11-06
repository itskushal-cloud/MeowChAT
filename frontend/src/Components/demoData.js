// Static, illustrative demo content. No real people, no real availability.

export const SPACES = [
  { id: 'all', label: 'All spaces' },
  { id: 'college', label: 'College life' },
  { id: 'everyday', label: 'Everyday wins' },
  { id: 'balance', label: 'Work & rest' },
  { id: 'newcomers', label: 'Just getting started' },
]

export const INITIAL_POSTS = [
  {
    id: 'p1', space: 'college', author: 'quietmaple', time: 'Demo post',
    title: 'How do you handle feeling overwhelmed during college?',
    text: "Deadlines and group projects all landed in the same week. I'm trying to take one task at a time, but I'd love to hear what routines work for others.",
    hearts: 14, liked: false,
    replies: [
      { id: 'r1', author: 'slowriver', text: 'Writing the three most important things on a sticky note each morning helps me a lot.' },
      { id: 'r2', author: 'morninglight', text: 'A short walk between study blocks made my days feel less heavy.' },
    ],
  },
  {
    id: 'p2', space: 'everyday', author: 'morninglight', time: 'Demo post',
    title: 'Small things that helped me feel better this week',
    text: 'Mine was a ten-minute walk without my phone after lunch. Tiny, but it changed my afternoons. What was yours?',
    hearts: 21, liked: false,
    replies: [{ id: 'r3', author: 'softsparrow', text: 'Cooking one proper meal on Sunday. It felt like a little act of care.' }],
  },
  {
    id: 'p3', space: 'balance', author: 'slowriver', time: 'Demo post',
    title: 'Finding a healthy balance between work and rest',
    text: 'I keep treating rest as something I have to earn. Has anyone found a way to make it feel more normal?',
    hearts: 11, liked: false,
    replies: [],
  },
  {
    id: 'p4', space: 'newcomers', author: 'gentleharbor', time: 'Demo post',
    title: 'First time here. How did you start?',
    text: 'Feeling a bit nervous about posting. What helped you feel comfortable joining a community space?',
    hearts: 9, liked: false,
    replies: [{ id: 'r4', author: 'quietmaple', text: 'Reading for a few days first. There is no pressure to post anything.' }],
  },
]

export const THERAPISTS = [
  {
    id: 't1', name: 'Ananya R.', initials: 'AR',
    training: 'Final-year M.A. in Clinical Psychology',
    supervision: 'Weekly supervision from a licensed clinical psychologist',
    topics: ['Academic stress', 'Building routines'],
    languages: ['English', 'Hindi'],
    slots: ['Tomorrow · 10:00 AM', 'Tomorrow · 4:30 PM', 'Day after · 11:15 AM'],
  },
  {
    id: 't2', name: 'Kabir S.', initials: 'KS',
    training: 'M.Sc. Counselling Psychology, in supervised practice',
    supervision: 'Fortnightly group and individual supervision',
    topics: ['Transitions & loneliness', 'Self-esteem'],
    languages: ['English', 'Hindi'],
    slots: ['Tomorrow · 12:00 PM', 'Day after · 5:00 PM', 'Day after · 6:30 PM'],
  },
  {
    id: 't3', name: 'Meera T.', initials: 'MT',
    training: 'Postgraduate diploma in Counselling, supervised internship',
    supervision: 'Weekly supervision from a licensed counsellor',
    topics: ['Work–life balance', 'Managing overwhelm'],
    languages: ['English', 'Hindi'],
    slots: ['Tomorrow · 9:30 AM', 'Tomorrow · 7:00 PM', 'Day after · 2:00 PM'],
  },
]
