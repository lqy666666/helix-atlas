import { BASE_NAMES } from '../lib/sequence.js';

export default function SequenceRail({ label, direction, sequence, offset = 0, highlight = null, rna = false }) {
  const rows = [];
  for (let rowStart = 0; rowStart < sequence.length; rowStart += 40) {
    rows.push({ start: rowStart, content: sequence.slice(rowStart, rowStart + 40) });
  }
  return (
    <div className="rail">
      <div className="rail-head"><div><strong>{label}</strong><span>{direction}</span></div><span>{sequence.length ? `${offset + 1}—${offset + sequence.length}` : '—'}</span></div>
      <div className="rail-scroll">
        {rows.map(({ start, content }) => (
          <div className="rail-row" key={start}>
            <span className="rail-index">{String(offset + start + 1).padStart(3, '0')}</span>
            <div className="rail-bases">
              {[...content].map((base, index) => {
                const absolute = offset + start + index;
                const inOrf = highlight && absolute >= highlight.start && absolute < highlight.end;
                return <span key={absolute} className={`base base-${base.toLowerCase()} ${inOrf ? 'in-orf' : ''} ${(index + 1) % 10 === 0 ? 'group-end' : ''}`} title={`${base} · ${rna && base === 'U' ? '尿嘧啶' : BASE_NAMES[base]} · 位置 ${absolute + 1}`}>{base}</span>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
