import React from 'react';
import { motion } from 'framer-motion';

import { TrendingUp, Zap, Target, DollarSign, Tag, Heart, Copy } from 'lucide-react';


import type { Niche } from '../types';

type Props = { 
  niches: Niche[]; 
  loading: boolean; 
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  compareIds: number[];
  onToggleCompare: (id: number) => void;
  onSelect: (n: Niche) => void 
};

export default function NicheGrid({ niches, loading, favorites, onToggleFavorite, compareIds, onToggleCompare, onSelect }: Props) {

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (!niches.length) return <div className="empty-state"><p>No niches found. Try adjusting your filters.</p></div>;

  return (
    <div className="niche-grid">
      {niches.map((niche, i) => (
        <NicheCard 
          key={niche.id} 
          niche={niche} 
          index={i} 
          isFavorite={favorites.includes(niche.id)}
          onToggleFavorite={onToggleFavorite}
          isComparing={compareIds.includes(niche.id)}
          onToggleCompare={onToggleCompare}
          onSelect={onSelect} 
        />

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

interface NicheCardProps {
  key?: any;
  niche: Niche;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  isComparing: boolean;
  onToggleCompare: (id: number) => void;
  onSelect: (n: Niche) => void;
}

function NicheCard({ 
  niche, 
  index, 
  isFavorite, 
  onToggleFavorite, 
  isComparing,
  onToggleCompare,
  onSelect 
}: NicheCardProps) {




  const opportunityGrade = niche.opportunity_score >= 80 ? 'A+' : niche.opportunity_score >= 65 ? 'A' : niche.opportunity_score >= 50 ? 'B' : 'C';
  const gradeColor = niche.opportunity_score >= 80 ? 'var(--accent)' : niche.opportunity_score >= 65 ? 'var(--accent3)' : niche.opportunity_score >= 50 ? '#f59e0b' : 'var(--danger)';

  return (
    <motion.div
      className={`niche-card ${isFavorite ? 'is-fav' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={() => onSelect(niche)}
    >
      <div className="card-header">
        <div className="card-category">{niche.category}</div>
        <div className="card-actions">
          <button 
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleFavorite(niche.id); }}

          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            className={`compare-btn ${isComparing ? 'active' : ''}`}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleCompare(niche.id); }}
            title="Compare Niche"
          >
            <Copy size={16} />
          </button>
          <div className="card-grade" style={{ color: gradeColor, borderColor: gradeColor }}>{opportunityGrade}</div>

        </div>
      </div>
      <h3 className="card-title">{niche.name}</h3>
      <p className="card-desc">{niche.description?.slice(0, 90)}...</p>

      <div className="card-scores">
        <div className="score-row">
          <div className="score-meta">
            <Zap size={12} style={{ color: 'var(--accent)' }} />
            <span>Opportunity</span>
          </div>
          <ScoreBar value={niche.opportunity_score} color="var(--accent)" />
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
            <TrendingUp size={12} style={{ color: 'var(--accent2)' }} />
            <span>Trend</span>
          </div>
          <ScoreBar value={niche.trend_score} color="var(--accent2)" />
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

