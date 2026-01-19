import { useState, useEffect } from 'react';

const MODELS = [
    { value: 'gpt-4o', label: 'GPT-4o (Recommended)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];

export const ApiKeyInput = () => {
    const [key, setKey] = useState('');
    const [model, setModel] = useState('gpt-4o');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) setKey(storedKey);

        const storedModel = localStorage.getItem('openai_model');
        if (storedModel) setModel(storedModel);
    }, []);

    const handleSaveKey = (val: string) => {
        const cleaned = val.trim();
        setKey(cleaned);
        localStorage.setItem('openai_api_key', cleaned);
    };

    const handleSaveModel = (val: string) => {
        setModel(val);
        localStorage.setItem('openai_model', val);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            zIndex: 1000,
            background: 'var(--color-surface)',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                    onClick={() => setIsVisible(!isVisible)}
                    style={{ cursor: 'pointer', opacity: 0.7, fontSize: '1.2rem' }}
                    title="Click to toggle OpenAI Settings"
                >
                    🤖
                </span>

                {isVisible && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                            type="password"
                            placeholder="Paste OpenAI API Key"
                            value={key}
                            onChange={(e) => handleSaveKey(e.target.value)}
                            style={{
                                background: 'var(--color-bg)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)',
                                padding: '0.25rem',
                                borderRadius: '4px',
                                width: '200px'
                            }}
                        />

                        <select
                            value={model}
                            onChange={(e) => handleSaveModel(e.target.value)}
                            style={{
                                background: 'var(--color-bg)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)',
                                padding: '0.25rem',
                                borderRadius: '4px',
                                width: '200px'
                            }}
                        >
                            {MODELS.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};
