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
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsVisible(!isVisible)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="AI Settings"
            >
                🤖
            </button>

            {isVisible && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    zIndex: 1000,
                    background: 'var(--color-surface)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    minWidth: '220px'
                }}>
                    <input
                        type="password"
                        placeholder="Paste OpenAI API Key"
                        value={key}
                        onChange={(e) => handleSaveKey(e.target.value)}
                        style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    <select
                        value={model}
                        onChange={(e) => handleSaveModel(e.target.value)}
                        style={{
                            background: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        {MODELS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};
