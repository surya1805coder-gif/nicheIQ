import { motion } from 'framer-motion';
import { TrendingUp, Zap, Target, DollarSign, Tag } from 'lucide-react';
import type { Niche } from '../App';

type Props = { niches: Niche[]; loading: boolean; onSelect: (n: Niche) => void };

export default function NicheGrid({ niches, loading, onSelect }: Props) {
  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (!niches.length) return <div className="empty-state"><p>No niches found. Try adjusting your filters.</p></div>;

  return (
    <div className="niche-grid">
      {niches.map((niche, i) => (
        <NicheCard key={niche.id} niche={niche} index={i} onSelect={onSelect} />
      ))}
    </div>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="score-bar-track">
      <motion.div
        className="score-bar-fill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7 }}
      />
    </div>
  );
}

function NicheCard({ niche, index, onSelect }: { niche: Niche; index: number; onSelect: (n: Niche) => void }) {
  const opportunityGrade = niche.opportunity_score >= 80 ? 'A+' : niche.opportunity_score >= 65 ? 'A' : niche.opportunity_score >= 50 ? 'B' : 'C';
  const gradeColor = niche.opportunity_score >= 80 ? '#22d3ee' : niche.opportunity_score >= 65 ? '#34d399' : niche.opportunity_score >= 50 ? '#f59e0b' : '#f87171';

  return (
    <motion.div
      className="niche-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={() => onSelect(niche)}
      whileHover={{ y: -4 }}
    >
      <div className="card-header">
        <div className="card-category">{niche.category}</div>
        <div className="card-grade" style={{ color: gradeColor, borderColor: gradeColor }}>{opportunityGrade}</div>
      </div>
      <h3 className="card-title">{niche.name}</h3>
      <p className="card-desc">{niche.description?.slice(0, 90)}...</p>

      <div className="card-scores">
        <div className="score-row">
          <div className="score-meta">
            <Zap size={12} style={{ color: '#22d3ee' }} />
            <span>Opportunity</span>
          </div>
          <ScoreBar value={niche.opportunity_score} color="#22d3ee" />
          <span className="score-num">{niche.opportunity_score}</span>
        </div>
        <div className="score-row">
          <div className="score-meta">
            <Target size={12} style={{ color: '#f59e0b' }} />
            <span>Competition</span>
          </div>
          <ScoreBar value={niche.competition_score} color="#f59e0b" />
          <span className="score-num">{niche.competition_score}</span>
        </div>
        <div className="score-row">
          <div className="score-meta">
            <TrendingUp size={12} style={{ color: '#a78bfa' }} />
            <span>Trend</span>
          </div>
          <ScoreBar value={niche.trend_score} color="#a78bfa" />
          <span className="score-num">{niche.trend_score}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="card-market">
          <DollarSign size={12} />
          <span>${(niche.market_size_usd / 1e9).toFixed(1)}B market</span>
        </div>
        <div className="card-tags">
          {(niche.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className="tag"><Tag size={10} />{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
