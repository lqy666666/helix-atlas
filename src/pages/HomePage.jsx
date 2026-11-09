import { ArrowRight } from 'lucide-react';
import dnaVideo from '../assets/videos/home-dna.mp4';

export default function HomePage({ onNavigate }) {
  return (
    <main className="entry-page">
      <video className="entry-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
        <source src={dnaVideo} type="video/mp4" />
      </video>
      <button className="entry-button" type="button" onClick={() => onNavigate('/lab')}>
        进入序列实验室 <ArrowRight size={20} aria-hidden="true" />
      </button>
    </main>
  );
}
