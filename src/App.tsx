import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import NicheGrid from './components/NicheGrid';
import NicheDetail from './components/NicheDetail';
import AnalyticsPanel from './components/AnalyticsPanel';
import AddNicheModal from './components/AddNicheModal';
import CompareTray from './components/CompareTray';
import NicheComparison from './components/NicheComparison';

import type { Niche } from './types';
import { Search, BarChart3, Grid3X3, Plus, TrendingUp, Zap } from 'lucide-react';


type View = 'dashboard' | 'explore' | 'analytics' | 'comparison';


export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('opportunity_desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('niche_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareIds, setCompareIds] = useState<number[]>([]);


  useEffect(() => {
    localStorage.setItem('niche_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const toggleCompare = (id: number) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(cid => cid !== id);
      if (prev.length >= 3) return prev; // Limit to 3 for side-by-side layout
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);


  const fetchNiches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      const res = await fetch(`/api/niches?${params.toString()}`);
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      setNiches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error, using sample data:', err);
      // Sample data fallback for demonstration
      const sampleNiches: Niche[] = [
        {
          id: 1,
          name: "Sustainable Pet Tech",
          category: "Technology",
          description: "Eco-friendly smart devices for modern pet owners focusing on durability and recurrent revenue models.",
          opportunity_score: 85,
          competition_score: 42,
          trend_score: 92,
          market_size_usd: 4200000000,
          audience_size: "12M+",
          monetization_methods: ["Hardware Sales", "Subscription", "App Ads"],
          pros: ["High growth", "Emotional niche", "Recurrent revenue"],
          cons: ["High R&D cost", "Supply chain complexity"],
          tags: ["Eco-friendly", "IoT", "Pets"],
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "AI-Driven Plant Care",
          category: "Lifestyle",
          description: "Using computer vision to identify plant diseases and provide personalized watering schedules.",
          opportunity_score: 78,
          competition_score: 35,
          trend_score: 88,
          market_size_usd: 1500000000,
          audience_size: "45M+",
          monetization_methods: ["SaaS", "Affiliate Marketing"],
          pros: ["Low overhead", "Visual appeal", "Scalable"],
          cons: ["Accuracy challenges", "Seasonal demand"],
          tags: ["AI", "Home Decor", "Gardening"],
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: "Micro-Investment for Gen Z",
          category: "Finance",
          description: "Simplifying complex financial instruments into bite-sized investments for younger demographics.",
          opportunity_score: 91,
          competition_score: 65,
          trend_score: 95,
          market_size_usd: 8500000000,
          audience_size: "80M+",
          monetization_methods: ["Transaction Fees", "Premium Accounts"],
          pros: ["Huge market", "Viral potential", "High LTV"],
          cons: ["Regulation", "Trust building"],
          tags: ["Fintech", "Mobile", "Gen-Z"],
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          name: "Digital Detox Wellness",
          category: "Health & Wellness",
          description: "Apps and physical retreat kits designed to help professionals disconnect and reduce screen time.",
          opportunity_score: 72,
          competition_score: 28,
          trend_score: 84,
          market_size_usd: 900000000,
          audience_size: "15M+",
          monetization_methods: ["E-commerce", "Subscriptions"],
          pros: ["Timely trend", "Mental health focus", "Strong community"],
          cons: ["Counter-intuitive (Digital detox app?)", "Hard to measure"],
          tags: ["Mindfulness", "Productivity", "Mental Health"],
          created_at: new Date().toISOString()
        }
      ];
      
      const filtered = sampleNiches.filter(n => {
        const matchesCat = category === 'all' || n.category === category;
        const matchesSearch = !search || n.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
      });
      setNiches(filtered);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { fetchNiches(); }, [category, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNiches();
  };

  const handleAddNiche = async (niche: Partial<Niche>) => {
    const res = await fetch('/api/niches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(niche),
    });
    if (res.ok) {
      setShowAddModal(false);
      fetchNiches();
    }
  };

  const handleDeleteNiche = async (id: number) => {
    const res = await fetch('/api/niches', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSelectedNiche(null);
      fetchNiches();
    }
  };

  const categories = ['all', 'Technology', 'Health & Wellness', 'Finance', 'Education', 'Lifestyle', 'E-commerce', 'Creative', 'Business'];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><Zap size={20} /></div>
          <span className="logo-text">NicheIQ</span>
        </div>
        <nav className="sidebar-nav">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
            { id: 'explore', label: 'Explore Niches', icon: <Grid3X3 size={18} /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
          ] as { id: View; label: string; icon: React.ReactNode }[]).map(item => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="add-niche-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add Niche</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {view === 'dashboard' && 'Market Overview'}
              {view === 'explore' && 'Explore Niches'}
              {view === 'analytics' && 'Deep Analytics'}
            </h1>
            <p className="page-subtitle">
              {view === 'dashboard' && 'Your niche intelligence command center'}
              {view === 'explore' && `${niches.length} niches analyzed`}
              {view === 'analytics' && 'Category breakdown & opportunity mapping'}
            </p>
          </div>
          <div className="topbar-right">
            <form onSubmit={handleSearch} className="search-form">
              <Search size={16} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search niches..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>
          </div>
        </header>

        {/* Filters (Explore view) */}
        {view === 'explore' && (
          <div className="filters-bar">
            <div className="category-pills">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="opportunity_desc">Highest Opportunity</option>
              <option value="trend_desc">Trending</option>
              <option value="competition_asc">Lowest Competition</option>
              <option value="competition_desc">Highest Competition</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div className="content-area">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Dashboard 
                  niches={niches} 
                  loading={loading} 
                  favorites={favorites}
                  onSelectNiche={(n) => { setSelectedNiche(n); setView('explore'); }} 
                />
              </motion.div>
            )}
            {view === 'explore' && (
              <motion.div key="explore" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <NicheGrid 
                  niches={niches} 
                  loading={loading} 
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                  onSelect={setSelectedNiche} 
                />
              </motion.div>
            )}
            {view === 'comparison' && (
              <motion.div key="comparison" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                <NicheComparison 
                  niches={niches.filter(n => compareIds.includes(n.id))} 
                  onClose={() => setView('explore')} 
                  onRemove={toggleCompare}
                />
              </motion.div>
            )}
            {view === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <AnalyticsPanel />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Niche Detail Panel */}
      <AnimatePresence>
        {selectedNiche && (
          <NicheDetail 
            niche={selectedNiche} 
            isFavorite={favorites.includes(selectedNiche.id)}
            onToggleFavorite={toggleFavorite}
            onClose={() => setSelectedNiche(null)} 
            onDelete={handleDeleteNiche} 
            isComparing={compareIds.includes(selectedNiche.id)}
            onToggleCompare={toggleCompare}
          />
        )}
      </AnimatePresence>

      <CompareTray 
        selectedNiches={niches.filter(n => compareIds.includes(n.id))}
        onCompare={() => setView('comparison')}
        onRemove={toggleCompare}
        onClear={clearCompare}
      />




      {/* Add Niche Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddNicheModal onClose={() => setShowAddModal(false)} onSubmit={handleAddNiche} />
        )}
      </AnimatePresence>
    </div>
  );
}
