import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── WALLPAPER ────────────────────────────────────────────────────────────────
const Wallpaper = () => (
  <div
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(ellipse at 20% 50%, #0d0d2b 0%, #1a0533 50%, #000010 100%)
      `,
      backgroundSize: 'cover',
    }}
  >
    {/* Star field */}
    {Array.from({ length: 120 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() > 0.85 ? '2px' : '1px',
          height: Math.random() > 0.85 ? '2px' : '1px',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.7 + 0.1,
          animation: `pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 4}s`,
        }}
      />
    ))}
    {/* Nebula layers */}
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(167,139,250,0.06) 0%, transparent 60%)' }} />
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 80%, rgba(99,102,241,0.05) 0%, transparent 50%)' }} />
    <style>{`@keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:1} }`}</style>
  </div>
)

// ─── MENU BAR ─────────────────────────────────────────────────────────────────
const MenuBar = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const day = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return (
    <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-4 z-50"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="font-mono text-white text-xs font-medium tracking-widest">rutz</span>
      <span className="font-mono text-white text-xs opacity-80">{day} &nbsp; {fmt}</span>
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
  const dragRef = useRef(null)
  const isDragging = useRef(false)
  const startMouse = useRef({})
  const startPos = useRef({})

  const onMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return
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
      ref={dragRef}
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
        boxShadow: `0 25px 60px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.1), 0 0 0 2px ${zIndex > 10 ? 'rgba(167,139,250,0.3)' : 'transparent'}`,
        ...defaultSize,
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        className="flex items-center gap-2 px-3 select-none cursor-grab active:cursor-grabbing"
        style={{ height: 36, background: 'rgba(30,20,50,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <TrafficLights onClose={() => onClose(id)} onMinimize={() => onMinimize(id)} />
        <span className="flex-1 text-center text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, system-ui' }}>{title}</span>
      </div>
      {/* Content */}
      <div style={{ background: 'rgba(18,12,32,0.97)', backdropFilter: 'blur(20px)', height: 'calc(100% - 36px)', overflow: 'auto' }}>
        {children}
      </div>
    </motion.div>
  )
}

// ─── NOTES APP ────────────────────────────────────────────────────────────────
const NotesContent = () => (
  <div className="h-full flex" style={{ background: 'rgba(28,22,45,1)' }}>
    <div className="w-48 flex-shrink-0 border-r" style={{ background: 'rgba(22,16,38,1)', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="rounded-md px-2 py-1 text-xs" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>🔍 Search</div>
      </div>
      <div className="p-2">
        <p className="text-xs px-2 py-1 mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Pinned</p>
        <div className="rounded-md px-2 py-2 mb-1" style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.2)' }}>
          <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.9)' }}>📌 about.txt</p>
          <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>rutz. growth marketer...</p>
        </div>
      </div>
    </div>
    <div className="flex-1 p-6 overflow-auto">
      <p className="text-xs mb-4 text-center" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>Apr 28, 2026 at 1:07 AM</p>
      <pre className="text-sm leading-7 whitespace-pre-wrap" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.85)' }}>{`rutz.
growth marketer. bengaluru.

I build 0-1 growth systems
and prove they work.

Previously:
→ The State Plate (D2C)
→ Liquide (Fintech)
→ Hopstack (B2B SaaS)
→ Freelance (F&B / Strategy)

45x app downloads. zero budget.
email open rate: 8% → 35-40%.
45K instagram. 5M+ views.
turned offline events into
repeatable acquisition moments.

I work best between 1am-4am IST.
Make of that what you will.

