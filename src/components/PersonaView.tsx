import React from 'react';
import { PortfolioGrid, PortfolioItem } from './PortfolioGrid';
import './PersonaView.css';

export interface PersonaData {
    name: string;
    title: string;
    summary: string;
    experience: {
        role: string;
        company: string;
        period: string;
    }[];
    portfolioItems?: PortfolioItem[];
    profileImage?: string;

    // New Extended Fields
    education?: {
        degree: string;
        institution: string;
        year: string;
    }[];
    certifications?: {
        name: string;
        issuer: string;
        year: string;
    }[];
    volunteering?: {
        role: string;
        organization: string;
        period: string;
    }[];
    awards?: {
        title: string;
        issuer: string;
        year: string;
    }[];
    hobbies?: string[];
}

interface PersonaViewProps {
    data: PersonaData;
    onEdit?: () => void;
}

export const PersonaView: React.FC<PersonaViewProps> = ({ data, onEdit }) => {
    // Dummy portfolio data if none provided
    const portfolioItems: PortfolioItem[] = data.portfolioItems || [
        {
            id: "1",
            title: "E-Commerce Redesign",
            category: "UX/UI Design",
            thumbnailUrl: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=600",
            linkUrl: "#"
        },
        {
            id: "2",
            title: "Finance Dashboard",
            category: "Product Design",
            thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
            linkUrl: "#"
        },
        {
            id: "3",
            title: "Travel App Concept",
            category: "Mobile App",
            thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600",
            linkUrl: "#"
        }
    ];

    return (
        <div className="persona-container">
            <header className="persona-header">
                <div className="header-content">
                    {data.profileImage ? (
                        <img
                            src={data.profileImage}
                            alt={data.name}
                            className="profile-image-extracted"
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid rgba(255,255,255,0.1)',
                                marginBottom: '1rem'
                            }}
                        />
                    ) : (
                        <div className="profile-image-placeholder">
                            {data.name.charAt(0)}
                        </div>
                    )}

                    <div className="profile-info">
                        <h1>{data.name}</h1>
                        <p className="role">{data.title}</p>
                        <p className="summary">{data.summary}</p>
                    </div>
                </div>
                {onEdit && (
                    <button className="edit-profile-btn" onClick={onEdit}>
                        Edit Profile
                    </button>
                )}
            </header>

            <section className="experience-section">
                <h2>Experience</h2>
                <div className="timeline">
                    {data.experience.map((exp, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h3>{exp.role}</h3>
                                <span className="company">{exp.company}</span>
                                <span className="period">{exp.period}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {data.education && data.education.length > 0 && (
                <section className="experience-section">
                    <h2>Education</h2>
                    <div className="timeline">
                        {data.education.map((edu, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-dot dot-edu"></div>
                                <div className="timeline-content">
                                    <h3>{edu.degree}</h3>
                                    <span className="company">{edu.institution}</span>
                                    <span className="period">{edu.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.certifications && data.certifications.length > 0 && (
                <section className="meta-section">
                    <h2>Certifications</h2>
                    <div className="meta-grid">
                        {data.certifications.map((cert, idx) => (
                            <div key={idx} className="meta-card">
                                <h4>{cert.name}</h4>
                                <p>{cert.issuer}</p>
                                <span>{cert.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.awards && data.awards.length > 0 && (
                <section className="meta-section">
                    <h2>Awards & Achievements</h2>
                    <div className="meta-grid">
                        {data.awards.map((award, idx) => (
                            <div key={idx} className="meta-card">
                                <h4>{award.title}</h4>
                                <p>{award.issuer}</p>
                                <span>{award.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.volunteering && data.volunteering.length > 0 && (
                <section className="meta-section">
                    <h2>Volunteering</h2>
                    <div className="meta-grid">
                        {data.volunteering.map((vol, idx) => (
                            <div key={idx} className="meta-card">
                                <h4>{vol.role}</h4>
                                <p>{vol.organization}</p>
                                <span>{vol.period}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.hobbies && data.hobbies.length > 0 && (
                <section className="meta-section">
                    <h2>Hobbies & Interests</h2>
                    <div className="tags-container">
                        {data.hobbies.map((hobby, idx) => (
                            <span key={idx} className="hobby-tag">{hobby}</span>
                        ))}
                    </div>
                </section>
            )}

            <PortfolioGrid
                items={portfolioItems}
                onAddClick={onEdit}
            />

            <footer className="persona-footer">
                <p>Powered by Rusme</p>
            </footer>
        </div>
    );
};
