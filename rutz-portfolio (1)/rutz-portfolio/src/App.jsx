import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── WALLPAPER ────────────────────────────────────────────────────────────────
const Wallpaper = () => (
  <div className="fixed inset-0" style={{ zIndex: 0 }}>
    {/* Wallpaper image */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: "url('/wallpaper.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }} />
    {/* Dark overlay */}
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1,
      background: 'rgba(0,0,0,0.45)',
      pointerEvents: 'none',
    }} />
    {/* Watermark */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <span style={{
        fontSize: '8vw', opacity: 0.04, userSelect: 'none',
        color: '#e8d5b7', letterSpacing: '-0.02em',
      }}>
        <span style={{ fontFamily: 'DM Serif Display, serif' }}>PORT</span>
        <span style={{ fontFamily: 'Inter, system-ui', fontWeight: 300 }}>folio</span>
      </span>
    </div>
  </div>
)

// ─── MENU BAR ─────────────────────────────────────────────────────────────────
const MenuBar = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = time.toLocaleString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  return (
    <div className="fixed top-0 left-0 right-0 h-7 flex items-center justify-between px-4 z-50"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Left: RR badge + name */}
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded text-xs font-semibold"
          style={{ border: '1px solid #e8d5b7', background: 'rgba(0,0,0,0.5)', color: '#e8d5b7', fontFamily: 'Inter, system-ui', fontSize: 10 }}>
          RR
        </span>
        <span style={{ fontFamily: 'Inter, system-ui', fontWeight: 300, color: '#e8d5b7', fontSize: 12 }}>rutuja rochkari</span>
      </div>
      {/* Right: clock + location */}
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: 'Inter, system-ui', color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{fmt}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>·</span>
        <span style={{ fontFamily: 'Inter, system-ui', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>bengaluru, india</span>
      </div>
    </div>
  )
}

// ─── TRAFFIC LIGHTS ───────────────────────────────────────────────────────────
const TrafficLights = ({ onClose, onMinimize }) => (
  <div className="flex gap-1.5 items-center">
    <button onClick={onClose} className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
      style={{ background: '#ff5f57', border: '0.5px solid rgba(0,0,0,0.3)' }}>
      <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none font-bold" style={{ color: '#800000' }}>✕</span>
    </button>
    <button onClick={onMinimize} className="w-3 h-3 rounded-full flex items-center justify-center group transition-all"
      style={{ background: '#ffbd2e', border: '0.5px solid rgba(0,0,0,0.3)' }}>
      <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none font-bold" style={{ color: '#7a5700' }}>−</span>
    </button>
    <div className="w-3 h-3 rounded-full" style={{ background: '#28c940', border: '0.5px solid rgba(0,0,0,0.3)' }} />
  </div>
)

// ─── WINDOW CHROME ────────────────────────────────────────────────────────────
const WindowChrome = ({ id, title, children, onClose, onMinimize, zIndex, onFocus, defaultPos, defaultSize, style = {} }) => {
  const [pos, setPos] = useState(defaultPos || { x: 100, y: 60 })
  const isDragging = useRef(false)
  const startMouse = useRef({})
  const startPos = useRef({})

  const onMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea')) return
    onFocus(id)
    isDragging.current = true
    startMouse.current = { x: e.clientX, y: e.clientY }
    startPos.current = { ...pos }
  }
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return
      setPos({
        x: startPos.current.x + e.clientX - startMouse.current.x,
        y: startPos.current.y + e.clientY - startMouse.current.y,
      })
    }
    const onUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onMouseDown={() => onFocus(id)}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: `0 25px 60px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.1)`,
        ...defaultSize,
        ...style,
      }}
    >
      <div
        onMouseDown={onMouseDown}
        className="flex items-center gap-2 px-3 select-none cursor-grab active:cursor-grabbing"
        style={{ height: 36, background: 'rgba(20,14,28,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <TrafficLights onClose={() => onClose(id)} onMinimize={() => onMinimize(id)} />
        <span className="flex-1 text-center text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, system-ui' }}>{title}</span>
      </div>
      <div style={{ background: 'rgba(14,10,22,0.97)', backdropFilter: 'blur(20px)', height: 'calc(100% - 36px)', overflow: 'auto' }}>
        {children}
      </div>
    </motion.div>
  )
}

