import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, Archive, BarChart3, Bot, BrainCircuit, BriefcaseBusiness,
  CalendarDays, CheckCircle2, ChevronDown, CircleDot, Clock3, FileText,
  FolderOpen, LayoutList, Map, Megaphone, Menu, Plus, ShieldAlert, Sparkles,
  Target, Users, X
} from 'lucide-react'
import './styles.css'

const agentsSeed = [
  {
    id: 'pm', name: 'فهد', role: 'مدير المشروع', status: 'يعمل الآن',
    accent: 'ochre', icon: BriefcaseBusiness, x: 37, y: 34, size: 'large', progress: 82,
    task: 'تجميع حالة المشروع والقرارات المفتوحة',
    files: ['تقرير الحالة', 'قرارات المشروع', 'سجل المخاطر'],
    satellites: [
      { label: 'تقرير الحالة', icon: FileText, angle: -80 },
      { label: 'قرارات المشروع', icon: CheckCircle2, angle: 10 },
      { label: 'المخاطر', icon: ShieldAlert, angle: 105 },
      { label: 'خطة التنفيذ', icon: CalendarDays, angle: 190 }
    ], children: []
  },
  {
    id: 'marketing', name: 'نورة', role: 'مديرة التسويق', status: 'تراجع الحملة',
    accent: 'teal', icon: Megaphone, x: 68, y: 46, size: 'large', progress: 65,
    task: 'مراجعة حملة الأسبوع الأول',
    files: ['خطة 30 يوم', 'مسودات Buffer', 'تقرير الأداء الأسبوعي'],
    satellites: [
      { label: 'خطة 30 يوم', icon: CalendarDays, angle: -82 },
      { label: 'مسودات Buffer', icon: FileText, angle: 18 },
      { label: 'تقارير الأداء', icon: BarChart3, angle: 150 }
    ], children: ['باحث المحتوى']
  },
  {
    id: 'memory', name: 'ذاكرة الأعمال', role: 'المعرفة والمصادر', status: '692 مقطع',
    accent: 'clay', icon: Archive, x: 30, y: 69, size: 'medium', progress: 92,
    task: 'فهرسة آخر تقارير المشروع',
    files: ['المصادر', 'القرارات', 'سجل التغييرات'],
    satellites: [
      { label: 'المصادر', icon: FolderOpen, angle: -50 },
      { label: 'القرارات', icon: CheckCircle2, angle: 50 },
      { label: 'سجل التغييرات', icon: Clock3, angle: 170 }
    ], children: []
  },
  {
    id: 'research', name: 'باحث المحتوى', role: 'تابع لمدير التسويق', status: 'يبحث الآن',
    accent: 'sage', icon: BrainCircuit, x: 63, y: 72, size: 'small', progress: 100,
    task: 'اكتملت 10 فرص محتوى موثقة',
    files: ['فرص المحتوى', 'المصادر الرسمية'], satellites: [], children: []
  }
]

const nav = [
  ['الغرفة', Map], ['الوكلاء', Users], ['المهام', CheckCircle2],
  ['التقارير', BarChart3], ['الذاكرة', BrainCircuit]
]

const activityItems = [
  { text: 'تم إنشاء 4 أفكار في Buffer', time: '08:35', icon: Sparkles },
  { text: 'أُرسل تقرير لمدير المشروع', time: '08:12', icon: FileText },
  { text: 'اكتملت 10 فرص محتوى', time: '07:48', icon: Target }
]

function Background() {
  const [videoReady, setVideoReady] = useState(false)
  return <div className="background" aria-hidden="true">
    <img src="/agent-room-bg.jpg" alt="" />
    <video
      className={videoReady ? 'ready' : ''}
      src="/agent-room-bg.mp4"
      autoPlay muted loop playsInline
      onCanPlay={() => setVideoReady(true)}
    />
    <div className="paper-veil" />
  </div>
}

function OrbitNote({ note, radius, delay }) {
  const Icon = note.icon
  const style = {
    '--angle': `${note.angle}deg`, '--radius': `${radius}px`, '--delay': `${delay}s`
  }
  return <button className="orbit-note" style={style} title={note.label}>
    <span className="pin" />
    <Icon size={15} strokeWidth={1.7} />
    <span>{note.label}</span>
  </button>
}

function AgentNode({ agent, selected, onSelect }) {
  const Icon = agent.icon
  const radius = agent.size === 'large' ? 118 : agent.size === 'medium' ? 94 : 60
  return <div
    className={`agent-system ${agent.size} ${agent.accent} ${selected ? 'selected' : ''}`}
    style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
  >
    <button className="agent-core" onClick={() => onSelect(agent.id)} aria-pressed={selected}>
      <span className="sketch-ring ring-one" />
      <span className="sketch-ring ring-two" />
      <span className="agent-icon"><Icon size={agent.size === 'small' ? 25 : 32} strokeWidth={1.55} /></span>
      <strong>{agent.name}</strong>
      <small><i />{agent.status}</small>
    </button>
    {agent.satellites.map((note, index) =>
      <OrbitNote key={note.label} note={note} radius={radius} delay={index * -.85} />
    )}
  </div>
}

function ConnectorLayer() {
  return <svg className="connectors" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
    <path className="path main-path" d="M390 230 C500 180 590 245 675 315" />
    <path className="path memory-path" d="M320 475 C365 420 370 350 390 260" />
    <path className="path child-path" d="M675 345 C670 405 645 450 620 505" />
    <path className="path ghost-path" d="M280 450 C420 520 530 530 620 500" />
  </svg>
}

