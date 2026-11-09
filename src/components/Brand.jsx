import { Dna } from 'lucide-react';

export default function Brand() {
  return (
    <div className="brand" aria-label="Helix Atlas">
      <span className="brand-symbol"><Dna size={22} strokeWidth={1.8} /></span>
      <span className="brand-text"><strong>HELIX</strong><small>ATLAS</small></span>
    </div>
  );
}
