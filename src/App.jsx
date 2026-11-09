import { useEffect, useMemo, useState } from 'react';
import Shell from './components/Shell.jsx';
import GuidePage from './pages/GuidePage.jsx';
import LabPage from './pages/LabPage.jsx';
import MapPage from './pages/MapPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { EXAMPLES, analyzeSequence, parseSequence } from './lib/sequence.js';

const STORAGE_KEY = 'helix-atlas-sequence-v1';
const MAX_LENGTH = 10000;
const initialSequence = EXAMPLES[0].sequence;

// GitHub Pages 子路径部署：BASE 形如 "/helix-atlas"，本地开发为 ""
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

function currentRoute() {
  const path = BASE && window.location.pathname.startsWith(BASE)
    ? window.location.pathname.slice(BASE.length) || '/'
    : window.location.pathname;
  return ['/lab', '/map', '/guide'].includes(path) ? path : '/';
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [raw, setRaw] = useState(() => localStorage.getItem(STORAGE_KEY) || initialSequence);
  const [committed, setCommitted] = useState(() => {
    const parsed = parseSequence(localStorage.getItem(STORAGE_KEY) || initialSequence);
    return parsed.sequence && !parsed.invalid.length && parsed.sequence.length <= MAX_LENGTH ? parsed.sequence : initialSequence;
  });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const analysis = useMemo(() => analyzeSequence(committed), [committed]);

  useEffect(() => {
    const onPop = () => setRoute(currentRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function navigate(path) {
    const url = `${BASE}${path}`;
    if (window.location.pathname !== url) window.history.pushState({}, '', url);
    setRoute(path);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function commit(value) {
    const parsed = parseSequence(value);
    if (!parsed.sequence) { setError('请输入至少一个 DNA 碱基。'); return; }
    if (parsed.invalid.length) { setError(`包含无效字符：${parsed.invalid.join('、')}。请只输入 A、T、C、G。`); return; }
    if (parsed.sequence.length > MAX_LENGTH) { setError(`当前最多分析 ${MAX_LENGTH.toLocaleString()} bp，请缩短序列。`); return; }
    setError('');
    setCommitted(parsed.sequence);
    localStorage.setItem(STORAGE_KEY, parsed.sequence);
    setCopied(false);
  }

  function example(index) {
    const sequence = EXAMPLES[index]?.sequence || initialSequence;
    setRaw(sequence);
    commit(sequence);
  }

  async function copy(value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (route === '/') return <HomePage onNavigate={navigate} />;
  return <Shell route={route} onNavigate={navigate}>
    {route === '/map' ? <MapPage analysis={analysis} onNavigate={navigate} copied={copied} onCopy={copy} /> : null}
    {route === '/guide' ? <GuidePage onExample={example} onNavigate={navigate} /> : null}
    {route === '/lab' ? <LabPage raw={raw} setRaw={setRaw} analysis={analysis} error={error} onAnalyze={() => commit(raw)} onExample={example} onNavigate={navigate} copied={copied} onCopy={copy} /> : null}
  </Shell>;
}
