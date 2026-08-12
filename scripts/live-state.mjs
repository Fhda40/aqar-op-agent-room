import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(scriptDir, '..')
const companyRoot = path.resolve(appRoot, '..')

async function text(relativePath) {
  return readFile(path.join(companyRoot, relativePath), 'utf8')
}

async function modified(relativePath) {
  return (await stat(path.join(companyRoot, relativePath))).mtime.toISOString()
}

function clean(value = '') {
  return value.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_`]/g, '').trim()
}

function extractOpportunities(markdown) {
  const sections = [...markdown.matchAll(/^##\s+(\d+)\)\s+(.+?)$([\s\S]*?)(?=^##\s+\d+\)|^##\s+توزيع|\z)/gm)]
  return sections.map((match, index) => {
    const body = match[3]
    const field = name => clean(body.match(new RegExp(`^- \\*\\*${name}:\\*\\*\\s*(.+)$`, 'm'))?.[1] || '')
    return {
      id: `idea-${match[1]}`,
      rank: Number(match[1]),
      title: clean(match[2]),
      hook: field('Hook'),
      problem: field('المشكلة'),
      format: field('الصيغة المناسبة'),
      cta: field('CTA'),
      status: index < 3 ? 'جاهزة للمراجعة' : 'بحث موثق',
      owner: 'باحث المحتوى',
      approver: 'نورة',
      projectId: 'aqar-op',
      sourceRef: 'mkt/research/content-opportunities-2026-08-12.md',
      confidence: 0.94
    }
  })
}

function bulletsUnder(markdown, heading) {
  const block = markdown.match(new RegExp(`^## ${heading}\\s*$([\\s\\S]*?)(?=^## |\\z)`, 'm'))?.[1] || ''
  return [...block.matchAll(/^-\s+(.+)$/gm)].map(match => clean(match[1]))
}