also: pop culture enthusiast,
sports fan, daily puzzle solver,
speaks English Hindi Marathi and
Italian (ciao!)`}</pre>
    </div>
  </div>
)

// ─── FINDER APP ───────────────────────────────────────────────────────────────
const caseStudies = {
  'The State Plate': {
    tag: 'D2C · Consumer · Growth · Product Marketing',
    sections: [
      { label: 'CHALLENGE', text: 'A regional Indian food brand with near-dead app adoption (150 downloads), dormant email lists, and no digital growth system. One marketer. Zero budget. Zero playbook to inherit.' },
      { label: 'WHAT I DID', text: 'Built the entire growth engine from scratch: web experience, customer journeys, social media, content strategy, performance marketing, and offline event management. Website, app, emails, ads — all of it, end to end.' },
      { label: 'OUTCOME', bullets: ['↑ 45x app downloads', '↑ App drove ~20% of total daily orders', '↑ Email open rate: 8-10% → 35-40%', '↑ Instagram: 45K followers, 5M+ views', '↑ WhatsApp community: 6K members', '↑ Turned offline events into repeatable acquisition channels', '↑ Reduced inventory waste while growing revenue'] },
      { label: 'WHAT I LEARNED', text: "Adoption fails when experience doesn't justify behaviour change. Lifecycle marketing only works when the infrastructure is clean. For D2C: product, marketing, and ops are tightly intertwined." },
    ]
  },
  'Liquide': {
    tag: 'Fintech · Internship · Social · Influencer',
    sections: [
      { label: 'CHALLENGE', text: 'A SEBI-registered stock investment platform launching LiMO, an in-app AI advisory chatbot, with zero social proof and zero community.' },
      { label: 'WHAT I DID', text: 'Orchestrated a zero-to-one influencer launch across 50+ LinkedIn creators. Built Instagram from scratch. Wrote all content: video scripts, web copy, emailers, app push notifications.' },
      { label: 'OUTCOME', bullets: ['↑ 100K+ impressions from launch campaign', '↑ 1,000+ app downloads', '↑ 100+ qualified leads', '↑ Instagram: 0 → 10K followers'] },
    ]
  },
  'Hopstack': {
    tag: 'B2B SaaS · Internship · Content · Newsletter',
    sections: [
      { label: 'CHALLENGE', text: 'A digital warehouse management SaaS with a genuinely complex product and no content foundation to reach supply chain decision-makers.' },
      { label: 'WHAT I DID', text: "Built the content foundation from zero. Managed website CMS, ran off-page SEO, and operated newsletters across LinkedIn and beehiiv. Wrote for an audience that doesn't have time for fluff." },
      { label: 'OUTCOME', bullets: ['↑ Content foundation and publishing cadence built', '↑ SEO groundwork for long-term organic reach', '↑ LinkedIn + blog consistently populated'] },
    ]
  },
  'Freelance': {
    tag: 'Creative Strategy · CRM · F&B',
    sections: [
      { label: 'CHALLENGE', text: '[Your freelance project details — add when ready]' },
      { label: 'WHAT I DID', text: '[Fill in]' },
      { label: 'OUTCOME', text: '[Fill in]' },
    ]
  },
  'Spec Work ✦': {
    tag: 'GTM · Competitive Analysis · Channel Strategy',
    special: true,
    sections: [
      { label: 'SPEC WORK — LITTLEBIRD GTM AUDIT', isTitle: true },
      { label: 'CHALLENGE', text: 'Littlebird is growing 10-15% WoW but the content engine is built on one-off viral moments (1.4M views on X, organic TikTok UGC) with no repeatable playbook behind them.' },
      { label: 'WHAT I DID', text: 'Full social + GTM audit across 6 channels (X, Instagram, TikTok, LinkedIn, Threads, Blog) for Jan-Apr 2026. Mapped ICP, ran competitor teardowns (vs. Recall, Rewind, Granola), built a tiered execution plan — all using Littlebird itself as the research tool.' },
      { label: 'OUTCOME', bullets: ['→ 3 strategic priorities identified', '→ Phased execution plan: 0-2 / 2-6 / 6-12 weeks', '→ Delivered as a navigable Notion mini-site', '→ Sent to the CEO as a job application. Because showing > telling.'] },
    ]
  },
}

const FinderContent = ({ openFinder }) => {
  const [active, setActive] = useState('The State Plate')
  const study = caseStudies[active]
  return (
    <div className="h-full flex" style={{ background: 'rgba(22,16,38,1)' }}>
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 border-r p-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <p className="text-xs px-2 mb-2 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>WORK</p>
        {Object.keys(caseStudies).map(name => (
          <button key={name} onClick={() => setActive(name)}
            className="w-full text-left rounded-md px-2 py-1.5 mb-0.5 text-sm flex items-center gap-2 transition-all"
            style={{
              background: active === name ? 'rgba(167,139,250,0.2)' : 'transparent',
              color: active === name ? 'rgba(167,139,250,1)' : 'rgba(255,255,255,0.7)',
              border: active === name ? '1px solid rgba(167,139,250,0.2)' : '1px solid transparent',
            }}>
            <span style={{ fontSize: 13 }}>{name === 'Spec Work ✦' ? '✦' : '📁'}</span>
            <span className="truncate">{name}</span>
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 p-5 overflow-auto">
        <div className="mb-3">
          <h2 className="text-base font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.95)' }}>
            {active} {study.special && <span style={{ color: '#a78bfa' }}>✦</span>}
          </h2>
          <p className="text-xs" style={{ color: 'rgba(167,139,250,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>{study.tag}</p>
        </div>
        <div className="border-t mb-4" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />
        {study.sections.map((s, i) => (
          <div key={i} className="mb-4">
            {s.isTitle ? null : (
              <>
                <p className="text-xs font-bold mb-1.5 tracking-widest" style={{ color: 'rgba(167,139,250,0.9)', fontFamily: 'JetBrains Mono, monospace' }}>{s.label}</p>
                {s.text && <p className="text-sm leading-6" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.text}</p>}
                {s.bullets && (
                  <ul className="space-y-1">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="text-sm" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </>
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
    <div className="h-full flex flex-col" style={{ background: 'rgba(20,14,36,1)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(25,18,42,1)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>👤</div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>hiring manager? 🤔</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Active now</p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.side === 'right' ? 'justify-end' : 'justify-start'}`}>
            {m.isLink ? (
              <button onClick={() => openWindow('finder')}
                className="px-3 py-2 rounded-2xl text-sm underline transition-opacity hover:opacity-80"
                style={{ background: '#1d6af5', color: 'white', maxWidth: 220, fontFamily: 'Inter, system-ui' }}>
                view my work ↗
              </button>
            ) : (
              <div className="px-3 py-2 rounded-2xl text-sm whitespace-pre-line"
                style={{
                  background: m.side === 'right' ? '#1d6af5' : 'rgba(60,50,80,0.9)',
                  color: 'rgba(255,255,255,0.95)',
                  maxWidth: 220,
                  borderRadius: m.side === 'right' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                }}>
                {m.text}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Read</p>
        </div>
      </div>
      {/* Input */}
      <div className="px-3 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(25,18,42,1)' }}>
        <div className="rounded-full px-3 py-2 text-xs flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span>type something (or don't, I'll know)</span>
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
    <div className="h-full flex flex-col p-5" style={{ background: 'rgba(20,14,36,1)' }}>
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.95)' }}>let's talk — 15 mins</h2>
        <p className="text-xs" style={{ color: 'rgba(167,139,250,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>week of apr 28, 2026</p>
      </div>
      {/* Grid */}
      <div className="grid gap-2 mb-5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {days.map((d, i) => {
          const daySlots = slots.filter(s => s.day === i)
          return (
            <div key={d} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{d}</p>
              {daySlots.length > 0 ? daySlots.map((s, j) => (
                <div key={j} className="rounded-lg px-1 py-1.5 mb-1 text-xs" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
                  ● {s.time}
                </div>
              )) : (
                <div className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.15)' }}>—</div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-sm mb-5 italic" style={{ color: 'rgba(255,255,255,0.5)' }}>"I'm a morning person after 11am."</p>
      <a href="https://cal.com/rutz" target="_blank" rel="noopener noreferrer"
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all hover:opacity-90 block mb-4"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: 'white' }}>
        book a slot →
      </a>
      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>no prep needed. no formal interview vibes.</p>
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
  visitors tracked: [FILL IN]
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
        {done && <span className="blink" style={{ color: '#a78bfa' }}>█</span>}
      </pre>
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
            style={{ background: 'rgba(0,0,0,0.8)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter, system-ui' }}>
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
          background: isOpen ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.08)',
          border: isOpen ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        }}>
        {icon}
      </motion.button>
      {isOpen && !isMinimized && (
        <div className="w-1 h-1 rounded-full mt-1" style={{ background: '#a78bfa' }} />
      )}
    </div>
  )
}

