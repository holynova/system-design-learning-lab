import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import { chapters, volumeNames } from './data'
import './styles.css'

const REPO_URL = 'https://github.com/holynova/system-design-learning-lab'
const PAGES_URL = 'https://holynova.github.io/system-design-learning-lab/'

function track(name, data = {}) {
  window.umami?.track(name, data)
}

function Icon({ name, size = 18 }) {
  const paths = {
    arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
    branch: <><path d="M6 3v18" /><path d="M6 7h7a3 3 0 0 1 3 3v1" /><circle cx="6" cy="3" r="2" /><circle cx="6" cy="21" r="2" /><circle cx="16" cy="14" r="2" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16" /><path d="M8 7h8" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    code: <><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></>,
    github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 3.7 5.1 5.1 0 0 0 19.2 0S18 0 15.5 1.7a13.4 13.4 0 0 0-7 0C6 0 4.8 0 4.8 0a5.1 5.1 0 0 0-.1 3.7A5.5 5.5 0 0 0 3.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 9 18v4" /><path d="M9 18c-4.5 2-5-2-7-2" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
    pause: <><rect x="5" y="4" width="4" height="16" rx="1" /><rect x="15" y="4" width="4" height="16" rx="1" /></>,
    play: <path d="m7 4 13 8-13 8z" fill="currentColor" stroke="none" />,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    refresh: <><path d="M20 11a8 8 0 1 0 2 5" /><path d="M20 4v7h-7" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></>,
    trace: <><path d="M4 18V6" /><path d="M4 18h16" /><path d="m7 15 3-4 3 2 4-6" /></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.spark}</svg>
}

function ChapterSidebar({ selectedId, onSelect, query, onQuery }) {
  const visible = chapters.filter((chapter) => `${chapter.title} ${chapter.english} ${chapter.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <aside className="sidebar" aria-label="章节导航">
      <div className="sidebar-top">
        <a className="brand" href="./" aria-label="ARC LAB 首页" onClick={() => track('home_open')}>
          <span className="brand-mark">A</span>
          <span><strong>ARC / LAB</strong><small>system design field notes</small></span>
        </a>
        <div className="sidebar-rule" />
        <label className="search-box">
          <Icon name="search" size={16} />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="搜索章节、主题" aria-label="搜索章节" />
          <kbd>/</kbd>
        </label>
      </div>
      <nav className="chapter-nav">
        {volumeNames.map((volume) => {
          const volumeChapters = visible.filter((chapter) => chapter.volume === volume)
          return (
            <section key={volume} className="volume-group">
              <div className="volume-label"><span>{volume}</span><span>{volume === '第一卷' ? '15' : '13'}</span></div>
              {volumeChapters.map((chapter) => (
                <button key={chapter.id} className={`chapter-item ${selectedId === chapter.id ? 'is-active' : ''}`} onClick={() => { onSelect(chapter.id); track('chapter_select', { chapter_id: chapter.id, volume: chapter.volume }) }}>
                  <span className="chapter-index">{chapter.id.split('-')[1]}</span>
                  <span className="chapter-copy"><strong>{chapter.title}</strong><small>{chapter.english}</small></span>
                  {chapter.lab !== 'trace' && <span className="lab-dot" title="深度实验" />}
                </button>
              ))}
            </section>
          )
        })}
        {!visible.length && <p className="empty-search">没有匹配章节。试试“缓存”或“支付”。</p>}
      </nav>
      <div className="sidebar-bottom">
        <div className="source-note"><span className="live-dot" /> 内容模型 · v0.1.0</div>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="sidebar-github" data-umami-event="github_repo_click"><Icon name="github" size={16} /> 查看 GitHub 仓库</a>
      </div>
    </aside>
  )
}

function ArchitectureDiagram({ chapter, step }) {
  const nodePositions = chapter.nodes.map((_, index) => ({ x: 7 + index * 21.5, y: index % 2 ? 30 : 58 }))
  return (
    <div className="diagram-wrap">
      <div className="diagram-caption"><span>ARCHITECTURE TRACE</span><span>{String(Math.min(step + 1, chapter.steps.length)).padStart(2, '0')} / {String(chapter.steps.length).padStart(2, '0')} EVENTS</span></div>
      <div className="diagram" role="img" aria-label={`${chapter.title} 架构路径，当前到第 ${Math.min(step + 1, chapter.steps.length)} 步`}>
        <svg className="diagram-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {nodePositions.slice(0, -1).map((position, index) => <line key={index} x1={position.x + 9} y1={position.y + 1} x2={nodePositions[index + 1].x} y2={nodePositions[index + 1].y + 1} className={index < step ? 'line-active' : ''} />)}
        </svg>
        {chapter.nodes.map((node, index) => {
          const position = nodePositions[index]
          const isVisited = index <= step
          return <div key={node} className={`diagram-node ${isVisited ? 'node-active' : ''} ${index === step ? 'node-current' : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }}>
            <span className="node-kicker">{String(index + 1).padStart(2, '0')}</span>
            <strong>{node}</strong>
            <span>{isVisited ? '已经过' : '等待中'}</span>
          </div>
        })}
      </div>
      <div className="trace-event"><span className="event-index">{String(Math.min(step + 1, chapter.steps.length)).padStart(2, '0')}</span><p>{chapter.steps[Math.min(step, chapter.steps.length - 1)]}</p><span className="event-status">{step >= chapter.steps.length - 1 ? 'TRACE COMPLETE' : 'NEXT EVENT'}</span></div>
    </div>
  )
}

