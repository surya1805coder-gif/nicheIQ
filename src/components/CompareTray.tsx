import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import type { Niche } from '../types';

interface Props {
  selectedNiches: Niche[];
  onCompare: () => void;
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function CompareTray({ selectedNiches, onCompare, onRemove, onClear }: Props) {
  if (selectedNiches.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="compare-tray"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        <div className="tray-content">
          <div className="tray-info">
            <span className="selection-count">{selectedNiches.length} / 3 selected</span>
            <button className="clear-btn" onClick={onClear}>Clear All</button>
          </div>

          <div className="tray-items">
            {selectedNiches.map(niche => (
              <div key={niche.id} className="tray-item">
                <span className="item-name">{niche.name}</span>
                <button className="remove-item" onClick={() => onRemove(niche.id)}>
                  <X size={14} />
                </button>
              </div>
            ))}
            {selectedNiches.length < 3 && (
              <div className="tray-placeholder">Add up to {3 - selectedNiches.length} more</div>
            )}
          </div>

          <button
            className="compare-now-btn"
            onClick={onCompare}
            disabled={selectedNiches.length < 2}
          >
            <span>Compare Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