// ─── DESKTOP ICON ─────────────────────────────────────────────────────────────
const DesktopIcon = ({ label, icon, href, pos, onDoubleClick }) => {
  const [clickCount, setClickCount] = useState(0)
  const clickTimer = useRef(null)
  const handleClick = () => {
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
    <div className="absolute flex flex-col items-center gap-1 cursor-pointer group select-none" style={{ left: pos.x, top: pos.y }} onClick={handleClick}>
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all group-hover:opacity-80 group-active:scale-90"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
        {icon}
      </div>
      <span className="text-xs text-center leading-tight px-1 rounded"
        style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.9)', background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 3 }}>
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
    style={{ background: 'rgba(30,22,50,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}>✦</div>
    <div className="flex-1">
      <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, system-ui' }}>{title}</p>
      <p className="text-xs leading-4" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, system-ui' }}>{body}</p>
    </div>
    <button onClick={onDismiss} className="text-xs mt-0.5 hover:opacity-60 transition-opacity" style={{ color: 'rgba(255,255,255,0.4)' }}>✕</button>
  </motion.div>
)

// ─── MOBILE VIEW ──────────────────────────────────────────────────────────────
const MobileView = () => {
  const [activeModal, setActiveModal] = useState(null)
  const apps = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'finder', label: 'Work', icon: '📁' },
    { id: 'messages', label: 'Contact', icon: '💬' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'terminal', label: 'Terminal', icon: '⌨️' },
    { id: 'resume', label: 'Resume', icon: '📄', href: '#' },
  ]
  const contentMap = {
    notes: <NotesContent />,
    finder: <FinderContent openWindow={() => {}} />,
    messages: <MessagesContent openWindow={() => setActiveModal('finder')} />,
    calendar: <CalendarContent />,
    terminal: <TerminalContent />,
  }
  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #0d0d2b 0%, #1a0533 50%, #000010 100%)' }}>
      <p className="font-mono text-white text-xl font-medium tracking-widest mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>rutz.</p>
      <p className="text-xs mb-10" style={{ color: 'rgba(167,139,250,0.7)' }}>growth marketer. bengaluru.</p>
      <div className="grid grid-cols-3 gap-5 px-8">
        {apps.map(app => (
          <div key={app.id} className="flex flex-col items-center gap-2" onClick={() => app.href ? window.open(app.href, '_blank') : setActiveModal(app.id)}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              {app.icon}
            </div>
            <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>{app.label}</span>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'rgba(18,12,32,0.98)', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{apps.find(a => a.id === activeModal)?.label}</p>
              <button onClick={() => setActiveModal(null)} className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>✕</button>
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
  const bgClicks = useRef(0)
  const bgClickTimer = useRef(null)

  // Welcome notification
  useEffect(() => {
    const t = setTimeout(() => {
      setNotification({ title: 'welcome.', body: "you're visitor #[FILL IN]. i know because i built analytics for this portfolio." })
      setTimeout(() => setNotification(null), 4000)
    }, 1500)
    return () => clearTimeout(t)
  }, [])

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

  const dockApps = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'finder', label: 'Work', icon: '📁' },
    { id: 'messages', label: 'Contact', icon: '💬' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'terminal', label: 'Terminal', icon: '⌨️' },
  ]

  const desktopIcons = [
    { label: 'resume.pdf', icon: '📄', pos: { x: 80, y: 80 }, href: '#' },
    { label: 'linkedin', icon: '🔗', pos: { x: 80, y: 190 }, href: 'https://linkedin.com/in/rutuja-rochkari' },
    { label: 'twitter.app', icon: '✦', pos: { x: 80, y: 300 }, href: 'https://x.com/rutzonline' },
    { label: 'notion.app', icon: '◻', pos: { x: 80, y: 410 }, href: 'https://rutujarochkari.notion.site' },
  ]

  const windowDefs = {
    notes:    { title: 'about.txt', defaultPos: { x: 140, y: 50 }, defaultSize: { width: 600, height: 420 }, content: <NotesContent /> },
    finder:   { title: 'work', defaultPos: { x: 200, y: 60 }, defaultSize: { width: 680, height: 480 }, content: <FinderContent openWindow={openWindow} /> },
    messages: { title: 'Messages', defaultPos: { x: 320, y: 80 }, defaultSize: { width: 340, height: 480 }, content: <MessagesContent openWindow={openWindow} /> },
    calendar: { title: "let's talk — 15 mins", defaultPos: { x: 400, y: 50 }, defaultSize: { width: 420, height: 440 }, content: <CalendarContent /> },
    terminal: { title: 'Terminal — bash', defaultPos: { x: 260, y: 90 }, defaultSize: { width: 560, height: 380 }, content: <TerminalContent /> },
  }

  if (isMobile) return <MobileView />

  return (
    <div className="h-screen w-full relative overflow-hidden select-none" onClick={handleBgClick} style={{ cursor: 'default' }}>
      <Wallpaper />
      <MenuBar />

      {/* Desktop Icons */}
      {desktopIcons.map(ico => (
        <DesktopIcon key={ico.label} {...ico} onDoubleClick={ico.href ? undefined : () => openWindow(ico.id)} />
      ))}

      {/* Windows */}
      <AnimatePresence>
        {Object.entries(windowDefs).map(([id, def]) =>
          windows[id] && !minimized[id] ? (
            <WindowChrome key={id} id={id} title={def.title}
              onClose={closeWindow} onMinimize={minimizeWindow} onFocus={focusWindow}
              zIndex={getZ(id)} defaultPos={def.defaultPos} defaultSize={def.defaultSize}>
              {def.content}
            </WindowChrome>
          ) : null
        )}
      </AnimatePresence>

      {/* Dock */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-2 px-4 py-2 rounded-2xl z-40"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
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
            title="nice. you found the thing."
            body="here's a secret: i track everything. 60% of people who visit this portfolio click through. are you one of them? 👀"
            onDismiss={() => setEasterEgg(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
