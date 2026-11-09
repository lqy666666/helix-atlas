import { ArrowLeft, ArrowRight, Check, Clipboard, Dna, Info, Layers3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import SequenceRail from '../components/SequenceRail.jsx';
import DnaPairing from '../components/DnaPairing.jsx';

const PAGE_SIZE = 240;

export default function MapPage({ analysis, onNavigate, copied, onCopy }) {
  const [page, setPage] = useState(0);
  const [selectedOrf, setSelectedOrf] = useState(0);
  const [showReverse, setShowReverse] = useState(false);
  const pageCount = Math.max(1, Math.ceil(analysis.length / PAGE_SIZE));
  useEffect(() => { setPage(0); setSelectedOrf(0); }, [analysis.sequence]);
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, analysis.length);
  const activeOrf = analysis.orfs[selectedOrf] || null;
  const track = showReverse ? analysis.reverseComplement : analysis.complement;

  function chooseOrf(index) {
    setSelectedOrf(index);
    setPage(Math.floor(analysis.orfs[index].start / PAGE_SIZE));
  }

  return (
    <div className="page map-page">
      <div className="map-intro"><div><p className="section-index">02 / SEQUENCE MAP</p><h1>沿着碱基，<br /><em>找到方向。</em></h1><p className="intro-copy">并排观察原始链、互补链和转录结果。位置刻度与阅读框帮助你把序列放回上下文。</p></div><div className="map-count"><span>当前序列</span><strong>{analysis.length}<small> bp</small></strong><button type="button" onClick={() => onNavigate('/lab')}>编辑序列<ArrowRight size={15} /></button></div></div>
      <DnaPairing analysis={analysis} />
      <div className="map-toolbar"><div className="map-tabs"><span className="active"><Layers3 size={17} />三轨图谱</span></div><div className="map-toolbar-actions"><span>显示 {start + 1}—{end} / {analysis.length}</span><button type="button" onClick={() => onCopy(analysis.sequence)}>{copied ? <Check size={16} /> : <Clipboard size={16} />}{copied ? '已复制' : '复制 DNA'}</button></div></div>
      <div className="rail-stack">
        <SequenceRail label="输入链 · DNA" direction="5′ → 3′" sequence={analysis.sequence.slice(start, end)} offset={start} highlight={activeOrf} />
        {!showReverse ? <div className="pair-links" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /></div> : null}
        <SequenceRail label={showReverse ? '反向互补链 · DNA' : '互补链 · DNA'} direction={showReverse ? '5′ → 3′' : '3′ → 5′'} sequence={track.slice(showReverse ? Math.max(0, analysis.length - end) : start, showReverse ? analysis.length - start : end)} offset={showReverse ? Math.max(0, analysis.length - end) : start} />
        <div className="rail-options"><button type="button" className={showReverse ? 'selected' : ''} onClick={() => setShowReverse(value => !value)}>{showReverse ? '显示平行互补链' : '切换为反向互补链'}</button><span>{showReverse ? '反向互补链按 5′→3′ 展示，位置从该链起点计数' : '互补链与输入链逐位配对，方向为 3′→5′'}</span></div>
        <SequenceRail label="转录结果 · RNA" direction="5′ → 3′" sequence={analysis.rna.slice(start, end)} offset={start} rna />
      </div>
      {pageCount > 1 ? <div className="pager"><button type="button" disabled={page === 0} onClick={() => setPage(value => value - 1)}><ArrowLeft size={17} />上一段</button><span>第 {page + 1} / {pageCount} 段</span><button type="button" disabled={page === pageCount - 1} onClick={() => setPage(value => value + 1)}>下一段<ArrowRight size={17} /></button></div> : null}
      <div className="map-bottom"><section className="orf-panel"><div className="section-heading compact"><div><p className="section-index">READING FRAMES</p><h2>开放阅读框</h2><p>从 ATG 起始，沿同一阅读框寻找 TAA、TAG 或 TGA。</p></div></div>
        <div className="frame-chart" role="img" aria-label={`输入链中找到 ${analysis.orfs.length} 个 ATG 起始位点`}>
          {[0, 1, 2].map(frame => <div className="frame-row" key={frame}><span>框架 {frame + 1}</span><div className="frame-line">{analysis.orfs.map((orf, index) => orf.frame === frame ? <button key={`${orf.start}-${index}`} type="button" className={`orf-bar ${index === selectedOrf ? 'selected' : ''} ${orf.complete ? '' : 'open'}`} style={{ left: `${orf.start / analysis.length * 100}%`, width: `${Math.max((orf.end - orf.start) / analysis.length * 100, 1.5)}%` }} onClick={() => chooseOrf(index)} title={`位置 ${orf.start + 1}—${orf.end}，${orf.complete ? '完整' : '未闭合'}`} aria-label={`选择框架 ${frame + 1} 中位置 ${orf.start + 1} 到 ${orf.end} 的${orf.complete ? '完整' : '未闭合'} ORF`} /> : null)}</div></div>)}
        </div>
        <div className="orf-list">{analysis.orfs.length ? analysis.orfs.slice(0, 8).map((orf, index) => <button key={`${orf.start}-${index}`} type="button" className={index === selectedOrf ? 'active' : ''} onClick={() => chooseOrf(index)}><span className={orf.complete ? 'status complete' : 'status'}>{orf.complete ? '完整' : '未闭合'}</span><strong>{orf.start + 1}—{orf.end}</strong><span>框架 {orf.frame + 1} · {orf.end - orf.start} bp</span><ArrowRight size={15} /></button>) : <div className="empty-orf"><Dna size={28} strokeWidth={1.2} /><strong>暂无 ATG 起始位点</strong><p>当前输入链的三个正向阅读框中没有找到起始密码子。</p></div>}</div>
      </section><aside className="note-panel"><Info size={21} /><h3>如何阅读这张图</h3><p>互补链与输入链反向平行；切换到反向互补链后，它会按 5′→3′ 重新排列。RNA 轨道表示输入链作为编码链时的序列，仅将 T 替换为 U。</p><div><strong>教学范围</strong><span>这里只检查输入链上的三个正向阅读框。ORF 高亮不等于基因预测，也不包含蛋白质翻译。</span></div></aside></div>
    </div>
  );
}
