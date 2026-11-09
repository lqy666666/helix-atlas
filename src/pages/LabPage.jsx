import { ArrowRight, Check, CircleAlert, Clipboard, Dna, FileText, Sparkles } from 'lucide-react';
import Composition from '../components/Composition.jsx';
import SequenceRail from '../components/SequenceRail.jsx';
import { EXAMPLES, groupSequence } from '../lib/sequence.js';

export default function LabPage({ raw, setRaw, analysis, error, onAnalyze, onExample, onNavigate, copied, onCopy }) {
  const preview = analysis.sequence.slice(0, 80);
  return (
    <div className="page lab-page">
      <div className="page-intro">
        <div><p className="section-index">01 / SEQUENCE LAB</p><h1>从一串字母，<br /><em>读出生命的语言。</em></h1><p className="intro-copy">输入 DNA 序列，探索碱基组成、互补关系和开放阅读框。每一步都清晰可见。</p></div>
        <div className="intro-emblem" aria-hidden="true"><Dna size={94} strokeWidth={0.8} /><span>5′ — 3′</span></div>
      </div>
      <div className="work-grid">
        <section className="editor-panel" aria-labelledby="editor-heading">
          <div className="panel-title"><div><span className="panel-icon"><FileText size={18} /></span><div><h2 id="editor-heading">输入你的序列</h2><p>支持 A、T、C、G；可直接粘贴 FASTA 文本</p></div></div><span className="subtle-label">01 · INPUT</span></div>
          <label className="field-label" htmlFor="dna-input">DNA 序列 · 5′→3′</label>
          <div className={`editor-wrap ${error ? 'has-error' : ''}`}>
            <textarea id="dna-input" spellCheck="false" value={raw} onChange={event => setRaw(event.target.value)} placeholder="例如 ATGAAACCCGGGTTTTAG" aria-describedby="dna-help dna-error" />
            <div className="editor-foot"><span id="dna-help">空格、换行和行号会自动忽略</span><span>{raw.length} 字符</span></div>
          </div>
          {error ? <p id="dna-error" className="field-error" role="alert"><CircleAlert size={16} />{error}</p> : <p id="dna-error" className="field-hint">输入序列后点击分析，图谱与统计将同步更新。</p>}
          <div className="editor-actions"><button className="primary-button" type="button" onClick={onAnalyze}><Sparkles size={17} />分析序列<ArrowRight size={17} /></button><button className="text-button" type="button" onClick={() => setRaw('')}>清空输入</button></div>
          <div className="examples"><span>试用教学样本</span><div>{EXAMPLES.map((example, index) => <button key={example.name} type="button" onClick={() => onExample(index)}>{example.name}<ArrowRight size={14} /></button>)}</div></div>
        </section>
        <aside className="result-panel" aria-labelledby="result-heading">
          <div className="result-head"><span>ANALYSIS OVERVIEW</span><span className="live-dot">已分析</span></div>
          <h2 id="result-heading">序列概览</h2>
          <div className="hero-metric"><strong>{analysis.length.toLocaleString()}</strong><span>bp<br />碱基对长度</span></div>
          <div className="result-divider" />
          <div className="gc-row"><div><strong>GC 含量</strong><span>G + C 占序列的比例</span></div><b>{analysis.gc.toFixed(1)}<small>%</small></b></div>
          <div className="gc-meter" role="meter" aria-label="GC 含量" aria-valuenow={analysis.gc} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${analysis.gc}%` }} /></div>
          <Composition analysis={analysis} />
          <div className="orf-summary"><div className="orf-symbol"><Dna size={18} /></div><div><strong>{analysis.orfs.filter(item => item.complete).length} 个完整 ORF</strong><span>从 ATG 到同框终止密码子</span></div></div>
        </aside>
      </div>
      <section className="preview-section" aria-labelledby="preview-heading">
        <div className="section-heading"><div><p className="section-index">02 / FIRST LOOK</p><h2 id="preview-heading">看见序列的节奏</h2><p>每个碱基都有固定颜色。点击完整图谱，可查看互补链与 RNA 转录。</p></div><button type="button" className="outline-button" onClick={() => onNavigate('/map')}>打开完整图谱<ArrowRight size={17} /></button></div>
        <div className="preview-frame"><div className="preview-top"><span>DNA · {analysis.length} bp</span><button type="button" onClick={() => onCopy(groupSequence(analysis.sequence))}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? '已复制' : '复制序列'}</button></div><SequenceRail label="输入链" direction="5′ → 3′" sequence={preview} highlight={analysis.orfs[0]} />{analysis.length > preview.length ? <p className="preview-note">预览前 80 bp · 完整序列请进入图谱</p> : null}</div>
      </section>
    </div>
  );
}