function GenericControls({ chapter, step, setStep, playing, setPlaying }) {
  useEffect(() => {
    if (!playing) return undefined
    const timer = window.setInterval(() => setStep((current) => {
      if (current >= chapter.steps.length - 1) { setPlaying(false); return current }
      return current + 1
    }), 1100)
    return () => window.clearInterval(timer)
  }, [playing, chapter.steps.length, setPlaying, setStep])

  const advance = () => {
    setStep((current) => Math.min(current + 1, chapter.steps.length - 1))
    setPlaying(false)
    track('trace_step', { chapter_id: chapter.id, step: Math.min(step + 2, chapter.steps.length) })
  }
  return <div className="trace-controls">
    <button className="primary-button" onClick={() => { setStep(0); setPlaying(false); track('trace_start', { chapter_id: chapter.id }) }}><Icon name="refresh" size={16} /> 重置路径</button>
    <button className="secondary-button" onClick={() => { setPlaying((value) => !value); track(playing ? 'trace_pause' : 'trace_play', { chapter_id: chapter.id }) }}><Icon name={playing ? 'pause' : 'play'} size={15} /> {playing ? '暂停' : '自动播放'}</button>
    <button className="text-button" onClick={advance} disabled={step >= chapter.steps.length - 1}>下一步 <Icon name="arrow" size={15} /></button>
  </div>
}

function LimiterLab({ rate, setRate, burst, setBurst, algorithm, setAlgorithm }) {
  const requestCount = 7
  const allowed = algorithm === 'token' ? Math.min(requestCount, burst) : algorithm === 'fixed' ? Math.min(requestCount, rate) : Math.min(requestCount, Math.round(rate * 0.72 + burst * 0.2))
  const blocked = requestCount - allowed
  const algorithms = [{ id: 'token', label: '令牌桶', hint: '允许短时突发' }, { id: 'fixed', label: '固定窗口', hint: '边界可能突发' }, { id: 'sliding', label: '滑动计数', hint: '更平滑的近似' }]
  return <div className="deep-lab limiter-lab">
    <div className="lab-heading"><div><span className="eyebrow">DEEP LAB · RATE LIMITER</span><h3>把突发请求放进同一秒</h3></div><span className="assumption">教学模型</span></div>
    <div className="lab-grid">
      <div className="lab-controls">
        <div className="control-label"><span>算法</span><span className="mono">{allowed} pass / {blocked} block</span></div>
        <div className="segmented-control">{algorithms.map((item) => <button key={item.id} className={algorithm === item.id ? 'selected' : ''} onClick={() => { setAlgorithm(item.id); track('lab_algorithm_change', { algorithm: item.id }) }}><strong>{item.label}</strong><small>{item.hint}</small></button>)}</div>
        <label className="range-row"><span>每秒速率 <strong>{rate}</strong></span><input type="range" min="1" max="10" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
        <label className="range-row"><span>桶容量 <strong>{burst}</strong></span><input type="range" min="1" max="10" value={burst} onChange={(event) => setBurst(Number(event.target.value))} /></label>
        <p className="lab-note">在同一时间点模拟 7 个请求。改变参数后，先预测放行数量，再观察下方的状态。</p>
      </div>
      <div className="request-rack" aria-label="请求放行结果">
        <div className="rack-top"><span>REQUEST BURST</span><span>7 REQUESTS</span></div>
        <div className="request-dots">{Array.from({ length: requestCount }, (_, index) => <span key={index} className={index < allowed ? 'request-pass' : 'request-block'}>{String(index + 1).padStart(2, '0')}</span>)}</div>
        <div className="rack-result"><strong>{allowed}</strong><span>通过</span><strong className="blocked-number">{blocked}</strong><span>拒绝</span></div>
        <div className="rack-foot"><span className="legend pass" /> pass <span className="legend block" /> 429 / blocked</div>
      </div>
    </div>
  </div>
}