// ─── NOTES / ABOUT APP ────────────────────────────────────────────────────────
const NotesContent = () => (
  <div className="h-full flex" style={{ background: 'rgba(18,12,28,1)' }}>
    <div className="w-48 flex-shrink-0 border-r" style={{ background: 'rgba(14,9,22,1)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="rounded-md px-2 py-1 text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>🔍 Search</div>
      </div>
      <div className="p-2">
        <p className="text-xs px-2 py-1 mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Pinned</p>
        <div className="rounded-md px-2 py-2 mb-1" style={{ background: 'rgba(232,213,183,0.1)', border: '1px solid rgba(232,213,183,0.15)' }}>
          <p className="text-xs font-medium mb-0.5" style={{ color: '#e8d5b7' }}>📌 about.txt</p>
          <p className="text-xs truncate" style={{ color: 'rgba(232,213,183,0.4)' }}>rutuja rochkari. growth...</p>
        </div>
      </div>
    </div>
    <div className="flex-1 p-6 overflow-auto">
      <p className="text-xs mb-4 text-center" style={{ color: 'rgba(232,213,183,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>Apr 28, 2026</p>
      <pre className="text-sm leading-7 whitespace-pre-wrap" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8d5b7' }}>{`rutuja rochkari.
growth marketer. bengaluru.

I build 0-1 growth systems and prove they work.

Previously:
→ The State Plate (D2C)
→ Liquide (Fintech)
→ Hopstack (B2B SaaS)
→ Freelance (F&B / Creative Strategy)

What I'm good at:
· Full-funnel content strategy 
  (awareness to conversion)
· Performance marketing & campaign execution
· Creative direction & visual storytelling
· Social media growth & trend-led content
· Translating product features into 
  user-first narratives

Numbers that matter:
· 45x app downloads. zero paid budget.
· Email open rate: 8–10% → 35.3% (75K subs)
· AOV +30% (₹808 → ₹1,047)
· Instagram: 45K followers, 5M+ views
· WhatsApp community: 1K → 6K members

────────────────────────────────────

other things about me:

· pop culture enthusiast. avid sports fan.
· premier league / ucl stan.
  NOT a verstappen fan. (never.)
· daily puzzle solver.
  wordle opening word: "spare"
  (sometimes "grief". sad girl era.)
· into cooking, fiction, scrap journaling,
  and all forms of media
· languages: English, Hindi, Marathi
  + ciao! (currently learning italian)
· creative split: 30% content, 70% design
· first person to be offered a job at 
  NIFT 2018 placement.
· failed CA entrance 4 times. 
  best thing that ever happened to me.
· surprisingly good at remembering passwords.

────────────────────────────────────

tools I've worked with:
Meta Ads Manager · Google Ads · Google Analytics
Pinterest Ads · Framer · Figma · Lovable
ClickUp · Mailchimp · Zapier · Ahrefs
SEMrush · Google Search Console · NotebookLM
Perplexity · Claude · ChatGPT

certifications:
Google Ads · Google Analytics
Meta Creative · LinkedIn Project Management
BA — Digital Marketing & Communications`}</pre>
    </div>
  </div>
)

// ─── FINDER / WORK APP ────────────────────────────────────────────────────────
const caseStudies = {
  'The State Plate': {
    tags: ['full-time', 'app growth', 'email revival', 'offline'],
    sections: [
      { label: 'CHALLENGE', text: 'A regional Indian food brand with near-dead app adoption (150 downloads), email open rates at 8%, and no growth playbook to inherit. One marketer. Zero budget.' },
      { label: 'WHAT I DID', text: 'Built the entire growth engine from scratch: web experience optimisation, customer journeys, social media, content strategy, performance marketing, and offline event management. Website, app, emails, ads — all of it, end to end.' },
      { label: 'OUTCOME', bullets: ['↑ 45x app downloads (150 → 7,000). $0 paid budget.', '↑ App drove ~20% of total daily orders', '↑ Email open rate: 8–10% → 35.3% across 75K subscribers', '↑ AOV up 30% (₹808 → ₹1,047)', '↑ Instagram: 45K followers, 5M+ views', '↑ WhatsApp community: 1,000 → 6,000 members', '↑ Turned offline events into repeatable acquisition channels', '↑ Reduced inventory waste while growing revenue'] },
      { label: 'WHAT I LEARNED', text: "Adoption fails when the experience doesn't justify behaviour change. Lifecycle marketing only works when the infrastructure is clean. Operational problems can double as GTM opportunities. For D2C, product, marketing, and ops are tightly intertwined." },
    ]
  },
  'Liquide': {
    tags: ['internship', 'social media revamp', 'influencer marketing'],
    sections: [
      { label: 'CHALLENGE', text: 'A SEBI-registered stock investment platform launching LiMO — an in-app AI advisory chatbot — with zero social proof, zero community, and no existing content presence.' },
      { label: 'WHAT I DID', text: 'Orchestrated a zero-to-one influencer launch coordinating with 100+ LinkedIn micro-influencers and channels. Built the Instagram page from scratch. Wrote all content end to end: video scripts, website copy, emailers, app push notifications.' },
      { label: 'OUTCOME', bullets: ['↑ 100,000+ impressions from launch campaign', '↑ 1,000+ app downloads', '↑ 100+ qualified leads', '↑ Instagram: 0 → 10,000 followers'] },
    ]
  },
  'Hopstack': {
    tags: ['internship', 'content marketing', 'newsletter', 'SEO'],
    sections: [
      { label: 'CHALLENGE', text: 'A B2B digital warehouse management SaaS with a genuinely complex product and no content foundation to reach supply chain decision-makers and operations leads — an audience that has no time for fluff.' },
      { label: 'WHAT I DID', text: "Built the content foundation from zero. Managed website CMS, ran off-page SEO across blogs and landing pages, and operated newsletters on LinkedIn and beehiiv." },
      { label: 'OUTCOME', bullets: ['↑ Full content library and publishing cadence built', '↑ SEO groundwork laid for long-term organic traffic', '↑ LinkedIn + blog consistently populated'] },
    ]
  },
  'Freelance': {
    tags: ['freelance', 'creative strategy', 'CRM', 'F&B'],
    sections: [
      { label: 'CHALLENGE', text: '[FILL IN — your freelance project details here]' },
      { label: 'WHAT I DID', text: '[Fill in]' },
      { label: 'OUTCOME', text: '[Fill in]' },
    ]
  },
  '✦ Spec Work — Littlebird': {
    tags: ['spec work', 'GTM strategy', 'competitive analysis', 'channel strategy'],
    special: true,
    sections: [
      { label: 'CHALLENGE', text: 'Littlebird is growing 10–15% week-on-week but the content engine is built on one-off viral moments (1.4M views on X, organic TikTok UGC) with no repeatable playbook behind them.' },
      { label: 'WHAT I DID', text: 'Conducted a full social + GTM audit across 6 channels (X, Instagram, TikTok, LinkedIn, Threads, Blog) for January–April 2026. Mapped ICP, ran competitor teardowns (vs. Recall, Rewind, Granola), and built a tiered phased execution plan — using Littlebird itself as the primary research tool throughout.' },
      { label: 'OUTCOME', bullets: ['→ 3 strategic priorities identified', '→ Phased execution plan: 0–2 / 2–6 / 6–12 weeks', '→ Delivered as a navigable Notion mini-site', '→ Sent to the CEO as a job application. Because showing > telling.'] },
    ]
  },
}

const ImagePlaceholder = () => (
  <div style={{
    height: 180, background: '#1a1a1a', border: '2px dashed #333',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, flexShrink: 0,
  }}>
    <img src="" alt="" style={{ display: 'none' }} />
    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Inter, system-ui' }}>
      [add screenshot]
    </span>
  </div>
)

const FinderContent = ({ openWindow }) => {
  const [active, setActive] = useState('The State Plate')
  const study = caseStudies[active]
  return (
    <div className="h-full flex" style={{ background: 'rgba(14,9,22,1)' }}>
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0 border-r p-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs px-2 mb-2 font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>WORK</p>
        {Object.keys(caseStudies).map(name => (
          <button key={name} onClick={() => setActive(name)}
            className="w-full text-left rounded-md px-2 py-1.5 mb-0.5 text-xs flex items-center gap-2 transition-all"
            style={{
              background: active === name ? 'rgba(232,213,183,0.12)' : 'transparent',
              color: active === name ? '#e8d5b7' : 'rgba(255,255,255,0.55)',
              border: active === name ? '1px solid rgba(232,213,183,0.2)' : '1px solid transparent',
            }}>
            <span>{name.startsWith('✦') ? '✦' : '📁'}</span>
            <span className="truncate">{name.startsWith('✦') ? name.slice(2) : name}</span>
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 p-5 overflow-auto">
        <div className="mb-3">
          <h2 className="text-base font-semibold mb-1.5" style={{ color: '#e8d5b7', fontFamily: 'DM Serif Display, serif' }}>
            {active}
          </h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {study.tags.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,213,183,0.1)', border: '1px solid rgba(232,213,183,0.2)', color: '#e8d5b7', fontFamily: 'Inter, system-ui' }}>{t}</span>
            ))}
          </div>
        </div>
        <div className="border-t mb-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <ImagePlaceholder />
        {study.sections.map((s, i) => (
          <div key={i} className="mb-4">
            <p className="text-xs font-bold mb-1.5 tracking-widest" style={{ color: 'rgba(232,213,183,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>{s.label}</p>
            {s.text && <p className="text-sm leading-6" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, system-ui' }}>{s.text}</p>}
            {s.bullets && (
              <ul className="space-y-1">
                {s.bullets.map((b, j) => (
                  <li key={j} className="text-xs leading-5" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'JetBrains Mono, monospace' }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MESSAGES APP ─────────────────────────────────────────────────────────────
const MessagesContent = ({ openWindow }) => {
  const msgs = [
    { side: 'left', text: "can you actually drive growth\nor do you just talk about it" },
    { side: 'right', text: "45x app downloads. zero budget.\nwant the breakdown?" },
    { side: 'left', text: "...send it" },
    { side: 'right', isLink: true },
    { side: 'right', text: "or email me: hey@rutujarochkari.com" },
  ]
  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(14,9,22,1)' }}>
      {/* Header with profile */}
      <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(18,12,28,1)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #e8d5b7, #c4a882)' }}>👤</div>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>hiring manager? 🤔</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>last seen: whenever you found this</p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.side === 'right' ? 'justify-end' : 'justify-start'}`}>
            {m.isLink ? (
              <button onClick={() => openWindow && openWindow('finder')}
                className="px-3 py-2 rounded-2xl text-sm underline transition-opacity hover:opacity-80"
                style={{ background: '#1d6af5', color: 'white', maxWidth: 220, fontFamily: 'Inter, system-ui' }}>
                view my work ↗
              </button>
            ) : (
              <div className="px-3 py-2 rounded-2xl text-sm whitespace-pre-line"
                style={{
                  background: m.side === 'right' ? '#1d6af5' : 'rgba(50,38,68,0.9)',
                  color: 'rgba(255,255,255,0.95)',
                  maxWidth: 220,
                  borderRadius: m.side === 'right' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontFamily: 'Inter, system-ui',
                }}>
                {m.text}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, system-ui' }}>Read</p>
        </div>
      </div>
      {/* Input */}
      <div className="px-3 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(18,12,28,1)' }}>
        <div className="rounded-full px-3 py-2 text-xs flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily: 'Inter, system-ui' }}>type something (or don't, I'll know)</span>
          <span style={{ color: '#1d6af5' }}>↑</span>
        </div>
      </div>
    </div>
  )
}

// ─── CALENDAR APP ─────────────────────────────────────────────────────────────
const CalendarContent = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const slots = [
    { day: 0, time: '11:00 AM' },
    { day: 1, time: '2:00 PM' },
    { day: 3, time: '10:00 AM' },
    { day: 4, time: '3:00 PM' },
  ]
  return (
    <div className="h-full flex flex-col p-5" style={{ background: 'rgba(14,9,22,1)' }}>
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-0.5" style={{ color: '#e8d5b7', fontFamily: 'DM Serif Display, serif' }}>let's talk — 15 mins</h2>
        <p className="text-xs" style={{ color: 'rgba(232,213,183,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>week of apr 28, 2026</p>
      </div>
      <div className="grid gap-2 mb-5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {days.map((d, i) => {
          const daySlots = slots.filter(s => s.day === i)
          return (
            <div key={d} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, system-ui' }}>{d}</p>
              {daySlots.length > 0 ? daySlots.map((s, j) => (
                <div key={j} className="rounded-lg px-1 py-1.5 mb-1 text-xs" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontFamily: 'Inter, system-ui' }}>
                  ● {s.time}
                </div>
              )) : (
                <div className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.12)' }}>—</div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-sm mb-5 italic" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, system-ui' }}>"I'm a morning person after 11am."</p>
      <a href="https://cal.com/rutz" target="_blank" rel="noopener noreferrer"
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all hover:opacity-90 block mb-4"
        style={{ background: '#e8d5b7', color: '#0d0a16', fontFamily: 'Inter, system-ui' }}>
        book a slot →
      </a>
      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, system-ui' }}>no prep needed. no formal interview vibes.</p>
    </div>
  )
}

// ─── TERMINAL APP ─────────────────────────────────────────────────────────────
const TerminalContent = () => {
  const fullText = `$ whoami
> rutz. growth marketer. space girl.

$ cat skills.txt
> full-funnel content strategy
  performance marketing
  GTM + launch strategy
  community growth
  lifecycle & CRM
  AI-native workflow

$ cat status.txt
> open to: growth / PMM roles
  at PLG-led startups
  based in bangalore. open to remote.

$ ping portfolio-analytics
> connection established.
  visitors tracked: 11
  avg time on site: ~18 minutes.
  cta click rate: 60%.
  (yes i track this. i'm that person.)

$ `

  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef(0)
  useEffect(() => {
    const t = setInterval(() => {
      if (idx.current < fullText.length) {
        setDisplayed(fullText.slice(0, idx.current + 1))
        idx.current++
      } else {
        setDone(true)
        clearInterval(t)
      }
    }, 22)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="h-full p-4 overflow-auto" style={{ background: '#0d0d0d' }}>
      <pre className="text-sm leading-6 whitespace-pre-wrap" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e2e8f0' }}>
        {displayed}
        {done && <span style={{ color: '#e8d5b7' }}>█</span>}
      </pre>
      <style>{`.blink{animation:blink 1s step-end infinite}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  )
}

// ─── PHOTOS / GALLERY APP ─────────────────────────────────────────────────────
const PhotosContent = () => {
  const [expanded, setExpanded] = useState(false)
  const inspo = [
    'Patagonia (YouTube)', 'Really Good Emails', 'Duolingo — UX copy & conversational design',
    'Life of Riza — cinematography & storytelling', 'Huckberry — DIRT series', 'NYT Cooking (YouTube)',
    'Morning Brew Inc. — all forms of media', 'SURREAL (LinkedIn) — obviously',
    "Ryanair / Domino's UK — X engagement done right", 'DSC — "Our Blades Are F***ing Great"',
    'Bridgways (X) — football graphics',
  ]
  return (
    <div className="h-full overflow-auto p-5" style={{ background: 'rgba(14,9,22,1)' }}>
      <p className="text-xs italic mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, system-ui' }}>
        campaigns, content, stills, things that made me feel something. updated occasionally.
      </p>
      {/* Masonry grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            background: '#1a1a1a', border: '1.5px dashed #333', borderRadius: 8,
            minHeight: 160, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#555' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '#333' }}>
            <img src="" alt="" style={{ display: 'none' }} />
            <span style={{ fontSize: 20, marginBottom: 6, opacity: 0.3 }}>🖼️</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'Inter, system-ui' }}>[add image/video]</span>
          </div>
        ))}
      </div>
      {/* Collapsible inspo section */}
      <button onClick={() => setExpanded(e => !e)}
        className="text-xs flex items-center gap-2 mb-3 transition-opacity hover:opacity-70"
        style={{ color: '#e8d5b7', fontFamily: 'Inter, system-ui', background: 'none', border: 'none', cursor: 'pointer' }}>
        <span>{expanded ? '▾' : '▸'}</span>
        <span>campaigns / content i love ♥</span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}>
            <ul className="space-y-1.5 mb-4">
              {inspo.map((item, i) => (
                <li key={i} className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, system-ui' }}>· {item}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── FAQ WINDOW ───────────────────────────────────────────────────────────────
const faqs = [
  { q: 'what got you into marketing?', a: 'Honestly? Failed CA exams. Had to pivot fast and found that I was better at storytelling than spreadsheets. Enrolled in digital marketing, landed my first internship, and never looked back.' },
  { q: "what's your biggest achievement?", a: '45x app downloads with zero paid budget at The State Plate. I built the entire growth engine — social, email, app, events — from scratch. It worked. That one lives rent-free in my head.' },
  { q: 'how do you explain the gap?', a: "There's no gap to explain — I've been freelancing, upskilling, and building spec work. The Littlebird GTM audit is a good example. I'd rather show what I did with the time." },
  { q: 'advice for your younger self?', a: "Stop trying to fit into the MBA-shaped box. Your taste is a skill. Your obsession with pop culture and how things work together — that's the job." },
  { q: "anything you can't do?", a: "Paid search at scale without a bit of setup time. Not a developer. Can't drive. That's about it." },
  { q: 'why should we hire you?', a: "Because I don't just plan growth — I build it. I've done this with one person and zero budget. With a team and resources, I'll do it faster." },
]

const FAQContent = () => {
  const [open, setOpen] = useState(null)
  return (
    <div className="h-full overflow-auto p-5" style={{ background: 'rgba(14,9,22,1)', fontFamily: 'JetBrains Mono, monospace' }}>
      <p className="text-xs mb-5" style={{ color: 'rgba(232,213,183,0.4)' }}>faqs.txt</p>
      {faqs.map((f, i) => (
        <div key={i} className="mb-3 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(232,213,183,0.12)' }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-4 py-3 text-sm flex justify-between items-center transition-all hover:opacity-80"
            style={{ background: open === i ? 'rgba(232,213,183,0.08)' : 'rgba(255,255,255,0.02)', color: '#e8d5b7', fontFamily: 'JetBrains Mono, monospace' }}>
            <span>→ {f.q}</span>
            <span style={{ color: 'rgba(232,213,183,0.4)', fontSize: 10 }}>{open === i ? '▾' : '▸'}</span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}>
                <p className="px-4 pb-4 pt-2 text-sm leading-6" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, system-ui' }}>{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// ─── GUESTBOOK WINDOW ─────────────────────────────────────────────────────────
const GuestbookContent = () => {
  const [submitted, setSubmitted] = useState(false)
  const [text, setText] = useState('')
  return (
    <div className="h-full p-6 flex flex-col" style={{ background: 'rgba(14,9,22,1)' }}>
      <h2 className="text-lg mb-1" style={{ color: '#e8d5b7', fontFamily: 'DM Serif Display, serif' }}>leave a note.</h2>
      <p className="text-xs italic mb-5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, system-ui' }}>
        a note, some feedback, perhaps your credit card details? or don't. i won't know. this is anonymous.
      </p>
      {!submitted ? (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            placeholder="say something..."
            className="w-full rounded-xl p-3 text-sm mb-3 resize-none outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(232,213,183,0.25)',
              color: '#e8d5b7',
              fontFamily: 'Inter, system-ui',
            }}
          />
          <button
            onClick={() => text.trim() && setSubmitted(true)}
            className="self-start px-5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: '#e8d5b7', color: '#0d0a16', fontFamily: 'Inter, system-ui' }}>
            submit
          </button>
          {/* TODO: connect to Supabase signatures table */}
        </>
      ) : (
        <p className="text-sm" style={{ color: '#e8d5b7', fontFamily: 'Inter, system-ui' }}>
          noted. stalk on linkedin first though →{' '}
          <a href="https://linkedin.com/in/rutujarochkari" target="_blank" rel="noopener noreferrer"
            style={{ color: '#e8d5b7', textDecoration: 'underline' }}>
            linkedin.com/in/rutujarochkari
          </a>
        </p>
      )}
    </div>
  )
}

// ─── PROJECTS WINDOW ──────────────────────────────────────────────────────────
const ProjectsContent = () => {
  const projects = [
    { name: 'thrdspace', type: 'Interactive Map · Community', desc: 'A community-built map for discovering third places in Pune — cafés, parks, libraries, and hidden gems.', status: 'not ready yet.', statusColor: '#f59e0b' },
    { name: 'sports 101', type: 'Knowledge Base', desc: "A beginner's guide to keeping up with the sports world.", status: 'not ready yet.', statusColor: '#f59e0b' },
    { name: 'linkd', type: 'Game · Trivia', desc: 'An AI-powered connection game that weaves any 5 things — a place, a person, an object — into a surprising chain of links, visualised live on a rotating globe.', status: 'not ready yet.', statusColor: '#f59e0b' },
    { name: 'misc', type: 'for the funsies', desc: 'random claude side quests.', status: 'always in progress.', statusColor: '#34d399' },
  ]
  return (
    <div className="h-full overflow-auto p-5" style={{ background: 'rgba(14,9,22,1)' }}>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {projects.map((p, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold" style={{ color: '#e8d5b7', fontFamily: 'DM Serif Display, serif' }}>{p.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0" style={{ background: p.statusColor + '22', color: p.statusColor, border: `1px solid ${p.statusColor}44`, fontFamily: 'Inter, system-ui' }}>
                {p.status}
              </span>
            </div>
            <p className="text-xs mb-2 px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(232,213,183,0.08)', color: 'rgba(232,213,183,0.6)', fontFamily: 'Inter, system-ui' }}>{p.type}</p>
            <p className="text-xs leading-5" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, system-ui' }}>{p.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs italic" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, system-ui' }}>either you're early, or I'm late !!!!</p>
    </div>
  )
}

// ─── INTRO VIDEO WINDOW ───────────────────────────────────────────────────────
const IntroVideoContent = ({ onSkip }) => {
  const videoRef = useRef(null)
  return (
    <div className="h-full p-4 flex flex-col" style={{ background: 'rgba(14,9,22,1)' }}>
      <video ref={videoRef} src="/intro.mp4" controls style={{ width: '100%', borderRadius: 4 }} />
      <p className="text-xs italic mt-3 mb-4" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, system-ui' }}>
        check out the video to know more about my journey →
      </p>
      <div className="flex gap-3">
        <button onClick={() => videoRef.current?.play()}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
          style={{ background: '#e8d5b7', color: '#0d0a16', fontFamily: 'Inter, system-ui' }}>
          watch
        </button>
        <button onClick={onSkip}
          className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-60"
          style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent', fontFamily: 'Inter, system-ui' }}>
          skip →
        </button>
      </div>
    </div>
  )
}

// ─── DOCK ICON ────────────────────────────────────────────────────────────────
const DockIcon = ({ label, icon, onClick, isOpen, isMinimized }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="flex flex-col items-center relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute -top-8 px-2 py-1 rounded-md text-xs whitespace-nowrap pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.85)', color: '#e8d5b7', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, system-ui' }}>
            {label}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.25, y: -8 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg select-none relative"
        style={{
          background: isOpen ? 'rgba(232,213,183,0.12)' : 'rgba(255,255,255,0.07)',
          border: isOpen ? '1px solid rgba(232,213,183,0.25)' : '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(10px)',
        }}>
        {icon}
      </motion.button>
      {isOpen && !isMinimized && (
        <div className="w-1 h-1 rounded-full mt-1" style={{ background: '#e8d5b7' }} />
      )}
    </div>
  )
}

// ─── DESKTOP ICON ─────────────────────────────────────────────────────────────
const DesktopIcon = ({ label, icon, href, pos, onDoubleClick }) => {
  const [clickCount, setClickCount] = useState(0)
  const clickTimer = useRef(null)
  const handleClick = (e) => {
    e.stopPropagation()
    setClickCount(c => c + 1)
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      if (clickCount >= 1) {
        if (href) window.open(href, '_blank')
        else if (onDoubleClick) onDoubleClick()
      }
      setClickCount(0)
    }, 300)
  }
  return (
    <div className="absolute flex flex-col items-center gap-1 cursor-pointer group select-none" style={{ left: pos.x, top: pos.y, width: 72 }} onClick={handleClick}>
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all group-hover:opacity-80 group-active:scale-90"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
        {icon}
      </div>
      <span className="text-xs text-center leading-tight"
        style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.9)', background: 'rgba(0,0,0,0.35)', padding: '1px 4px', borderRadius: 3, fontFamily: 'Inter, system-ui' }}>
        {label}
      </span>
    </div>
  )
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
const Notification = ({ title, body, onDismiss }) => (
  <motion.div
    initial={{ x: 120, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 120, opacity: 0 }}
    className="fixed top-10 right-4 w-72 rounded-2xl p-3 z-[9999] flex gap-3 items-start"
    style={{ background: 'rgba(20,14,28,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: '#e8d5b7', color: '#0d0a16', fontFamily: 'Inter, system-ui' }}>RR</div>
    <div className="flex-1">
      <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, system-ui' }}>{title}</p>
      <p className="text-xs leading-4" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, system-ui' }}>{body}</p>
    </div>
    <button onClick={onDismiss} className="text-xs mt-0.5 hover:opacity-60 transition-opacity" style={{ color: 'rgba(255,255,255,0.35)' }}>✕</button>
  </motion.div>
)

// ─── STICKY NOTE ──────────────────────────────────────────────────────────────
const StickyNote = ({ onClick }) => (
  <div
    onClick={(e) => { e.stopPropagation(); onClick() }}
    className="absolute cursor-pointer select-none transition-all hover:scale-105"
    style={{
      right: 24, bottom: 80, width: 160,
      background: '#f5e6c8', padding: 16, borderRadius: 2,
      boxShadow: '2px 4px 12px rgba(0,0,0,0.3)',
      transform: 'rotate(-2deg)',
      zIndex: 30,
    }}>
    <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, fontWeight: 600, color: '#3d2a0a', marginBottom: 8 }}>FAQs</p>
    {['what got you into marketing?', "what's your biggest achievement?", 'how do you explain the gap?', 'advice for your younger self?', "anything you can't do?", 'why should we hire you?'].map((q, i) => (
      <p key={i} style={{ fontFamily: 'Inter, system-ui', fontSize: 9.5, color: '#5a3d10', lineHeight: 1.6 }}>→ {q}</p>
    ))}
  </div>
)

// ─── MOBILE VIEW ──────────────────────────────────────────────────────────────
const MobileView = () => {
  const [activeModal, setActiveModal] = useState(null)
  const apps = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'finder', label: 'Work', icon: '📁' },
    { id: 'photos', label: 'Photos', icon: '🖼️' },
    { id: 'messages', label: 'Contact', icon: '💬' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'terminal', label: 'Terminal', icon: '⌨️' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'faqs', label: 'FAQ', icon: '📌' },
    { id: 'guestbook', label: 'Guestbook', icon: '📓' },
  ]
  const contentMap = {
    notes: <NotesContent />,
    finder: <FinderContent openWindow={() => {}} />,
    photos: <PhotosContent />,
    messages: <MessagesContent openWindow={(id) => setActiveModal(id)} />,
    calendar: <CalendarContent />,
    terminal: <TerminalContent />,
    projects: <ProjectsContent />,
    faqs: <FAQContent />,
    guestbook: <GuestbookContent />,
  }
  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col"
      style={{
        backgroundImage: "url('/wallpaper.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
        <p style={{ fontFamily: 'Inter, system-ui', fontWeight: 300, color: '#e8d5b7', fontSize: 13, marginBottom: 32, letterSpacing: '0.05em' }}>RR</p>
        <div className="grid grid-cols-3 gap-5">
          {apps.map(app => (
            <div key={app.id} className="flex flex-col items-center gap-2" onClick={() => setActiveModal(app.id)}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                {app.icon}
              </div>
              <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, system-ui' }}>{app.label}</span>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'rgba(14,10,22,0.99)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-sm font-medium" style={{ color: '#e8d5b7', fontFamily: 'Inter, system-ui' }}>{apps.find(a => a.id === activeModal)?.label}</p>
              <button onClick={() => setActiveModal(null)} className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>✕</button>
            </div>
            <div className="flex-1 overflow-auto">{contentMap[activeModal]}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const [windows, setWindows] = useState({})
  const [zOrder, setZOrder] = useState([])
  const [minimized, setMinimized] = useState({})
  const [notification, setNotification] = useState(null)
  const [easterEgg, setEasterEgg] = useState(false)
  const [introVisible, setIntroVisible] = useState(false)
  const [introSkipped, setIntroSkipped] = useState(false)
  const bgClicks = useRef(0)
  const bgClickTimer = useRef(null)

  // Intro video popup after 800ms
  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  // Welcome notification after intro is dismissed
  useEffect(() => {
    if (!introSkipped) return
    const t = setTimeout(() => {
      setNotification({ title: 'welcome.', body: "you're visitor #11. i built analytics for this portfolio. 60% of people click through." })
      setTimeout(() => setNotification(null), 5000)
    }, 2000)
    return () => clearTimeout(t)
  }, [introSkipped])

  const openWindow = useCallback((id) => {
    setWindows(w => ({ ...w, [id]: true }))
    setMinimized(m => ({ ...m, [id]: false }))
    setZOrder(z => [...z.filter(x => x !== id), id])
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(w => ({ ...w, [id]: false }))
    setZOrder(z => z.filter(x => x !== id))
  }, [])

  const minimizeWindow = useCallback((id) => {
    setMinimized(m => ({ ...m, [id]: true }))
  }, [])

  const focusWindow = useCallback((id) => {
    setZOrder(z => [...z.filter(x => x !== id), id])
  }, [])

  const getZ = (id) => {
    const idx = zOrder.indexOf(id)
    return idx === -1 ? 10 : 10 + idx
  }

  const handleBgClick = () => {
    bgClicks.current++
    if (bgClickTimer.current) clearTimeout(bgClickTimer.current)
    bgClickTimer.current = setTimeout(() => { bgClicks.current = 0 }, 1500)
    if (bgClicks.current >= 5) {
      bgClicks.current = 0
      setEasterEgg(true)
      setTimeout(() => setEasterEgg(false), 5000)
    }
  }

  const handleSkipIntro = () => {
    setIntroVisible(false)
    setIntroSkipped(true)
  }

  const dockApps = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'finder', label: 'Work', icon: '📁' },
    { id: 'photos', label: 'Photos', icon: '🖼️' },
    { id: 'messages', label: 'Contact', icon: '💬' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'terminal', label: 'Terminal', icon: '⌨️' },
  ]

  const desktopIcons = [
    { label: 'resume.pdf', icon: '📄', pos: { x: 24, y: 50 }, href: '[RESUME_URL]' },
    { label: 'linkedin', icon: '🔗', pos: { x: 24, y: 160 }, href: 'https://linkedin.com/in/rutujarochkari' },
    { label: 'twitter.app', icon: '✦', pos: { x: 24, y: 270 }, href: 'https://x.com/rutzonline' },
    { label: 'notion.app', icon: '◻', pos: { x: 24, y: 380 }, href: 'https://rutujarochkari.notion.site' },
    { label: 'intro.mp4', icon: '🎬', pos: { x: 24, y: 490 }, id: 'intro' },
    { label: 'projects — vibe coded', icon: '📁', pos: { x: 24, y: 580 }, id: 'projects' },
    { label: 'guestbook.txt', icon: '📓', pos: { x: 24, y: 670 }, id: 'guestbook' },
    { label: 'faqs.txt', icon: '📌', pos: { x: 24, y: 760 }, id: 'faqs' },
  ]

  const windowDefs = {
    notes:     { title: 'about.txt', defaultPos: { x: 140, y: 50 }, defaultSize: { width: 620, height: 480 }, content: <NotesContent /> },
    finder:    { title: 'work', defaultPos: { x: 200, y: 60 }, defaultSize: { width: 680, height: 480 }, content: <FinderContent openWindow={openWindow} /> },
    photos:    { title: 'gallery — things i\'ve made & seen', defaultPos: { x: 220, y: 55 }, defaultSize: { width: 700, height: 520 }, content: <PhotosContent /> },
    messages:  { title: 'Messages', defaultPos: { x: 340, y: 80 }, defaultSize: { width: 340, height: 480 }, content: <MessagesContent openWindow={openWindow} /> },
    calendar:  { title: "let's talk — 15 mins", defaultPos: { x: 400, y: 55 }, defaultSize: { width: 420, height: 440 }, content: <CalendarContent /> },
    terminal:  { title: 'Terminal — bash', defaultPos: { x: 260, y: 90 }, defaultSize: { width: 560, height: 380 }, content: <TerminalContent /> },
    faqs:      { title: 'faqs.txt', defaultPos: { x: 300, y: 80 }, defaultSize: { width: 500, height: 460 }, content: <FAQContent /> },
    guestbook: { title: 'leave a note.', defaultPos: { x: 260, y: 100 }, defaultSize: { width: 440, height: 360 }, content: <GuestbookContent /> },
    projects:  { title: 'projects — vibe coded', defaultPos: { x: 200, y: 70 }, defaultSize: { width: 580, height: 440 }, content: <ProjectsContent /> },
    intro:     { title: 'intro.mp4 — 2:14', defaultPos: { x: 'center', y: 'center' }, defaultSize: { width: 640, height: 420 }, content: null },
  }

  // Center the intro window
  const getIntroPos = () => {
    const w = 640, h = 420
    return { x: Math.max(0, (window.innerWidth - w) / 2), y: Math.max(36, (window.innerHeight - h) / 2) }
  }

  if (isMobile) return <MobileView />

  return (
    <div className="h-screen w-full relative overflow-hidden select-none" onClick={handleBgClick} style={{ cursor: 'default', position: 'relative' }}>
      <Wallpaper />

      {/* Blur overlay while intro is open */}
      <AnimatePresence>
        {introVisible && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 98, backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.2)', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 5 }}>
        <MenuBar />

        {/* Desktop Icons */}
        {desktopIcons.map(ico => (
          <DesktopIcon key={ico.label} {...ico}
            onDoubleClick={ico.id ? () => {
              if (ico.id === 'intro') setIntroVisible(true)
              else openWindow(ico.id)
            } : undefined}
          />
        ))}

        {/* Sticky Note */}
        <StickyNote onClick={() => openWindow('faqs')} />

        {/* Regular Windows */}
        <AnimatePresence>
          {Object.entries(windowDefs).filter(([id]) => id !== 'intro').map(([id, def]) =>
            windows[id] && !minimized[id] ? (
              <WindowChrome key={id} id={id} title={def.title}
                onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focusWindow}
                zIndex={getZ(id)} defaultPos={def.defaultPos} defaultSize={def.defaultSize}>
                {def.content}
              </WindowChrome>
            ) : null
          )}
        </AnimatePresence>

        {/* Intro Video Window */}
        <AnimatePresence>
          {introVisible && (
            <WindowChrome
              key="intro" id="intro" title="intro.mp4 — 2:14"
              onClose={handleSkipIntro} onMinimize={handleSkipIntro} onFocus={() => {}}
              zIndex={99} defaultPos={getIntroPos()} defaultSize={{ width: 640, height: 420 }}>
              <IntroVideoContent onSkip={handleSkipIntro} />
            </WindowChrome>
          )}
        </AnimatePresence>

        {/* Dock */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-2 px-4 py-2 rounded-2xl z-40"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          onClick={e => e.stopPropagation()}>
          {dockApps.map(app => (
            <DockIcon key={app.id} label={app.label} icon={app.icon}
              isOpen={!!windows[app.id]} isMinimized={!!minimized[app.id]}
              onClick={() => {
                if (windows[app.id] && !minimized[app.id]) focusWindow(app.id)
                else openWindow(app.id)
              }} />
          ))}
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <Notification title={notification.title} body={notification.body} onDismiss={() => setNotification(null)} />
          )}
          {easterEgg && (
            <Notification
              title="nice. you found it."
              body="60% of people who visit this portfolio click through. are you one of them? 👀"
              onDismiss={() => setEasterEgg(false)} />
          )}
        </AnimatePresence>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(232,213,183,0.15); border-radius: 2px; }
      `}</style>
    </div>
  )
}
