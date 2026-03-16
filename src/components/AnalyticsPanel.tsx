import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap, Target } from 'lucide-react';

type Summary = {
  category: string;
  count: number;
  avgOpportunity: number;
  avgCompetition: number;
  avgTrend: number;
  totalMarket: number;
};

export default function AnalyticsPanel() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [_total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'avgOpportunity' | 'avgCompetition' | 'avgTrend' | 'totalMarket'>('avgOpportunity');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/analyze');
        const data = await res.json();
        setSummary(data.summary || []);
        setTotal(data.total || 0);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;

  const metrics = [
    { key: 'avgOpportunity' as const, label: 'Avg Opportunity', icon: <Zap size={14} />, color: '#22d3ee' },
    { key: 'avgCompetition' as const, label: 'Avg Competition', icon: <Target size={14} />, color: '#f59e0b' },
    { key: 'avgTrend' as const, label: 'Avg Trend', icon: <TrendingUp size={14} />, color: '#a78bfa' },
    { key: 'totalMarket' as const, label: 'Market Size', icon: <BarChart3 size={14} />, color: '#34d399' },
  ];

  const sorted = [...summary].sort((a, b) => {
    if (activeMetric === 'totalMarket') return b.totalMarket - a.totalMarket;
    return b[activeMetric] - a[activeMetric];
  });

  const activeColor = metrics.find(m => m.key === activeMetric)?.color || '#22d3ee';
  const maxVal = sorted[0] ? (activeMetric === 'totalMarket' ? sorted[0].totalMarket : sorted[0][activeMetric]) : 1;

  return (
    <div className="analytics-panel">
      {/* Metric Selector */}
      <div className="metric-selector">
        {metrics.map(m => (
          <button
            key={m.key}
            className={`metric-btn ${activeMetric === m.key ? 'active' : ''}`}
            style={activeMetric === m.key ? { borderColor: m.color, color: m.color, background: `${m.color}18` } : {}}
            onClick={() => setActiveMetric(m.key)}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="analytics-chart">
        <h3 className="section-title">Category Comparison — {metrics.find(m => m.key === activeMetric)?.label}</h3>
        <div className="horiz-bars">
          {sorted.map((cat, i) => {
            const raw = activeMetric === 'totalMarket' ? cat.totalMarket : cat[activeMetric];
            const pct = (raw / maxVal) * 100;
            const displayVal = activeMetric === 'totalMarket' ? `$${(raw / 1e9).toFixed(1)}B` : `${raw}/100`;
            return (
              <motion.div key={cat.category} className="horiz-bar-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="horiz-bar-label">{cat.category}</div>
                <div className="horiz-bar-track">
                  <motion.div
                    className="horiz-bar-fill"
                    style={{ background: activeColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.06 }}
                  />
                </div>
                <div className="horiz-bar-val" style={{ color: activeColor }}>{displayVal}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Category Cards */}
      <div className="analytics-cards">
        {sorted.map((cat, i) => (
          <motion.div key={cat.category} className="analytics-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="analytics-card-header">
              <h4>{cat.category}</h4>
              <span className="analytics-card-count">{cat.count} niches</span>
            </div>
            <div className="analytics-mini-scores">
              <div className="mini-score" style={{ color: '#22d3ee' }}>
                <Zap size={12} /> <span>{cat.avgOpportunity}</span>
              </div>
              <div className="mini-score" style={{ color: '#f59e0b' }}>
                <Target size={12} /> <span>{cat.avgCompetition}</span>
              </div>
              <div className="mini-score" style={{ color: '#a78bfa' }}>
                <TrendingUp size={12} /> <span>{cat.avgTrend}</span>
              </div>
            </div>
            <div className="analytics-market">${(cat.totalMarket / 1e9).toFixed(1)}B total market</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