function Inspector({ agent, onClose }) {
  return <aside className="inspector" aria-label={`تفاصيل ${agent.name}`}>
    <div className="notebook-rings" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
    <div className="inspector-head">
      <div><span>الوكيل المحدد</span><h2>{agent.name}</h2></div>
      <button onClick={onClose} aria-label="إغلاق التفاصيل"><X size={20} /></button>
    </div>
    <section>
      <h3><CircleDot size={17} /> المهمة الحالية</h3>
      <p className="current-task">{agent.task}</p>
      <div className="progress"><span style={{ width: `${agent.progress}%` }} /></div>
      <div className="progress-meta"><span>{agent.progress}%</span><span>{agent.status}</span></div>
    </section>
    <section>
      <h3><FolderOpen size={17} /> الملفات النشطة</h3>
      <ul className="file-list">
        {agent.files.map(file => <li key={file}><FileText size={15} /><span>{file}</span><button aria-label={`فتح ${file}`}>•••</button></li>)}
      </ul>
    </section>
    <section>
      <h3><Bot size={17} /> الوكلاء التابعون</h3>
      {agent.children.length ? agent.children.map(child => <div className="child-row" key={child}><BrainCircuit size={18}/><b>{child}</b><span>يعمل الآن</span></div>) : <p className="empty">لا يوجد وكلاء تابعون</p>}
    </section>
    <section className="last-win">
      <h3><CheckCircle2 size={17} /> آخر إنجاز</h3>
      <p>{agent.id === 'marketing' ? 'تم إنشاء 4 أفكار جديدة في Buffer' : 'تم تحديث حالة العمل بنجاح'}</p>
      <small>اليوم · 08:35</small>
    </section>
  </aside>
}

function ListView({ agents, selected, onSelect }) {
  return <div className="list-view">
    <h2>الوكلاء النشطون</h2>
    {agents.map(agent => {
      const Icon = agent.icon
      return <button key={agent.id} className={selected === agent.id ? 'active' : ''} onClick={() => onSelect(agent.id)}>
        <span className={`list-icon ${agent.accent}`}><Icon size={21}/></span>
        <span><b>{agent.name}</b><small>{agent.role}</small></span>
        <em>{agent.status}</em>
      </button>
    })}
  </div>
}

function AddAgentModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <form className="paper-modal" onMouseDown={e => e.stopPropagation()} onSubmit={e => {e.preventDefault(); if(name.trim()) onAdd(name.trim())}}>
      <button type="button" className="modal-close" onClick={onClose}><X size={20}/></button>
      <Bot size={32}/><h2>إضافة وكيل جديد</h2>
      <label>اسم الوكيل<input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: وكيل المبيعات" autoFocus /></label>
      <label>يتبع إلى<select defaultValue="pm"><option value="pm">مدير المشروع</option><option value="marketing">مدير التسويق</option></select></label>
      <button className="submit" type="submit">إضافة إلى الغرفة</button>
    </form>
  </div>
}

function App() {
  const [agents, setAgents] = useState(agentsSeed)
  const [selected, setSelected] = useState('marketing')
  const [view, setView] = useState('map')
  const [modal, setModal] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const selectedAgent = useMemo(() => agents.find(a => a.id === selected), [agents, selected])
  const [time, setTime] = useState(new Date())
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(timer) }, [])
  const addAgent = name => {
    const id = `agent-${Date.now()}`
    setAgents([...agents, { id, name, role: 'وكيل جديد', status: 'بانتظار المهمة', accent: 'sage', icon: Bot, x: 50, y: 54, size: 'small', progress: 0, task: 'لم تُسند مهمة بعد', files: [], satellites: [], children: [] }])
    setSelected(id); setModal(false)
  }
  return <main className="app-shell">
    <Background />
    <header>
      <button className="mobile-menu" onClick={() => setNavOpen(!navOpen)}><Menu/></button>
      <div className="brand"><span className="brand-mark">ع</span><b>عقار أوب</b></div>
      <h1>غرفة الوكلاء</h1>
      <div className="header-actions"><span><Clock3 size={16}/>{time.toLocaleTimeString('ar-SA', {hour:'2-digit',minute:'2-digit'})} الرياض</span><button onClick={() => setModal(true)}><Plus size={18}/>إضافة وكيل</button></div>
    </header>
    <nav className={navOpen ? 'open' : ''}>
      {nav.map(([label, Icon], i) => <button className={i === 0 ? 'active' : ''} key={label} onClick={() => setNavOpen(false)}><Icon size={21}/><span>{label}</span></button>)}
    </nav>
    <section className="workspace">
      <div className="view-toggle"><button className={view==='map'?'active':''} onClick={() => setView('map')}><Map size={16}/>الخريطة</button><button className={view==='list'?'active':''} onClick={() => setView('list')}><LayoutList size={16}/>القائمة</button></div>
      {view === 'map' ? <div className="map-canvas">
        <ConnectorLayer />
        {agents.map(agent => <AgentNode key={agent.id} agent={agent} selected={selected === agent.id} onSelect={setSelected} />)}
      </div> : <ListView agents={agents} selected={selected} onSelect={setSelected}/>} 
      {selectedAgent && <Inspector agent={selectedAgent} onClose={() => setSelected(null)} />}
      <div className="activity-strip">
        {activityItems.map(({text,time,icon:Icon}) => <div key={text}><span className="activity-pin"/><Icon size={23}/><p>{text}<small>{time}</small></p></div>)}
      </div>
    </section>
    {modal && <AddAgentModal onClose={() => setModal(false)} onAdd={addAgent}/>} 
  </main>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
