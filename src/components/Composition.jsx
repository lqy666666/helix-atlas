import { BASES, BASE_NAMES } from '../lib/sequence.js';

export default function Composition({ analysis }) {
  const { counts, length } = analysis;
  return (
    <div className="composition">
      <div className="composition-track" role="img" aria-label={`碱基组成：A ${counts.A}，T ${counts.T}，C ${counts.C}，G ${counts.G}`}>
        {BASES.map(base => <span key={base} className={`segment segment-${base.toLowerCase()}`} style={{ width: `${length ? counts[base] / length * 100 : 0}%` }} />)}
      </div>
      <div className="composition-legend">
        {BASES.map(base => <div key={base}><span className={`legend-dot base-${base.toLowerCase()}`} /><strong>{base}</strong><span>{BASE_NAMES[base]}</span><b>{counts[base]}</b></div>)}
      </div>
    </div>
  );
}
