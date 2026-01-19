import React, { useState } from 'react';
import { PersonaData } from './PersonaView';
import './PersonaEditor.css';

interface PersonaEditorProps {
    initialData: PersonaData;
    onSave: (data: PersonaData) => void;
    onCancel: () => void;
}

export const PersonaEditor: React.FC<PersonaEditorProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<PersonaData>(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Generic updater for array of objects
    const updateArrayItem = (section: keyof PersonaData, index: number, field: string, value: string) => {
        const list = [...(formData[section] as any[] || [])];
        list[index] = { ...list[index], [field]: value };
        setFormData({ ...formData, [section]: list });
    };

    // Generic add item
    const addItem = (section: keyof PersonaData, emptyItem: any) => {
        const list = [...(formData[section] as any[] || [])];
        list.push(emptyItem);
        setFormData({ ...formData, [section]: list });
    };

    // Generic remove item
    const removeItem = (section: keyof PersonaData, index: number) => {
        const list = [...(formData[section] as any[] || [])];
        list.splice(index, 1);
        setFormData({ ...formData, [section]: list });
    };

    // Hobbies specific updater (array of strings)
    const updateHobby = (index: number, value: string) => {
        const list = [...(formData.hobbies || [])];
        list[index] = value;
        setFormData({ ...formData, hobbies: list });
    };

    return (
        <div className="editor-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="editor-form">
                {/* Basic Info */}
                <section className="editor-section">
                    <h3>Basic Info</h3>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Summary</label>
                        <textarea
                            rows={4}
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        />
                    </div>
                </section>

                {/* Experience */}
                <section className="editor-section">
                    <h3>Experience</h3>
                    {(formData.experience || []).map((exp, idx) => (
                        <div key={idx} className="array-item">
                            <input placeholder="Role" value={exp.role} onChange={(e) => updateArrayItem('experience', idx, 'role', e.target.value)} />
                            <input placeholder="Company" value={exp.company} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} />
                            <input placeholder="Period" value={exp.period} onChange={(e) => updateArrayItem('experience', idx, 'period', e.target.value)} />
                            <button type="button" className="btn-remove" onClick={() => removeItem('experience', idx)}>🗑️</button>
                        </div>
                    ))}
                    <button type="button" className="btn-add" onClick={() => addItem('experience', { role: '', company: '', period: '' })}>+ Add Experience</button>
                </section>

                {/* Education */}
                <section className="editor-section">
                    <h3>Education</h3>
                    {(formData.education || []).map((edu, idx) => (
                        <div key={idx} className="array-item">
                            <input placeholder="Degree" value={edu.degree} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} />
                            <input placeholder="Institution" value={edu.institution} onChange={(e) => updateArrayItem('education', idx, 'institution', e.target.value)} />
                            <input placeholder="Year" value={edu.year} onChange={(e) => updateArrayItem('education', idx, 'year', e.target.value)} />
                            <button type="button" className="btn-remove" onClick={() => removeItem('education', idx)}>🗑️</button>
                        </div>
                    ))}
                    <button type="button" className="btn-add" onClick={() => addItem('education', { degree: '', institution: '', year: '' })}>+ Add Education</button>
                </section>

                {/* Certifications */}
                <section className="editor-section">
                    <h3>Certifications</h3>
                    {(formData.certifications || []).map((cert, idx) => (
                        <div key={idx} className="array-item">
                            <input placeholder="Name" value={cert.name} onChange={(e) => updateArrayItem('certifications', idx, 'name', e.target.value)} />
                            <input placeholder="Issuer" value={cert.issuer} onChange={(e) => updateArrayItem('certifications', idx, 'issuer', e.target.value)} />
                            <input placeholder="Year" value={cert.year} onChange={(e) => updateArrayItem('certifications', idx, 'year', e.target.value)} />
                            <button type="button" className="btn-remove" onClick={() => removeItem('certifications', idx)}>🗑️</button>
                        </div>
                    ))}
                    <button type="button" className="btn-add" onClick={() => addItem('certifications', { name: '', issuer: '', year: '' })}>+ Add Certification</button>
                </section>

                {/* Awards */}
                <section className="editor-section">
                    <h3>Awards</h3>
                    {(formData.awards || []).map((award, idx) => (
                        <div key={idx} className="array-item">
                            <input placeholder="Title" value={award.title} onChange={(e) => updateArrayItem('awards', idx, 'title', e.target.value)} />
                            <input placeholder="Issuer" value={award.issuer} onChange={(e) => updateArrayItem('awards', idx, 'issuer', e.target.value)} />
                            <input placeholder="Year" value={award.year} onChange={(e) => updateArrayItem('awards', idx, 'year', e.target.value)} />
                            <button type="button" className="btn-remove" onClick={() => removeItem('awards', idx)}>🗑️</button>
                        </div>
                    ))}
                    <button type="button" className="btn-add" onClick={() => addItem('awards', { title: '', issuer: '', year: '' })}>+ Add Award</button>
                </section>

                {/* Volunteering */}
                <section className="editor-section">
                    <h3>Volunteering</h3>
                    {(formData.volunteering || []).map((vol, idx) => (
                        <div key={idx} className="array-item">
                            <input placeholder="Role" value={vol.role} onChange={(e) => updateArrayItem('volunteering', idx, 'role', e.target.value)} />
                            <input placeholder="Organization" value={vol.organization} onChange={(e) => updateArrayItem('volunteering', idx, 'organization', e.target.value)} />
                            <input placeholder="Period" value={vol.period} onChange={(e) => updateArrayItem('volunteering', idx, 'period', e.target.value)} />
                            <button type="button" className="btn-remove" onClick={() => removeItem('volunteering', idx)}>🗑️</button>
                        </div>
                    ))}
                    <button type="button" className="btn-add" onClick={() => addItem('volunteering', { role: '', organization: '', period: '' })}>+ Add Volunteer Work</button>
                </section>

                {/* Portfolio Projects */}
                <section className="editor-section">
                    <h3>Portfolio Projects</h3>
                    {(formData.portfolioItems || []).map((item, idx) => (
                        <div key={idx} className="array-item-portfolio">
                            <input
                                placeholder="Project Title"
                                value={item.title}
                                onChange={(e) => updateArrayItem('portfolioItems', idx, 'title', e.target.value)}
                                style={{ gridColumn: 'span 2' }}
                            />

                            <select
                                value={item.category || ''}
                                onChange={(e) => updateArrayItem('portfolioItems', idx, 'category', e.target.value)}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    color: 'white',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="Web App">Web App</option>
                                <option value="Mobile App">Mobile App</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="Open Source">Open Source</option>
                                <option value="Case Study">Case Study</option>
                                <option value="E-Commerce">E-Commerce</option>
                                <option value="Game Dev">Game Dev</option>
                                <option value="Other">Other</option>
                            </select>

                            <input
                                placeholder="Project Link (URL)"
                                value={item.linkUrl}
                                onChange={(e) => updateArrayItem('portfolioItems', idx, 'linkUrl', e.target.value)}
                            />

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Project Thumbnail</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {item.thumbnailUrl && (
                                        <img
                                            src={item.thumbnailUrl}
                                            alt="Preview"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (readerEvent) => {
                                                    const img = new Image();
                                                    img.onload = () => {
                                                        const canvas = document.createElement('canvas');
                                                        let width = img.width;
                                                        let height = img.height;

                                                        const MAX_WIDTH = 800;
                                                        const MAX_HEIGHT = 800;

                                                        if (width > height) {
                                                            if (width > MAX_WIDTH) {
                                                                height *= MAX_WIDTH / width;
                                                                width = MAX_WIDTH;
                                                            }
                                                        } else {
                                                            if (height > MAX_HEIGHT) {
                                                                width *= MAX_HEIGHT / height;
                                                                height = MAX_HEIGHT;
                                                            }
                                                        }

                                                        canvas.width = width;
                                                        canvas.height = height;
                                                        const ctx = canvas.getContext('2d');
                                                        ctx?.drawImage(img, 0, 0, width, height);

                                                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                                                        updateArrayItem('portfolioItems', idx, 'thumbnailUrl', dataUrl);
                                                    };
                                                    img.src = readerEvent.target?.result as string;
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>

                            <button type="button" className="btn-remove" onClick={() => removeItem('portfolioItems', idx)} style={{ gridColumn: 'span 3', justifySelf: 'end' }}>
                                🗑️ Remove Project
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn-add" onClick={() => addItem('portfolioItems', { id: Date.now().toString(), title: '', category: '', linkUrl: '', thumbnailUrl: '' })}>
                        + Add Portfolio Project
                    </button>
                </section>

                {/* Hobbies */}
                <section className="editor-section">
                    <h3>Hobbies</h3>
                    <div className="hobbies-grid">
                        {(formData.hobbies || []).map((hobby, idx) => (
                            <div key={idx} className="hobby-edit-item">
                                <input placeholder="Hobby" value={hobby} onChange={(e) => updateHobby(idx, e.target.value)} />
                                <button type="button" className="btn-remove-small" onClick={() => removeItem('hobbies', idx)}>×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn-add" onClick={() => addItem('hobbies', '')}>+ Add Hobby</button>
                </section>

                <div className="form-actions sticky-actions">
                    <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
                    <button type="submit" className="btn-save">Save All Changes</button>
                </div>
            </form>
        </div>
    );
};
