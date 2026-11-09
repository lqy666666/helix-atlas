import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Dna, Rows3 } from 'lucide-react';
import { BASE_NAMES } from '../lib/sequence.js';
import './dna-pairing.css';

const WINDOW_SIZE = 120;
const BASE_COLOR = { A: '#087d68', T: '#b64e3b', C: '#405db3', G: '#936719' };
const BASE_FILL = { A: '#ddf5eb', T: '#ffe7df', C: '#e4ebff', G: '#fff0c9' };
const INPUT_COLOR = '#087d78';
const COMPLEMENT_COLOR = '#7951b0';
const STEP = 64;
const LEFT = 58;

function PairRow({ sequence, complement, start, total, columns, view, angle, selected, onSelect, uid }) {
  // Keep a consistent scale and column alignment, including the final short row.
  const width = columns * STEP + LEFT * 2;
  const firstX = LEFT + STEP / 2;
  const xAt = i => firstX + i * STEP;
  const phaseAt = i => (start + i) * Math.PI / 5.25 + angle * Math.PI / 180;
  const point = (i, side) => ({ x: xAt(i), y: 151 + Math.cos(phaseAt(i) + side * Math.PI) * 58 });
  const segments = [];
  if (view === 'helix') {
    for (let side = 0; side < 2; side += 1) {
      let run = null;
      for (let i = -.4; i < sequence.length - .6; i += .125) {
        const p1 = point(i, side);
        const p2 = point(Math.min(i + .125, sequence.length - .6), side);
        const front = Math.sin(phaseAt(i) + side * Math.PI) > 0;
        if (!run || run.front !== front) {
          run = { key: `${side}-${i}`, d: `M${p1.x},${p1.y}`, front, side };
          segments.push(run);
        }
        run.d += ` L${p2.x},${p2.y}`;
      }
    }
  }
  const backbone = front => segments.filter(segment => segment.front === front).map(segment => (
    <g key={segment.key} pointerEvents="none" fill="none">
      {front ? <path d={segment.d} stroke="#173d4c" strokeWidth="16" strokeLinecap="round" opacity=".07" transform="translate(0,3)" /> : null}
      <path d={segment.d} stroke={`url(#${uid}-${segment.side ? 'complement' : 'input'}-tube)`} strokeWidth={front ? 13 : 10} strokeLinecap="round" opacity={front ? 1 : .45} />
      {front ? <path d={segment.d} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".4" transform="translate(0,-2)" /> : null}
    </g>
  ));
  const endLabel = (side, end) => {
    if (end === 'start') return start === 0 ? (side === 0 ? '5′' : '3′') : '···';
    return start + sequence.length === total ? (side === 0 ? '3′' : '5′') : '···';
  };

  return <svg className="duplex-row-svg" viewBox={`0 0 ${width} 304`} role="group" aria-label={`位置 ${start + 1} 至 ${start + sequence.length} 的 DNA 配对`}>
    <defs>
      <linearGradient id={`${uid}-input-tube`} gradientUnits="userSpaceOnUse" x1="0" y1="93" x2="0" y2="209"><stop stopColor="#0e6b66" /><stop offset=".4" stopColor="#39c7ae" /><stop offset="1" stopColor="#075953" /></linearGradient>
      <linearGradient id={`${uid}-complement-tube`} gradientUnits="userSpaceOnUse" x1="0" y1="93" x2="0" y2="209"><stop stopColor="#70449c" /><stop offset=".4" stopColor="#b18be0" /><stop offset="1" stopColor="#593680" /></linearGradient>
      <radialGradient id={`${uid}-input-node`} cx=".3" cy=".25"><stop stopColor="#c6fff1" /><stop offset=".42" stopColor="#35baa3" /><stop offset="1" stopColor="#086c65" /></radialGradient>
      <radialGradient id={`${uid}-complement-node`} cx=".3" cy=".25"><stop stopColor="#f6eaff" /><stop offset=".42" stopColor="#b390d9" /><stop offset="1" stopColor="#7346a3" /></radialGradient>
    </defs>
    <text x="16" y="20" className="duplex-range">位置 {start + 1}—{start + sequence.length}</text>
    <text x="25" y="66" className="duplex-end" fill={INPUT_COLOR}>{endLabel(0, 'start')}</text>
    <text x={Math.min(width - 25, xAt(sequence.length - 1) + 52)} y="66" className="duplex-end" fill={INPUT_COLOR}>{endLabel(0, 'end')}</text>
    <text x="25" y="268" className="duplex-end" fill={COMPLEMENT_COLOR}>{endLabel(1, 'start')}</text>
    <text x={Math.min(width - 25, xAt(sequence.length - 1) + 52)} y="268" className="duplex-end" fill={COMPLEMENT_COLOR}>{endLabel(1, 'end')}</text>
    {view === 'helix' ? backbone(false) : <g pointerEvents="none">
      <path d={`M${firstX - 26},70 H${xAt(sequence.length - 1) + 26}`} stroke={INPUT_COLOR} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${firstX - 26},240 H${xAt(sequence.length - 1) + 26}`} stroke={COMPLEMENT_COLOR} strokeWidth="7" strokeLinecap="round" />
      {Array.from({ length: Math.max(0, sequence.length - 1) }, (_, i) => <g key={i}>
        <circle cx={xAt(i) + STEP / 2} cy="70" r="7" fill="#e6faf6" stroke={INPUT_COLOR} strokeWidth="2" />
        <circle cx={xAt(i) + STEP / 2} cy="240" r="7" fill="#f1e9ff" stroke={COMPLEMENT_COLOR} strokeWidth="2" />
      </g>)}
    </g>}
    {[...sequence].map((base, i) => {
      const position = start + i;
      const paired = complement[i];
      const bonds = base === 'A' || base === 'T' ? 2 : 3;
      const x = xAt(i);
      const a = point(i, 0), b = point(i, 1);
      const active = selected === position;
      const inputY = view === 'helix' ? 53 : 109;
      const complementY = view === 'helix' ? 259 : 201;
      return <g key={position} className={`duplex-pair ${active ? 'is-selected' : ''}`} role="button" tabIndex="0" aria-pressed={active} aria-label={`位置 ${position + 1}，用户输入 ${base}，互补 ${paired}，${bonds} 条氢键`} data-position={position + 1} data-input={base} data-complement={paired} onClick={() => onSelect(position)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(position); } }}>
        <title>{`位置 ${position + 1}：${BASE_NAMES[base]} ${base} ↔ ${BASE_NAMES[paired]} ${paired}`}</title>
        <rect className="duplex-hit" x={x - 29} y="31" width="58" height="253" rx="12" fill={active ? '#e7f1f6' : 'transparent'} stroke={active ? '#7293a8' : 'transparent'} />
        {view === 'helix' ? <g pointerEvents="none">
          <path d={`M${x},73 V${a.y}`} stroke={INPUT_COLOR} strokeWidth="1.2" strokeDasharray="3 4" opacity=".55" />
          <path d={`M${x},239 V${b.y}`} stroke={COMPLEMENT_COLOR} strokeWidth="1.2" strokeDasharray="3 4" opacity=".55" />
          <line x1={x} y1={a.y} x2={x} y2={(a.y + b.y) / 2} stroke={BASE_COLOR[base]} strokeWidth="9" strokeLinecap="round" />
          <line x1={x} y1={(a.y + b.y) / 2} x2={x} y2={b.y} stroke={BASE_COLOR[paired]} strokeWidth="9" strokeLinecap="round" />
          <line x1={x - 2} y1={a.y} x2={x - 2} y2={b.y} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".4" />
          <circle cx={x} cy={a.y} r="7" fill={`url(#${uid}-input-node)`} />
          <circle cx={x} cy={b.y} r="7" fill={`url(#${uid}-complement-node)`} />
        </g> : <g pointerEvents="none">
          <path d={`M${x},70 V92 M${x},218 V240`} stroke="#7597a1" strokeWidth="3" />
          <path d={`M${x},60 l10,7 -4,12 h-12 l-4,-12 Z`} fill="#d0eee5" stroke={INPUT_COLOR} strokeWidth="2" />
          <path d={`M${x},230 l10,7 -4,12 h-12 l-4,-12 Z`} fill="#e7dcf9" stroke={COMPLEMENT_COLOR} strokeWidth="2" />
          {Array.from({ length: bonds }, (_, bond) => <line key={bond} x1={x + (bond - (bonds - 1) / 2) * 9} x2={x + (bond - (bonds - 1) / 2) * 9} y1="132" y2="177" stroke="#65818d" strokeWidth="2" strokeDasharray="3 4" />)}
        </g>}
        {[[base, inputY], [paired, complementY]].map(([letter, y], j) => <g key={j} pointerEvents="none">
          <rect x={x - 22} y={y - 19} width="44" height="38" rx="9" fill={BASE_FILL[letter]} stroke={BASE_COLOR[letter]} strokeWidth={active ? 2.3 : 1.3} />
          <text x={x} y={y + 8} className="duplex-letter" fill={BASE_COLOR[letter]}>{letter}</text>
        </g>)}
        <text x={x} y="298" className="duplex-position">{position + 1}</text>
      </g>;
    })}
    {view === 'helix' ? backbone(true) : null}
  </svg>;
}

