import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { X, TrendingUp, Zap, Target, DollarSign, Users, CheckCircle, XCircle, Key, Trash2, Heart, Copy } from 'lucide-react';


import type { Niche } from '../types';

type Keyword = { id: number; niche_id: number; keyword: string; monthly_searches: number; cpc_usd: number; difficulty: number };

type Props = {
  niche: Niche;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
  isComparing: boolean;
  onToggleCompare: (id: number) => void;
};



export default function NicheDetail({ niche, isFavorite, onToggleFavorite, onClose, onDelete, isComparing, onToggleCompare }: Props) {


  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loadingKw, setLoadingKw] = useState(true);

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoadingKw(true);
      try {
        const res = await fetch(`/api/keywords?niche_id=${niche.id}`);
        const data = await res.json();
        setKeywords(data);
      } catch (err) { console.error(err); }
      finally { setLoadingKw(false); }
    };
    fetchKeywords();
  }, [niche.id]);

  const scores = [
    { label: 'Opportunity', value: niche.opportunity_score, color: '#22d3ee', icon: <Zap size={14} /> },
    { label: 'Competition', value: niche.competition_score, color: '#f59e0b', icon: <Target size={14} /> },
    { label: 'Trend Score', value: niche.trend_score, color: '#a78bfa', icon: <TrendingUp size={14} /> },
  ];

  return (
    <motion.div
      className="detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="detail-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="detail-header">
          <div>
            <span className="detail-category">{niche.category}</span>
            <h2 className="detail-title">{niche.name}</h2>
          </div>
          <div className="detail-actions">
            <button
              className={`fav-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(niche.id)}
              style={{ fontSize: '1.2rem' }}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              className={`icon-btn ${isComparing ? 'active' : ''}`}
              onClick={() => onToggleCompare(niche.id)}
              title="Compare Niche"
            >
              <Copy size={16} />
            </button>
            <button className="icon-btn danger" onClick={() => { if (window.confirm('Delete this niche?')) onDelete(niche.id); }}>


              <Trash2 size={16} />
            </button>
            <button className="icon-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>


        <div className="detail-body">
          <p className="detail-desc">{niche.description}</p>

          {/* Scores */}
          <div className="detail-scores">
            {scores.map(s => (
              <div key={s.label} className="detail-score-item">
                <div className="detail-score-label">{s.icon} {s.label}</div>
                <div className="detail-score-bar-track">
                  <motion.div
                    className="detail-score-bar-fill"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className="detail-score-num" style={{ color: s.color }}>{s.value}/100</span>
              </div>
            ))}
          </div>

          {/* Market Info */}
          <div className="detail-meta-grid">
            <div className="detail-meta-item">
              <DollarSign size={16} className="meta-icon" />
              <div>
                <div className="meta-label">Market Size</div>
                <div className="meta-value">${(niche.market_size_usd / 1e9).toFixed(2)}B</div>
              </div>
            </div>
            <div className="detail-meta-item">
              <Users size={16} className="meta-icon" />
              <div>
                <div className="meta-label">Audience Size</div>
                <div className="meta-value">{niche.audience_size}</div>
              </div>
            </div>
          </div>

          {/* Monetization */}
          {niche.monetization_methods?.length > 0 && (
            <div className="detail-section">
              <h4 className="detail-section-title">Monetization Methods</h4>
              <div className="method-chips">
                {niche.monetization_methods.map(m => (
                  <span key={m} className="method-chip">{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Pros / Cons */}
          <div className="pros-cons-grid">
            <div className="pros-col">
              <h4 className="detail-section-title" style={{ color: '#34d399' }}>Pros</h4>
              {(niche.pros || []).map((p, i) => (
                <div key={i} className="pro-con-item">
                  <CheckCircle size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="cons-col">
              <h4 className="detail-section-title" style={{ color: '#f87171' }}>Cons</h4>
              {(niche.cons || []).map((c, i) => (
                <div key={i} className="pro-con-item">
                  <XCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="detail-section">
            <h4 className="detail-section-title"><Key size={14} /> Top Keywords</h4>
            {loadingKw ? (
              <div className="loading-state small"><div className="spinner" /></div>
            ) : keywords.length === 0 ? (
              <p className="empty-text">No keywords found.</p>
            ) : (
              <div className="keywords-table">
                <div className="kw-header">
                  <span>Keyword</span>
                  <span>Searches/mo</span>
                  <span>CPC</span>
                  <span>Difficulty</span>
                </div>
                {keywords.slice(0, 8).map((kw: Keyword) => (

                  <div key={kw.id} className="kw-row">
                    <span className="kw-name">{kw.keyword}</span>
                    <span className="kw-searches">{kw.monthly_searches.toLocaleString()}</span>
                    <span className="kw-cpc">${kw.cpc_usd.toFixed(2)}</span>
                    <div className="kw-diff">
                      <div className="kw-diff-bar" style={{ width: `${kw.difficulty}%`, background: kw.difficulty > 70 ? '#f87171' : kw.difficulty > 40 ? '#f59e0b' : '#34d399' }} />
                      <span>{kw.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
