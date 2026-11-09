import { BookOpen, ChartNoAxesCombined, ChevronRight, Dna, FlaskConical } from 'lucide-react';
import Brand from './Brand.jsx';

const navigation = [
  { path: '/lab', label: '序列实验室', icon: FlaskConical },
  { path: '/map', label: '序列图谱', icon: ChartNoAxesCombined },
  { path: '/guide', label: '学习指南', icon: BookOpen },
];

export default function Shell({ route, onNavigate, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand-button" type="button" onClick={() => onNavigate('/')} aria-label="返回首页"><Brand /></button>
        <div className="sidebar-caption">DNA SEQUENCE STUDIO</div>
        <nav className="sidebar-nav" aria-label="主导航">
          {navigation.map(({ path, label, icon: Icon }) => (
            <button key={path} type="button" className={`nav-item ${route === path ? 'active' : ''}`} onClick={() => onNavigate(path)} aria-current={route === path ? 'page' : undefined}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{route === path ? <ChevronRight size={15} /> : null}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-mark"><Dna size={32} strokeWidth={1.2} /></div>
          <p>把碱基读成线索。</p>
          <span>面向学习与探索的序列工作台</span>
        </div>
      </aside>
      <div className="shell-main">
        <header className="topbar">
          <button className="mobile-brand brand-button" type="button" onClick={() => onNavigate('/')} aria-label="返回首页"><Brand /></button>
          <div className="breadcrumb"><span>HELIX ATLAS</span><ChevronRight size={14} /><strong>{navigation.find(item => item.path === route)?.label}</strong></div>
        </header>
        <nav className="mobile-nav" aria-label="移动端主导航">
          {navigation.map(({ path, label, icon: Icon }) => <button key={path} type="button" className={route === path ? 'active' : ''} onClick={() => onNavigate(path)}><Icon size={17} /><span>{label}</span></button>)}
        </nav>
        <main>{children}</main>
        <footer className="site-footer"><span>HELIX ATLAS · 生物医学教学项目</span><span>示例分析仅供学习，不用于临床判断</span></footer>
      </div>
    </div>
  );
}
