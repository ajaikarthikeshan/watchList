import React from 'react';

export type ViewType = 'grid' | 'constellation';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid ' + (isActive ? 'var(--accent)' : 'var(--border)'),
    cursor: 'pointer',
    fontWeight: 500,
    background: isActive ? 'var(--accent)' : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ display: 'flex', gap: '8px', background: 'var(--surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <button 
        onClick={() => onViewChange('grid')}
        style={buttonStyle(currentView === 'grid')}
        aria-label="Grid View"
      >
        Grid
      </button>
      <button 
        onClick={() => onViewChange('constellation')}
        style={buttonStyle(currentView === 'constellation')}
        aria-label="Constellation View"
      >
        Constellation
      </button>
    </div>
  );
};
