import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import type { Niche } from '../types';

type Props = { onClose: () => void; onSubmit: (niche: Partial<Niche>) => void };

const CATEGORIES = ['Technology', 'Health & Wellness', 'Finance', 'Education', 'Lifestyle', 'E-commerce', 'Creative', 'Business'];

export default function AddNicheModal({ onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    name: '',
    category: 'Technology',
    description: '',
    opportunity_score: 50,
    competition_score: 50,
    trend_score: 50,
    market_size_usd: 1000000000,
    audience_size: 'Medium (1M-10M)',
    monetization_methods: '',
    pros: '',
    cons: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSubmit({
      ...form,
      monetization_methods: form.monetization_methods.split(',').map(s => s.trim()).filter(Boolean),
      pros: form.pros.split(',').map(s => s.trim()).filter(Boolean),
      cons: form.cons.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
    });
    setLoading(false);
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Niche</h2>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Niche Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AI Content Creation" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the niche..." rows={3} />
          </div>
          <div className="form-row three">
            <div className="form-group">
              <label>Opportunity Score (0–100)</label>
              <input type="number" min={0} max={100} value={form.opportunity_score} onChange={e => setForm(p => ({ ...p, opportunity_score: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Competition Score (0–100)</label>
              <input type="number" min={0} max={100} value={form.competition_score} onChange={e => setForm(p => ({ ...p, competition_score: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Trend Score (0–100)</label>
              <input type="number" min={0} max={100} value={form.trend_score} onChange={e => setForm(p => ({ ...p, trend_score: +e.target.value }))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Market Size (USD)</label>
              <input type="number" value={form.market_size_usd} onChange={e => setForm(p => ({ ...p, market_size_usd: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Audience Size</label>
              <select value={form.audience_size} onChange={e => setForm(p => ({ ...p, audience_size: e.target.value }))}>
                <option>Small (&lt;100K)</option>
                <option>Medium (100K-1M)</option>
                <option>Medium (1M-10M)</option>
                <option>Large (10M+)</option>
                <option>Massive (100M+)</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Monetization Methods (comma-separated)</label>
            <input value={form.monetization_methods} onChange={e => setForm(p => ({ ...p, monetization_methods: e.target.value }))} placeholder="Affiliate Marketing, SaaS, Courses" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pros (comma-separated)</label>
              <input value={form.pros} onChange={e => setForm(p => ({ ...p, pros: e.target.value }))} placeholder="Low barrier to entry, High demand" />
            </div>
            <div className="form-group">
              <label>Cons (comma-separated)</label>
              <input value={form.cons} onChange={e => setForm(p => ({ ...p, cons: e.target.value }))} placeholder="Saturated market, High ad costs" />
            </div>
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="AI, SaaS, B2B" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Plus size={16} /> {loading ? 'Adding...' : 'Add Niche'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