async function recentReports() {
  const directory = path.join(companyRoot, 'pm', 'inbox', 'marketing')
  const names = (await readdir(directory)).filter(name => name.endsWith('.md'))
  const rows = await Promise.all(names.map(async name => {
    const full = path.join(directory, name)
    const content = await readFile(full, 'utf8')
    const info = await stat(full)
    return {
      id: `report-${name}`,
      type: 'report',
      title: clean(content.match(/^#\s+(.+)$/m)?.[1] || name),
      actor: 'نورة',
      target: 'فهد',
      occurredAt: info.mtime.toISOString(),
      sourceRef: `pm/inbox/marketing/${name}`
    }
  }))
  return rows.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 5)
}

export async function buildLiveState() {
  const [research, status, draft, reports] = await Promise.all([
    text('mkt/research/content-opportunities-2026-08-12.md'),
    text('mkt/reports/STATUS.md'),
    text('mkt/drafts/week-01-2026-08-12.md'),
    recentReports()
  ])

  const ideas = extractOpportunities(research)
  const inProgress = bulletsUnder(status, 'قيد التنفيذ')
  const risks = bulletsUnder(status, 'المخاطر')
  const draftCount = draft.split('\n---\n').filter(item => item.trim()).length
  const sourceUpdatedAt = await modified('mkt/research/content-opportunities-2026-08-12.md')

  return {
    schemaVersion: 1,
    tenantId: 'company-os',
    generatedAt: new Date().toISOString(),
    sourceUpdatedAt,
    project: { id: 'aqar-op', name: 'عقار أوب', status: 'نشط', stage: 'Marketing Demo / Pre-Production' },
    summary: {
      ideas: ideas.length,
      readyForReview: ideas.filter(idea => idea.status === 'جاهزة للمراجعة').length,
      activeTasks: inProgress.length,
      drafts: draftCount,
      pendingApprovals: ideas.filter(idea => idea.status === 'جاهزة للمراجعة').length + 1
    },
    ideas,
    developmentIdeas: [
      {
        id: 'dev-live-database',
        title: 'نقل الحالة التشغيلية إلى PostgreSQL مع RLS',
        problem: 'الحالة الحالية موزعة بين ملفات المشروع ولا توجد قاعدة تشغيل مشتركة للمهمات والموافقات.',
        impact: 'تحديث فوري متعدد المشاريع مع عزل البيانات وسجل تدقيق.',
        status: 'مقترح معماري', owner: 'فهد', approver: 'فهد',
        sourceRef: 'docs/02-ARCHITECTURE.md', confidence: 1
      },
      {
        id: 'dev-buffer-reverse-sync',
        title: 'إضافة مزامنة عكسية لحالة Buffer ونتائج النشر',
        problem: 'الحالة والأداء يحتاجان تحديثًا يدويًا بعد إرسال الأفكار.',
        impact: 'عرض المنشور والنتيجة داخل الغرفة دون نسخ يدوي.',
        status: 'فجوة مسجلة', owner: 'نورة', approver: 'فهد',
        sourceRef: 'mkt/reports/STATUS.md', confidence: 1
      },
      {
        id: 'dev-approval-audit',
        title: 'بوابة موافقات مرتبطة بسجل تدقيق',
        problem: 'الاعتمادات تظهر في الملفات لكن لا توجد دورة حياة تشغيلية موحدة داخل الواجهة.',
        impact: 'تتبع من وافق ومتى وعلى ماذا قبل أي نشر أو قرار مؤثر.',
        status: 'مطلوب في المعمارية', owner: 'فهد', approver: 'فهد',
        sourceRef: 'docs/04-AGENTS.md', confidence: 1
      }
    ],
    tasks: inProgress.map((title, index) => ({
      id: `task-${index + 1}`, title, status: index === 0 ? 'قيد التنفيذ' : 'مفتوحة',
      owner: index === 0 ? 'نورة' : 'فهد', projectId: 'aqar-op',
      sourceRef: 'mkt/reports/STATUS.md', confidence: 1
    })),
    risks: risks.map((title, index) => ({ id: `risk-${index + 1}`, title, severity: index === 0 ? 'متوسط' : 'منخفض', sourceRef: 'mkt/reports/STATUS.md' })),
    approvals: [
      { id: 'approval-closed-beta', title: 'تثبيت أولوية التجربة المغلقة على مكتب واحد', status: 'بانتظار فهد', owner: 'فهد', sourceRef: 'mkt/reports/STATUS.md' },
      ...ideas.slice(0, 3).map(idea => ({ id: `approval-${idea.id}`, title: idea.title, status: 'بانتظار نورة', owner: 'نورة', sourceRef: idea.sourceRef }))
    ],
    activities: [
      { id: 'activity-research', type: 'idea', title: `تتوفر ${ideas.length} فرص محتوى موثقة`, actor: 'باحث المحتوى', occurredAt: sourceUpdatedAt, sourceRef: 'mkt/research/content-opportunities-2026-08-12.md' },
      { id: 'activity-drafts', type: 'draft', title: `تتوفر ${draftCount} مسودات للأسبوع الأول`, actor: 'نورة', occurredAt: await modified('mkt/drafts/week-01-2026-08-12.md'), sourceRef: 'mkt/drafts/week-01-2026-08-12.md' },
      ...reports
    ].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 8),
    sources: [
      { id: 'marketing-research', label: 'فرص المحتوى', path: 'mkt/research/content-opportunities-2026-08-12.md', updatedAt: sourceUpdatedAt, status: 'متصل' },
      { id: 'marketing-status', label: 'حالة التسويق', path: 'mkt/reports/STATUS.md', updatedAt: await modified('mkt/reports/STATUS.md'), status: 'متصل' },
      { id: 'marketing-drafts', label: 'مسودات الأسبوع الأول', path: 'mkt/drafts/week-01-2026-08-12.md', updatedAt: await modified('mkt/drafts/week-01-2026-08-12.md'), status: 'متصل' },
      { id: 'pm-reports', label: 'تقارير مدير المشروع', path: 'pm/inbox/marketing/', updatedAt: reports[0]?.occurredAt || new Date(0).toISOString(), status: 'متصل' }
    ]
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = path.join(appRoot, 'public', 'data', 'live-state.json')
  await mkdir(path.dirname(output), { recursive: true })
  const state = await buildLiveState()
  await writeFile(output, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  console.log(`Live state: ${state.summary.ideas} ideas, ${state.summary.activeTasks} tasks -> ${output}`)
}