function HashLab({ virtualNodes, setVirtualNodes }) {
  const keys = [10, 25, 40, 70, 90]
  const baseNodes = [{ label: 'A', position: 20 }, { label: 'B', position: 50 }, { label: 'C', position: 80 }]
  const addedNodes = [...baseNodes, { label: 'D', position: 35 }]
  const assign = (key, nodes) => [...nodes].sort((a, b) => a.position - b.position).find((node) => node.position >= key)?.label ?? [...nodes].sort((a, b) => a.position - b.position)[0].label
  const before = keys.map((key) => assign(key, baseNodes))
  const after = keys.map((key) => assign(key, addedNodes))
  const moved = before.filter((value, index) => value !== after[index]).length
  const ringMarks = [...baseNodes, { label: 'D', position: 35 }].sort((a, b) => a.position - b.position)
  return <div className="deep-lab hash-lab">
    <div className="lab-heading"><div><span className="eyebrow">DEEP LAB · CONSISTENT HASHING</span><h3>新增节点，只切走一段环</h3></div><span className="assumption">5 个示例键</span></div>
    <div className="lab-grid hash-grid">
      <div className="hash-ring-stage"><div className="hash-ring" aria-label="一致性哈希环示意图"><div className="ring-center"><strong>HASH</strong><span>0—99</span></div>{ringMarks.map((node) => <span key={node.label} className={`ring-node ring-${node.label.toLowerCase()}`} style={{ '--angle': `${node.position * 3.6 - 90}deg` }}><i>{node.label}</i></span>)}{keys.map((key) => <span key={key} className={`ring-key key-${key}`} style={{ '--angle': `${key * 3.6 - 90}deg` }}><i>{key}</i></span>)}</div><div className="migration-note"><span className="signal-line" /> D 在 35° 加入，<strong>{moved} / {keys.length}</strong> 个键改变归属</div></div>
      <div className="lab-controls">
        <div className="control-label"><span>虚拟节点</span><span className="mono">{virtualNodes} replicas / entity</span></div>
        <input className="full-range" type="range" min="1" max="16" value={virtualNodes} onChange={(event) => setVirtualNodes(Number(event.target.value))} />
        <div className="key-table"><div className="table-head"><span>KEY</span><span>BEFORE</span><span>AFTER + D</span></div>{keys.map((key, index) => <div className="table-row" key={key}><span className="mono">{key}</span><span>{before[index]}</span><span className={before[index] !== after[index] ? 'changed' : ''}>{after[index]} {before[index] !== after[index] && '↗'}</span></div>)}</div>
        <p className="lab-note">虚拟节点改善样本分布，但不会自动消除单个热点键。把“映射变化”和“数据搬迁”分开想。</p>
      </div>
    </div>
  </div>
}

