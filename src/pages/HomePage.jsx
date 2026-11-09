import { ArrowRight } from 'lucide-react';

export default function HomePage({ onNavigate }) {
  return (
    <main className="entry-page">
      <video className="entry-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
        <source src="/videos/home-dna.mp4" type="video/mp4" />
      </video>
      <button className="entry-button" type="button" onClick={() => onNavigate('/lab')}>
        进入序列实验室 <ArrowRight size={20} aria-hidden="true" />
      </button>
    </main>
  );
}
