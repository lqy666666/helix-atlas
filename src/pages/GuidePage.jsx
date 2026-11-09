import { ArrowRight, Dna, FlaskConical, ScanSearch } from 'lucide-react';
import { useState } from 'react';
import { BASES, BASE_NAMES, EXAMPLES } from '../lib/sequence.js';

const PAIRS = { A: 'T', T: 'A', C: 'G', G: 'C' };

export default function GuidePage({ onExample, onNavigate }) {
  const [picked, setPicked] = useState('A');
  const hydrogenBonds = picked === 'A' || picked === 'T' ? 2 : 3;
  return (
    <div className="page guide-page">
      <div className="guide-intro"><p className="section-index">03 / FIELD GUIDE</p><h1>读懂序列，<br /><em>从四个字母开始。</em></h1><p className="intro-copy">一份简短的图解指南，帮助你理解工作台上每个数字和标记的含义。</p></div>
      <section className="guide-feature"><div className="guide-feature-copy"><span className="guide-number">01</span><h2>四种碱基，<br />两组配对。</h2><p>DNA 中 A 与 T 配对，C 与 G 配对。点选一个碱基，看看另一条链会出现什么。</p><div className="base-picker" role="group" aria-label="选择碱基">{BASES.map(base => <button key={base} type="button" className={`base-${base.toLowerCase()} ${picked === base ? 'active' : ''}`} onClick={() => setPicked(base)} aria-pressed={picked === base}>{base}<span>{BASE_NAMES[base]}</span></button>)}</div></div><div className="pair-visual"><div className="pair-caption">BASE PAIRING / 碱基配对</div><div className="pair-display"><span className={`pair-letter base-${picked.toLowerCase()}`}>{picked}</span><span className="pair-bridge" role="img" aria-label={`${hydrogenBonds} 条氢键`}>{Array.from({ length: hydrogenBonds }, (_, index) => <i key={index} />)}</span><span className={`pair-letter base-${PAIRS[picked].toLowerCase()}`}>{PAIRS[picked]}</span></div><div className="pair-directions"><span>5′ → 3′</span><span>3′ ← 5′</span></div><p>{BASE_NAMES[picked]} 与 {BASE_NAMES[PAIRS[picked]]} 配对</p></div></section>
      <section className="guide-steps"><div className="section-heading"><div><p className="section-index">THE READING PATH</p><h2>分析结果从哪里来？</h2></div></div><div className="step-grid"><article><span className="step-icon"><ScanSearch size={24} strokeWidth={1.5} /></span><span className="step-index">01 / 组成</span><h3>计算 GC 含量</h3><p>将 G 和 C 的数量相加，再除以序列总长度。例如 8 个碱基中有 4 个 G 或 C，GC 含量就是 50%。</p><div className="step-example">(G + C) ÷ 全长 × 100%</div></article><article><span className="step-icon"><Dna size={24} strokeWidth={1.5} /></span><span className="step-index">02 / 转换</span><h3>互补与转录</h3><p>配对产生反向平行的互补链；若输入链视为编码链，RNA 序列保留原顺序，只把 T 换成 U。</p><div className="step-example">ATGC → AUGC <small>编码链转录示例</small></div></article><article><span className="step-icon"><FlaskConical size={24} strokeWidth={1.5} /></span><span className="step-index">03 / 阅读框</span><h3>寻找 ORF</h3><p>从 ATG 开始，每三个碱基向前读，遇到同框的 TAA、TAG 或 TGA 时形成一个完整 ORF。</p><div className="step-example">ATG · AAA · TAG</div></article></div></section>
      <section className="direction-note"><div><p className="section-index">A NOTE ON DIRECTION</p><h2>方向不同，结果也不同。</h2><p>以输入链 <code>ATGC</code> 为例，平行展示的互补链是 <code>TACG</code>（3′→5′）；反向互补链是 <code>GCAT</code>（5′→3′）。如果输入链作为编码链，转录后的 RNA 是 <code>AUGC</code>（5′→3′）。</p></div><div className="direction-example"><div><span>DNA</span><strong>5′ ATGC 3′</strong></div><div><span>互补链</span><strong>3′ TACG 5′</strong></div><div><span>反向互补</span><strong>5′ GCAT 3′</strong></div><div><span>RNA</span><strong>5′ AUGC 3′</strong></div></div></section>
      <section className="guide-cta"><div><p className="section-index">TRY IT YOURSELF</p><h2>从一个教学样本开始。</h2><p>{EXAMPLES[0].description}，适合第一次操作。</p></div><button type="button" className="primary-button" onClick={() => { onExample(0); onNavigate('/lab'); }}>载入短序列练习<ArrowRight size={17} /></button></section>
    </div>
  );
}