function MindMap({ chapter }) {
  const [expanded, setExpanded] = useState(0)
  return <div className="mindmap-panel">
    <div className="section-heading"><div><span className="eyebrow">KNOWLEDGE MAP</span><h2>把这一章压缩成一张图</h2></div><span className="section-meta">点击分支展开</span></div>
    <div className="mindmap-canvas">
      <div className="mindmap-root"><span>ARC</span><strong>{chapter.title}</strong><small>one chapter · many trade-offs</small></div>
      <div className="mindmap-branches">{chapter.mindmap.map((branch, index) => <button key={branch[0]} className={`mindmap-branch ${expanded === index ? 'expanded' : ''}`} onClick={() => { setExpanded(index); track('mindmap_expand', { chapter_id: chapter.id, branch: branch[0] }) }}><span className="branch-line" /><span className="branch-copy"><strong>{branch[0]}</strong><small>{branch.slice(1).join(' · ')}</small></span><Icon name="chevron" size={14} /></button>)}</div>
    </div>
    <div className="mindmap-detail"><span className="detail-mark">0{expanded + 1}</span><div><strong>{chapter.mindmap[expanded][0]}</strong><p>{chapter.mindmap[expanded].slice(1).join(' · ')}。先用实验验证，再回到这组概念做复述。</p></div><span className="detail-arrow"><Icon name="arrow" size={15} /></span></div>
  </div>
}

function Practice({ chapter }) {
  const [selected, setSelected] = useState(null)
  const isCorrect = selected === chapter.question[2]
  return <section className="practice-panel">
    <div className="section-heading"><div><span className="eyebrow">RECALL CHECK</span><h2>关掉图之后，你能说清吗？</h2></div><span className="section-meta">1 个快速判断</span></div>
    <p className="question">{chapter.question[0]}</p>
    <div className="answer-list">{chapter.question[1].map((option, index) => <button key={option} className={`answer-option ${selected !== null && index === chapter.question[2] ? 'correct' : ''} ${selected === index && index !== chapter.question[2] ? 'wrong' : ''}`} onClick={() => { setSelected(index); track('practice_answer', { chapter_id: chapter.id, correct: index === chapter.question[2] }) }}><span>{String.fromCharCode(65 + index)}</span>{option}{selected !== null && index === chapter.question[2] && <Icon name="check" size={15} />}</button>)}</div>
    {selected !== null && <div className={`answer-feedback ${isCorrect ? 'feedback-good' : 'feedback-help'}`}><strong>{isCorrect ? '判断正确。' : '先别急，再看事件路径。'}</strong><span>{isCorrect ? '你抓住了这章的核心边界。试着用自己的话解释一次。' : `参考答案是 ${String.fromCharCode(65 + chapter.question[2])}。回到上面的事件路径，看哪一步改变了结果。`}</span></div>}
  </section>
}

