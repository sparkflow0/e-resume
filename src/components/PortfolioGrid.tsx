import React from 'react';
import './PortfolioGrid.css';

export interface PortfolioItem {
    id: string;
    title: string;
    thumbnailUrl: string;
    linkUrl: string;
    category?: string;
}

interface PortfolioGridProps {
    items: PortfolioItem[];
    onAddClick?: () => void;
    readOnly?: boolean;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ items, onAddClick, readOnly = false }) => {
    return (
        <div className="portfolio-section">
            <div className="portfolio-header">
                <h2>Portfolio Showcase</h2>
                {!readOnly && (
                    <button className="add-btn" onClick={onAddClick}>
                        + Add Project
                    </button>
                )}
            </div>

            <div className="grid-container">
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid-card"
                    >
                        <div className="card-image" style={{ backgroundImage: `url(${item.thumbnailUrl})` }}>
                            <div className="overlay">
                                <span className="view-link">View Project ↗</span>
                            </div>
                        </div>
                        <div className="card-info">
                            <h3>{item.title}</h3>
                            {item.category && <span className="category-tag">{item.category}</span>}
                        </div>
                    </a>
                ))}

                {items.length === 0 && (
                    <div className="empty-state">
                        <p>No portfolio items yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
