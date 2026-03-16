import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, DollarSign, ArrowRight, Award, Heart } from 'lucide-react';

import type { Niche } from '../App';

type Props = { niches: Niche[]; loading: boolean; favorites: number[]; onSelectNiche: (n: Niche) => void };


export default function Dashboard({ niches, loading, favorites, onSelectNiche }: Props) {

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;

  const topOpportunity = [...niches].sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 3);
  const topTrending = [...niches].sort((a, b) => b.trend_score - a.trend_score).slice(0, 3);
  const lowestComp = [...niches].sort((a, b) => a.competition_score - b.competition_score).slice(0, 3);
  const avgOpp = niches.length ? Math.round(niches.reduce((s, n) => s + n.opportunity_score, 0) / niches.length) : 0;
  const avgComp = niches.length ? Math.round(niches.reduce((s, n) => s + n.competition_score, 0) / niches.length) : 0;
  // const avgTrend = niches.length ? Math.round(niches.reduce((s, n) => s + n.trend_score, 0) / niches.length) : 0;
  const totalMarket = niches.reduce((s, n) => s + (n.market_size_usd || 0), 0);

  const stats = [
    { label: 'Niches Tracked', value: niches.length, icon: <Target size={20} />, color: 'stat-blue' },
    { label: 'Avg Opportunity', value: `${avgOpp}/100`, icon: <Zap size={20} />, color: 'stat-green' },
    { label: 'Avg Competition', value: `${avgComp}/100`, icon: <TrendingUp size={20} />, color: 'stat-orange' },
    { label: 'Total Market', value: `$${(totalMarket / 1e9).toFixed(1)}B`, icon: <DollarSign size={20} />, color: 'stat-purple' },
  ];

  return (
    <div className="dashboard">
      {/* Stats Row */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div key={s.label} className={`stat-card ${s.color}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lists */}
      <div className="dashboard-lists">
        <NicheList title="Top Opportunities" icon={<Zap size={16} />} niches={topOpportunity} scoreKey="opportunity_score" scoreLabel="Opp" color="#22d3ee" favorites={favorites} onSelect={onSelectNiche} />
        <NicheList title="Trending Now" icon={<TrendingUp size={16} />} niches={topTrending} scoreKey="trend_score" scoreLabel="Trend" color="#a78bfa" favorites={favorites} onSelect={onSelectNiche} />
        <NicheList title="Low Competition" icon={<Award size={16} />} niches={lowestComp} scoreKey="competition_score" scoreLabel="Comp" color="#34d399" favorites={favorites} onSelect={onSelectNiche} />
      </div>


      {/* Market Bar */}
      <motion.div className="market-bar-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="section-title">Category Market Share</h3>
        <CategoryBars niches={niches} />
      </motion.div>
    </div>
  );
}

function NicheList({ title, icon, niches, scoreKey, scoreLabel, color, favorites, onSelect }: any) {

  return (
    <motion.div className="niche-list-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="list-header">
        <span className="list-icon" style={{ color }}>{icon}</span>
        <h3>{title}</h3>
      </div>
      {niches.map((n: Niche, i: number) => (
          <div key={n.id} className="list-niche-row" onClick={() => onSelect(n)}>
            <span className="rank">#{i + 1}</span>
            <div className="list-niche-info">
              <span className="list-niche-name">{n.name}</span>
              <span className="list-niche-cat">{n.category}</span>
            </div>
            <div className="list-score-area">
              {favorites.includes(n.id) && <Heart size={12} className="fav-indicator" fill="currentColor" />}
              <div className="list-score" style={{ color }}>
                <span>{(n as any)[scoreKey]}</span>
                <span className="score-label">{scoreLabel}</span>
              </div>
            </div>
            <ArrowRight size={14} className="row-arrow" />
          </div>

      ))}
    </motion.div>
  );
}

function CategoryBars({ niches }: { niches: Niche[] }) {
  const cats: Record<string, number> = {};
  niches.forEach(n => { cats[n.category] = (cats[n.category] || 0) + n.market_size_usd; });
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;
  const colors = ['#22d3ee', '#a78bfa', '#34d399', '#f59e0b', '#f87171', '#60a5fa', '#fb923c', '#e879f9'];
  return (
    <div className="category-bars">
      {entries.map(([cat, val], i) => (
        <div key={cat} className="cat-bar-row">
          <span className="cat-bar-label">{cat}</span>
          <div className="cat-bar-track">
            <motion.div
              className="cat-bar-fill"
              style={{ background: colors[i % colors.length] }}
              initial={{ width: 0 }}
              animate={{ width: `${(val / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          </div>
          <span className="cat-bar-val">${(val / 1e9).toFixed(1)}B</span>
        </div>
      ))}
    </div>
  );
}
