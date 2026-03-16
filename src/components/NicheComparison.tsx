import { motion } from 'framer-motion';
import { X, Zap, Target, TrendingUp, DollarSign, Award, CheckCircle, XCircle } from 'lucide-react';
import type { Niche } from '../types';

interface Props {
  niches: Niche[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

export default function NicheComparison({ niches, onClose, onRemove }: Props) {
  const getBadge = (niche: Niche) => {
    if (niche.opportunity_score >= 85) return { text: 'High Opportunity', color: 'var(--accent)' };
    if (niche.trend_score >= 90) return { text: 'Viral Trend', color: 'var(--accent2)' };
    if (niche.competition_score <= 35) return { text: 'Low Competition', color: 'var(--success)' };
    return null;
  };

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <div className="header-left">
          <h2 className="view-title">Niche Comparison</h2>
          <p className="view-subtitle">Side-by-side diagnostic analysis of your selected niches</p>
        </div>
        <button className="close-view-btn" onClick={onClose}>
          <X size={20} />
          <span>Exit Comparison</span>
        </button>
      </div>

      <div className="comparison-grid">
        {niches.map(niche => (
          <motion.div 
            key={niche.id} 
            className="comparison-column"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="column-header">
              <div className="niche-brand">
                <span className="niche-cat">{niche.category}</span>
                <h3 className="niche-name">{niche.name}</h3>
                {getBadge(niche) && (
                  <div className="ai-badge" style={{ backgroundColor: getBadge(niche)!.color }}>
                    <Award size={10} />
                    <span>{getBadge(niche)!.text}</span>
                  </div>
                )}
              </div>
              <button className="remove-col" onClick={() => onRemove(niche.id)}>Remove</button>
            </div>

            <div className="comparison-metrics">
              <MetricRow label="Opportunity" value={niche.opportunity_score} icon={<Zap size={14} />} color="var(--accent)" />
              <MetricRow label="Competition" value={niche.competition_score} icon={<Target size={14} />} color="var(--accent3)" />
              <MetricRow label="Trend Score" value={niche.trend_score} icon={<TrendingUp size={14} />} color="var(--accent2)" />
              
              <div className="market-metric">
                <DollarSign size={16} />
                <div className="m-info">
                  <div className="m-label">Market Size</div>
                  <div className="m-val">${(niche.market_size_usd / 1e9).toFixed(1)}B</div>
                </div>
              </div>
            </div>

            <div className="comparison-details">
              <div className="detail-group">
                <h4>Monetization</h4>
                <div className="m-list">
                  {niche.monetization_methods.map(m => <span key={m}>{m}</span>)}
                </div>
              </div>

              <div className="detail-group split">
                <div className="p-c">
                  <h4 className="green">Pros</h4>
                  {niche.pros.slice(0, 3).map((p, i) => (
                    <div key={i} className="li"><CheckCircle size={12} />{p}</div>
                  ))}
                </div>
                <div className="p-c">
                  <h4 className="red">Cons</h4>
                  {niche.cons.slice(0, 3).map((c, i) => (
                    <div key={i} className="li"><XCircle size={12} />{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {niches.length < 3 && (
          <div className="comparison-placeholder">
            <div className="p-icon"><Zap size={32} /></div>
            <p>Add more niches to complete your comparison</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricRow({ label, value, icon, color }: any) {
  return (
    <div className="metric-row">
      <div className="m-meta">
        {icon}
        <span>{label}</span>
      </div>
      <div className="m-bar-container">
        <div className="m-bar-track">
          <motion.div 
            className="m-bar-fill" 
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
          />
        </div>
        <span className="m-val">{value}</span>
      </div>
    </div>
  );
}