export default function DnaPairing({ analysis }) {
  const [view, setView] = useState('helix');
  const [angle, setAngle] = useState(35);
  const [windowIndex, setWindowIndex] = useState(0);
  const [selected, setSelected] = useState(0);
  const [jump, setJump] = useState('');
  const [jumpError, setJumpError] = useState('');
  const [columns, setColumns] = useState(10);
  const stageRef = useRef(null);
  const uid = useId().replace(/:/g, '');
  const totalWindows = Math.ceil(analysis.length / WINDOW_SIZE);
  const safeWindow = Math.min(windowIndex, Math.max(0, totalWindows - 1));
  const start = safeWindow * WINDOW_SIZE;
  const end = Math.min(start + WINDOW_SIZE, analysis.length);
  const safeSelected = Math.min(selected, analysis.length - 1);
  const base = analysis.sequence[safeSelected];
  const complement = analysis.complement[safeSelected];
  const bonds = base === 'A' || base === 'T' ? 2 : 3;
  const rows = [];
  for (let offset = start; offset < end; offset += columns) rows.push(offset);

  useEffect(() => { setWindowIndex(0); setSelected(0); setJump(''); setJumpError(''); if (stageRef.current) stageRef.current.scrollTop = 0; }, [analysis.sequence]);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new ResizeObserver(([entry]) => setColumns(Math.max(3, Math.min(12, Math.floor((entry.contentRect.width - 116) / STEP)))));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  function changeWindow(index) {
    setWindowIndex(index);
    setSelected(index * WINDOW_SIZE);
    setJumpError('');
    stageRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }
  function goToPosition(event) {
    event.preventDefault();
    const position = Number(jump);
    if (!Number.isInteger(position) || position < 1 || position > analysis.length) { setJumpError(`请输入 1—${analysis.length} 之间的整数位置。`); return; }
    const index = position - 1;
    setWindowIndex(Math.floor(index / WINDOW_SIZE));
    setSelected(index);
    setJumpError('');
    requestAnimationFrame(() => {
      const row = stageRef.current?.querySelector(`[data-position="${position}"]`);
      row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  return <section className="duplex-panel" aria-labelledby="duplex-title">
    <div className="duplex-heading"><div><h2 id="duplex-title">DNA 双链配对</h2><p>从你的序列出发，把每一个碱基与它的互补伙伴连接起来。</p></div><span className="duplex-total">{analysis.length.toLocaleString()} <small>组碱基对</small></span></div>
    <div className="duplex-strand-key"><div><i className="input-strand-dot" /><span><strong>用户输入链</strong><small>上方字母 · 5′ → 3′</small></span></div><div><i className="complement-strand-dot" /><span><strong>互补链</strong><small>下方字母 · 3′ → 5′</small></span></div></div>
    <div className="duplex-controls"><div className="duplex-switch" role="group" aria-label="DNA 显示方式"><button type="button" aria-pressed={view === 'helix'} onClick={() => setView('helix')}><Dna size={18} />双螺旋</button><button type="button" aria-pressed={view === 'paired'} onClick={() => setView('paired')}><Rows3 size={18} />配对展开</button></div>{view === 'helix' ? <label className="duplex-angle">旋转角度<input aria-label="双螺旋旋转角度" type="range" min="0" max="360" value={angle} onChange={event => setAngle(Number(event.target.value))} /><output>{angle}°</output></label> : <p className="duplex-bond-key"><span>··</span> A–T：2 条氢键 <span>···</span> C–G：3 条氢键</p>}</div>
    <p className="duplex-caption">{view === 'helix' ? '拖动角度观察双螺旋；上下方字母保持可读，细线连接到各自的骨架。' : '将双链展开逐位阅读：绿色骨架连接输入链，紫色骨架连接互补链。'} 点击任意一组查看配对。</p>
    <div className="duplex-window-label"><strong>当前显示 {start + 1}—{end} / {analysis.length} bp</strong><span>{analysis.length <= WINDOW_SIZE ? '完整序列' : '每段最多 120 bp，可翻页查看全部'} · 图内可上下滚动</span></div>
    <div className="duplex-stage" ref={stageRef} tabIndex="0" role="region" aria-label="DNA 双链配对绘图区">
      {rows.map(offset => <PairRow key={offset} sequence={analysis.sequence.slice(offset, Math.min(offset + columns, end))} complement={analysis.complement.slice(offset, Math.min(offset + columns, end))} start={offset} total={analysis.length} columns={columns} view={view} angle={angle} selected={safeSelected} onSelect={setSelected} uid={`${uid}-${offset}`} />)}
    </div>
    <div className="duplex-selection" aria-live="polite"><span className="duplex-selection-index">位置 {safeSelected + 1}</span><div><span>用户输入 <b style={{ color: BASE_COLOR[base] }}>{base}</b> {BASE_NAMES[base]}</span><span aria-hidden="true">↔</span><span>互补 <b style={{ color: BASE_COLOR[complement] }}>{complement}</b> {BASE_NAMES[complement]}</span></div><strong>{bonds} 条氢键</strong></div>
    <div className="duplex-navigation">{totalWindows > 1 ? <div className="duplex-pager"><button type="button" disabled={safeWindow === 0} onClick={() => changeWindow(safeWindow - 1)}><ArrowLeft size={17} />上一段</button><span>{safeWindow + 1} / {totalWindows}</span><button type="button" disabled={safeWindow >= totalWindows - 1} onClick={() => changeWindow(safeWindow + 1)}>下一段<ArrowRight size={17} /></button></div> : <p>所有 {analysis.length} 组配对均已绘制。</p>}<form onSubmit={goToPosition}><label htmlFor={`${uid}-jump`}>定位碱基</label><input id={`${uid}-jump`} inputMode="numeric" value={jump} onChange={event => setJump(event.target.value)} placeholder={`1—${analysis.length}`} aria-describedby={jumpError ? `${uid}-error` : undefined} /><button type="submit">跳转</button></form></div>
    {jumpError ? <p className="duplex-jump-error" id={`${uid}-error`} role="alert">{jumpError}</p> : null}
    <p className="duplex-footnote">双链反向平行。此图按输入序列绘制配对关系与双螺旋示意，非原子级结构模型；各行按位置连续接续。</p>
  </section>;
}
