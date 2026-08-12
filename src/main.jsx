import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Archive, BarChart3, Bot, Building2, CalendarDays, CheckCircle2,
  Clock3, Database, FileSpreadsheet, FileText, FolderOpen, Home, LayoutList,
  Lightbulb, Map, Menu, Plus, Radio, RefreshCw, ShieldAlert, Target,
  Users, X
} from 'lucide-react'
import './styles.css'

const project = {
  id: 'aqar-op',
  name: 'عقار أوب',
  status: 'نشط',
  owner: 'فهد',
  umbrella: 'Company OS'
}

const initialAgents = [
  {
    id: 'fahad', name: 'فهد', title: 'مدير المشروع', image: '/assets/fahad.png', tone: 'ochre',
    x: 31, y: 28, size: 'large', status: 'يعمل الآن', progress: 82,
    task: 'تجميع حالة مشروع عقار أوب والقرارات المفتوحة',
    files: ['تقرير الحالة', 'قرارات المشروع', 'سجل المخاطر'],
    notes: [
      { text: 'تقرير الحالة', icon: FileText, x: -116, y: -76, tilt: -4 },
      { text: 'قرارات المشروع', icon: CheckCircle2, x: 126, y: -65, tilt: 6 },
      { text: 'المخاطر', icon: ShieldAlert, x: -150, y: 55, tilt: -5 },
      { text: 'خطة التنفيذ', icon: CalendarDays, x: 124, y: 72, tilt: 4 }
    ], reports: []
  },
  {
    id: 'noura', name: 'نورة', title: 'مديرة التسويق', image: '/assets/noura.png', tone: 'teal',
    x: 69, y: 47, size: 'large', status: 'تراجع الحملة', progress: 65,
    task: 'مراجعة حملة الأسبوع الأول لمشروع عقار أوب',
    files: ['خطة 30 يوم.pdf', 'مسودة رسالة الحملة.docx', 'تقرير الأداء الأسبوعي.xlsx'],
    notes: [
      { text: 'خطة 30 يوم', icon: CalendarDays, x: -122, y: -72, tilt: -5 },
      { text: 'مسودات Buffer', icon: FileText, x: 128, y: -54, tilt: 4 },
      { text: 'تقارير الأداء', icon: BarChart3, x: -127, y: 77, tilt: -5 }
    ], reports: ['researcher']
  },
  {
    id: 'memory', name: 'ذاكرة الأعمال', title: 'المعرفة والمصادر', image: '/assets/memory.png', tone: 'clay',
    x: 28, y: 72, size: 'medium', status: '692 مقطع', progress: 92,
    task: 'فهرسة آخر تقارير مشروع عقار أوب',
    files: ['المصادر', 'القرارات', 'سجل التغييرات'],
    notes: [
      { text: 'المصادر', icon: FolderOpen, x: -116, y: -48, tilt: -5 },
      { text: 'القرارات', icon: CheckCircle2, x: 123, y: -46, tilt: 3 },
      { text: 'سجل التغييرات', icon: Clock3, x: 80, y: 95, tilt: 4 }
    ], reports: []
  },
  {
    id: 'researcher', name: 'باحث المحتوى', title: 'تابع لإدارة التسويق', image: '/assets/researcher.png', tone: 'sage',
    x: 66, y: 77, size: 'small', status: 'يبحث الآن', progress: 100,
    task: 'اكتملت 10 فرص محتوى موثقة لمشروع عقار أوب',
    files: ['فرص المحتوى', 'المصادر الرسمية'],
    notes: [{ text: 'مسودة البحث', icon: FileText, x: 106, y: 12, tilt: 5 }], reports: []
  }
]

const navigation = [
  { id: 'room', label: 'الغرفة', icon: Home },
  { id: 'agents', label: 'الوكلاء', icon: Users },
  { id: 'tasks', label: 'المهام', icon: CheckCircle2 },
  { id: 'live', label: 'البث الحي', icon: Radio },
  { id: 'memory', label: 'الذاكرة', icon: Archive }
]