function App() {
  const [selectedId, setSelectedId] = useState('v1-04')
  const [query, setQuery] = useState('')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('lab')
  const [algorithm, setAlgorithm] = useState('token')
  const [rate, setRate] = useState(3)
  const [burst, setBurst] = useState(5)
  const [virtualNodes, setVirtualNodes] = useState(4)
  const chapter = useMemo(() => chapters.find((item) => item.id === selectedId) ?? chapters[3], [selectedId])

  useEffect(() => {
    setStep(0)
    setPlaying(false)
    setActiveTab('lab')
  }, [selectedId])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') { event.preventDefault(); document.querySelector('.search-box input')?.focus() }
      if (event.key === 'Escape') document.querySelector('.search-box input')?.blur()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const selectChapter = (id) => { setSelectedId(id); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const isDeep = chapter.lab !== 'trace'
  return <div className="app-shell">
    <ChapterSidebar selectedId={selectedId} onSelect={selectChapter} query={query} onQuery={setQuery} />
    <main className="main-content">
      <header className="topbar"><div className="mobile-brand"><span className="brand-mark">A</span><strong>ARC / LAB</strong></div><div className="topbar-context"><span className="live-dot" /> <span>学习实验室 / {chapter.volume}</span><span className="slash">/</span><strong>内容模型 v0.1.0</strong></div><div className="topbar-actions"><a href="https://learning-guide.gitbook.io/system-design-interview" target="_blank" rel="noreferrer" data-umami-event="source_open">原书目录 <Icon name="link" size={14} /></a><a className="top-github" href={REPO_URL} target="_blank" rel="noreferrer" data-umami-event="github_repo_click"><Icon name="github" size={16} /> GitHub</a></div></header>
      <div className="content-wrap">
        <section className="chapter-hero">
          <div className="hero-copy"><div className="chapter-overline"><span>CHAPTER {chapter.id.split('-')[1]}</span><span className="overline-rule" /><span>{chapter.volume}</span></div><h1>{chapter.title}<em>{chapter.english}</em></h1><p>{chapter.summary}</p><div className="tag-row">{chapter.tags.map((tag) => <span key={tag}>{tag}</span>)}{isDeep && <span className="deep-tag"><Icon name="spark" size={13} /> 深度实验</span>}</div></div>
          <div className="hero-index"><span>INDEX</span><strong>{chapter.id.split('-')[1]}<small>/ 28</small></strong><span className="index-line" /><span className="index-note">先预测，再运行<br />最后解释。</span></div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-tabs" role="tablist" aria-label="学习模块"><button className={activeTab === 'lab' ? 'active' : ''} onClick={() => setActiveTab('lab')} role="tab"><Icon name="trace" size={16} /> 架构实验</button><button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')} role="tab"><Icon name="branch" size={16} /> 思维导图</button><button className={activeTab === 'practice' ? 'active' : ''} onClick={() => setActiveTab('practice')} role="tab"><Icon name="target" size={16} /> 快速复习</button><span className="tab-spacer" /><span className="model-label"><span className="live-dot" /> synthetic model</span></div>
          {activeTab === 'lab' && <>
            <ArchitectureDiagram chapter={chapter} step={step} />
            <div className="workspace-foot"><GenericControls chapter={chapter} step={step} setStep={setStep} playing={playing} setPlaying={setPlaying} /><div className="foot-hint"><span className="hint-key">TIP</span> {step >= chapter.steps.length - 1 ? '路径走完了。现在用右侧问题复述一次。' : '不要急着点下一步，先猜这次状态会怎么变化。'}</div></div>
          </>}
          {activeTab === 'map' && <MindMap chapter={chapter} />}
          {activeTab === 'practice' && <Practice chapter={chapter} />}
        </section>

        {activeTab === 'lab' && <>{chapter.lab === 'limiter' && <LimiterLab rate={rate} setRate={setRate} burst={burst} setBurst={setBurst} algorithm={algorithm} setAlgorithm={setAlgorithm} />}{chapter.lab === 'hashing' && <HashLab virtualNodes={virtualNodes} setVirtualNodes={setVirtualNodes} />}{!isDeep && <div className="trace-note"><div className="trace-note-icon"><Icon name="spark" size={18} /></div><div><strong>这是一个可运行的章节骨架</strong><p>每章先用专属事件路径把核心机制跑通；深度实验会继续补上参数、故障和方案对照。</p></div><button className="text-button" onClick={() => setActiveTab('map')}>先看思维导图 <Icon name="arrow" size={15} /></button></div>}</>}
        {activeTab === 'lab' && <div className="lower-grid"><MindMap chapter={chapter} /><Practice chapter={chapter} /></div>}

        <section className="source-strip"><div className="source-symbol"><Icon name="book" size={20} /></div><div><span className="eyebrow">READ THE SOURCE</span><strong>把实验放回原文语境</strong><p>这组内容是原创学习辅助模型，原文负责完整章节背景、公式与图示。</p></div><a href={chapter.source} target="_blank" rel="noreferrer" onClick={() => track('chapter_source_open', { chapter_id: chapter.id })}>打开本章原文 <Icon name="arrow" size={15} /></a></section>
      </div>
      <footer className="site-footer"><span>ARC / LAB · made for deliberate systems thinking</span><span><a href={REPO_URL} target="_blank" rel="noreferrer">GitHub repo</a><span className="footer-sep">·</span><a href={PAGES_URL} target="_blank" rel="noreferrer">Live pages</a></span></footer>
    </main>
  </div>
}

export default App

createRoot(document.getElementById('root')).render(<App />)