const relativeTime = value => {
  if (!value) return 'غير معروف'
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} دقيقة`
  const hours = Math.round(minutes / 60)
  return hours < 24 ? `منذ ${hours} ساعة` : `منذ ${Math.round(hours / 24)} يوم`
}

function useLiveState() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('connecting')
  const [error, setError] = useState('')
  const refresh = async () => {
    setStatus(current => current === 'ready' ? 'refreshing' : 'connecting')
    try {
      const response = await fetch(`/api/live-state?t=${Date.now()}`, { cache: 'no-store' })
      const result = response.ok ? await response.json() : await fetch(`/data/live-state.json?t=${Date.now()}`, { cache: 'no-store' }).then(item => item.json())
      setData(result); setStatus('ready'); setError('')
    } catch (reason) {
      setStatus('error'); setError(reason instanceof Error ? reason.message : 'تعذر التحديث')
    }
  }
  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, 20000)
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible) }
  }, [])
  return { data, status, error, refresh }
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])
  return <span className="clock"><Clock3 size={20} /> الرياض {now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
}

function Note({ item }) {
  const Icon = item.icon
  return <button className="orbit-note" style={{ '--note-x': `${item.x}px`, '--note-y': `${item.y}px`, '--tilt': `${item.tilt}deg` }}>
    <Icon size={16} strokeWidth={1.55} />
    <span>{item.text}</span>
  </button>
}

function Agent({ agent, active, onSelect }) {
  return <div className={`agent agent-${agent.size} tone-${agent.tone}`} style={{ left: `${agent.x}%`, top: `${agent.y}%` }}>
    <div className="orbit-line" aria-hidden="true" />
    <button className={`agent-portrait ${active ? 'active' : ''}`} onClick={() => onSelect(agent.id)} aria-pressed={active}>
      <img className="agent-art" src={agent.image} alt="" />
      <img className="agent-ring" src="/assets/agent-ring.png" alt="" />
      <span className="agent-copy"><strong>{agent.name}</strong><small>{agent.title}</small></span>
    </button>
    {agent.notes.map(note => <Note key={note.text} item={note} />)}
  </div>
}

function RelationshipLines() {
  return <div className="relationships" aria-hidden="true">
    <i className="line fahad-noura" />
    <i className="line fahad-memory" />
    <i className="line noura-research" />
  </div>
}

function ProjectSeal({ live, status, onRefresh }) {
  return <div className="project-seal">
    <Building2 size={17} />
    <span className={`live-dot ${status}`}><i />{status === 'error' ? 'غير متصل' : 'مباشر'}</span>
    <strong>{project.name}</strong>
    <button onClick={onRefresh} aria-label="تحديث البيانات"><RefreshCw size={14} className={status === 'refreshing' ? 'spinning' : ''} /></button>
    <small>{relativeTime(live?.servedAt || live?.generatedAt)}</small>
  </div>
}

function Inspector({ agent, agents, onClose }) {
  const reports = agent.reports.map(id => agents.find(item => item.id === id)).filter(Boolean)
  return <aside className="notebook" aria-label={`تفاصيل ${agent.name}`}>
    <button className="close-inspector" onClick={onClose} aria-label="إغلاق"><X size={20} /></button>
    <div className="notebook-title"><span>الوكيل المحدد</span><h2>{agent.name}</h2><small>{agent.title}</small></div>
    <section>
      <h3>المشروع</h3>
      <div className="project-card"><Building2 size={19} /><span><b>{project.name}</b><small>تحت مظلة {project.umbrella}</small></span><em>{project.status}</em></div>
    </section>
    <section>
      <h3>المهمة الحالية</h3>
      <p className="task-copy">{agent.task}</p>
      <div className="progress"><span style={{ width: `${agent.progress}%` }} /></div>
      <div className="progress-meta"><span>{agent.progress}%</span><span>{agent.status}</span></div>
    </section>
    <section>
      <h3>الملفات النشطة</h3>
      <ul className="files">
        {agent.files.map((file, index) => <li key={file}>{index === 2 ? <FileSpreadsheet size={18} /> : <FileText size={18} />}<span>{file}</span><button aria-label={`فتح ${file}`}>•••</button></li>)}
      </ul>
    </section>
    <section>
      <h3>الوكلاء التابعون</h3>
      {reports.length ? reports.map(report => <button className="report-row" key={report.id}><img src={report.image} alt="" /><span><b>{report.name}</b><small>يعمل الآن</small></span><i /></button>) : <p className="empty">لا يوجد وكلاء تابعون لهذا الوكيل</p>}
    </section>
    <section className="achievement">
      <h3>آخر إنجاز</h3>
      <p>{agent.id === 'noura' ? 'تم إنشاء 4 أفكار جديدة في Buffer' : 'تم تحديث حالة العمل بنجاح'}</p>
      <small><Clock3 size={13} /> منذ 35 دقيقة</small>
    </section>
  </aside>
}

function ListView({ agents, selected, onSelect }) {
  return <div className="list-view">
    <div className="list-heading"><h2>وكلاء Company OS</h2><p>المكلفون حاليًا بمشروع {project.name}</p></div>
    {agents.map(agent => <button key={agent.id} className={selected === agent.id ? 'selected' : ''} onClick={() => onSelect(agent.id)}>
      <img src={agent.image} alt="" />
      <span><b>{agent.name}</b><small>{agent.title}</small></span>
      <em>{agent.status}</em>
    </button>)}
  </div>
}

function LiveRow({ icon: Icon = FileText, title, meta, status, source, onClick }) {
  return <button className="live-row" onClick={onClick}>
    <span className="live-row-icon"><Icon size={22} strokeWidth={1.45} /></span>
    <span className="live-row-copy"><b>{title}</b><small>{meta}</small></span>
    {status && <em>{status}</em>}
    {source && <code>{source}</code>}
  </button>
}

function LiveDesk({ data, section }) {
  const [ideaType, setIdeaType] = useState('marketing')
  const [selectedItem, setSelectedItem] = useState(null)
  if (!data) return <div className="live-desk loading-paper"><RefreshCw className="spinning" /><h2>تجميع حالة Company OS…</h2></div>

  const ideas = ideaType === 'marketing' ? data.ideas : data.developmentIdeas
  let title = 'البث الحي'
  let description = 'أفكار وموافقات ونشاط موثّق من ملفات Company OS.'
  let content = <>
    <div className="desk-switch"><button className={ideaType === 'marketing' ? 'active' : ''} onClick={() => setIdeaType('marketing')}>أفكار تسويقية <b>{data.summary.ideas}</b></button><button className={ideaType === 'development' ? 'active' : ''} onClick={() => setIdeaType('development')}>تطوير المشروع <b>{data.developmentIdeas.length}</b></button></div>
    <div className="live-list">{ideas.map(idea => <LiveRow key={idea.id} icon={ideaType === 'marketing' ? Lightbulb : Target} title={idea.title} meta={`${idea.owner} · ثقة ${Math.round(idea.confidence * 100)}%`} status={idea.status} source={idea.sourceRef} onClick={() => setSelectedItem(idea)} />)}</div>
  </>

  if (section === 'tasks') {
    title = 'المهام والموافقات'
    description = `${data.tasks.length} مهام مسجلة و${data.approvals.length} موافقات بانتظار أصحابها.`
    content = <div className="desk-columns"><section><h3>المهام</h3>{data.tasks.map(task => <LiveRow key={task.id} icon={CheckCircle2} title={task.title} meta={`${task.owner} · ${task.sourceRef}`} status={task.status} />)}</section><section><h3>بوابة الموافقات</h3>{data.approvals.map(item => <LiveRow key={item.id} icon={ShieldAlert} title={item.title} meta={item.sourceRef} status={item.status} />)}</section></div>
  }
  if (section === 'memory') {
    title = 'المصادر المتصلة'
    description = 'كل رقم وفكرة في الغرفة يرجع إلى مصدر مسجل وتاريخ تحديث.'
    content = <div className="source-grid">{data.sources.map(source => <article key={source.id}><Database size={25} /><span><b>{source.label}</b><code>{source.path}</code></span><em>{source.status}</em><small>{relativeTime(source.updatedAt)}</small></article>)}</div>
  }

  return <div className="live-desk">
    <header><span><Radio size={20} /><i />تحديث كل 20 ثانية</span><h2>{title}</h2><p>{description}</p></header>
    <div className="summary-cards"><article><b>{data.summary.ideas}</b><span>فكرة تسويقية</span></article><article><b>{data.summary.readyForReview}</b><span>جاهزة للمراجعة</span></article><article><b>{data.summary.activeTasks}</b><span>مهام نشطة</span></article><article><b>{data.summary.pendingApprovals}</b><span>موافقات معلقة</span></article></div>
    {content}
    {selectedItem && <aside className="idea-detail"><button onClick={() => setSelectedItem(null)}><X size={18} /></button><small>{selectedItem.status}</small><h3>{selectedItem.title}</h3><p>{selectedItem.hook || selectedItem.problem}</p>{selectedItem.format && <p><b>الصيغة:</b> {selectedItem.format}</p>}<code>{selectedItem.sourceRef}</code></aside>}
  </div>
}

function AddAgent({ onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('العمليات')
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <form className="add-agent" onMouseDown={event => event.stopPropagation()} onSubmit={event => { event.preventDefault(); if (name.trim()) onSubmit(name.trim(), department) }}>
      <button type="button" className="modal-close" onClick={onClose}><X /></button>
      <Bot size={34} />
      <h2>إضافة وكيل إلى Company OS</h2>
      <p>سيُسند الوكيل إلى مشروع {project.name}.</p>
      <label>اسم الوكيل<input value={name} onChange={event => setName(event.target.value)} placeholder="مثال: وكيل العمليات" autoFocus /></label>
      <label>الإدارة<select value={department} onChange={event => setDepartment(event.target.value)}><option>العمليات</option><option>التسويق</option><option>إدارة المشروع</option></select></label>
      <button className="submit" type="submit">إضافة إلى الغرفة</button>
    </form>
  </div>
}

function App() {
  const [agents, setAgents] = useState(initialAgents)
  const [selected, setSelected] = useState('noura')
  const [view, setView] = useState('map')
  const [modalOpen, setModalOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [section, setSection] = useState('room')
  const { data: liveData, status: liveStatus, error: liveError, refresh: refreshLive } = useLiveState()
  const selectedAgent = useMemo(() => agents.find(agent => agent.id === selected), [agents, selected])

  useEffect(() => {
    if (!liveData) return
    setAgents(current => current.map(agent => {
      if (agent.id === 'noura') return { ...agent, task: liveData.tasks.find(task => task.owner === 'نورة')?.title || agent.task, status: `${liveData.summary.readyForReview} أفكار للمراجعة`, progress: Math.min(100, liveData.summary.readyForReview * 20 + 20) }
      if (agent.id === 'fahad') return { ...agent, task: liveData.approvals.find(item => item.owner === 'فهد')?.title || agent.task, status: `${liveData.approvals.filter(item => item.owner === 'فهد').length} قرار مطلوب` }
      if (agent.id === 'researcher') return { ...agent, task: `تتوفر ${liveData.summary.ideas} فرص محتوى موثقة`, status: relativeTime(liveData.sourceUpdatedAt) }
      if (agent.id === 'memory') return { ...agent, status: `${liveData.sources.filter(item => item.status === 'متصل').length} مصادر متصلة` }
      return agent
    }))
  }, [liveData?.generatedAt])

  const addAgent = (name, department) => {
    const agent = {
      id: `agent-${Date.now()}`, name, title: `وكيل ${department}`, image: '/assets/researcher.png', tone: 'sage',
      x: 53, y: 66, size: 'small', status: 'بانتظار المهمة', progress: 0,
      task: `بانتظار أول مهمة في مشروع ${project.name}`, files: [], notes: [], reports: []
    }
    setAgents(current => [...current, agent])
    setSelected(agent.id)
    setModalOpen(false)
  }

  return <main className="room-shell">
    <div className="paper-background" aria-hidden="true" />
    <header className="topbar">
      <button className="menu-button" onClick={() => setNavOpen(value => !value)} aria-label="القائمة"><Menu /></button>
      <Clock />
      <div className="room-title"><h1>غرفة Company OS</h1><span>إدارة الوكلاء والمشاريع</span></div>
      <div className="top-actions">
        <div className="view-toggle"><button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><Map size={17} />الخريطة</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><LayoutList size={17} />القائمة</button></div>
        <button className="add-button" onClick={() => setModalOpen(true)}><Plus size={20} /> إضافة وكيل</button>
      </div>
    </header>

    <nav className={`side-tabs ${navOpen ? 'open' : ''}`}>
      {navigation.map(({ id, label, icon: Icon }) => <button className={section === id ? 'active' : ''} key={id} onClick={() => { setSection(id); setNavOpen(false); if (id === 'agents') setView('list') }}><i /><Icon size={24} strokeWidth={1.55} /><span>{label}</span>{id === 'live' && liveData?.summary.pendingApprovals > 0 && <b>{liveData.summary.pendingApprovals}</b>}</button>)}
    </nav>

    <section className="room-stage">
      <ProjectSeal live={liveData} status={liveStatus} onRefresh={refreshLive} />
      {(section === 'room' || section === 'agents') && (view === 'map' && section !== 'agents' ? <div className="agent-map">
        <RelationshipLines />
        {agents.map(agent => <Agent key={agent.id} agent={agent} active={selected === agent.id} onSelect={setSelected} />)}
      </div> : <ListView agents={agents} selected={selected} onSelect={setSelected} />)}
      {(section === 'room' || section === 'agents') && selectedAgent && <Inspector agent={selectedAgent} agents={agents} onClose={() => setSelected(null)} />}
      {(section === 'live' || section === 'tasks' || section === 'memory') && <LiveDesk data={liveData} section={section} />}
      {liveError && <div className="sync-error">آخر لقطة محفوظة · تعذر الاتصال المباشر: {liveError}</div>}
      {section === 'room' && <div className="activity-board">
        {(liveData?.activities || []).slice(0, 3).map(item => <article key={item.id}><i className="card-pin" /><FileText size={35} strokeWidth={1.4} /><span><b>{item.title}</b><small>{relativeTime(item.occurredAt)} · {item.actor}</small></span></article>)}
      </div>}
    </section>

    {modalOpen && <AddAgent onClose={() => setModalOpen(false)} onSubmit={addAgent} />}
  </main>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
