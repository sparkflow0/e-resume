import { useState, useEffect } from 'react';
import { UploadSection } from './components/UploadSection';
import { PersonaView, PersonaData } from './components/PersonaView';
import { PersonaEditor } from './components/PersonaEditor';
import { ShareButton } from './components/ShareButton'; // New Import
import { ApiKeyInput } from './components/ApiKeyInput';
import { AuthProvider, useAuth } from './services/auth-context';
import { savePersona, getPersona } from './services/db-service';

const AppContent = () => {
    const { user, loginWithGoogle, logout } = useAuth();
    const [persona, setPersona] = useState<PersonaData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [publicMode, setPublicMode] = useState(false);

    // Check for public URL param "?u=USER_ID"
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const publicUserId = params.get('u');

        if (publicUserId) {
            setPublicMode(true);
            const loadPublicData = async () => {
                const data = await getPersona(publicUserId);
                if (data) {
                    setPersona(data);
                } else {
                    alert("Profile not found or deleted.");
                }
            };
            loadPublicData();
        }
    }, []);

    // Load user data on login (ONLY if not in public mode)
    useEffect(() => {
        const loadUserData = async () => {
            if (user && !publicMode) {
                const savedData = await getPersona(user.uid);
                if (savedData) {
                    setPersona(savedData);
                }
            }
        };
        loadUserData();
    }, [user, publicMode]);

    const handleAnalysisComplete = (data: any) => {
        setPersona(data);
    };

    const handleSavePersona = async (data: PersonaData) => {
        setPersona(data);
        setIsEditing(false);

        if (user) {
            setIsSaving(true);
            await savePersona(user.uid, data);
            setIsSaving(false);
        }
    };

    // Render Public View
    if (publicMode) {
        return (
            <div className="app-container">
                header className="main-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', opacity: 0.7 }}>E-Resume Profile</h1>
                    <a href="/" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Create your own
                    </a>
                </header>
                <main>
                    {persona ? (
                        <PersonaView data={persona} />
                    ) : (
                        <p style={{ textAlign: 'center' }}>Loading Profile...</p>
                    )}
                </main>
            </div >
        );
    }

// Render Editor/Creator View
return (
    <div className="app-container">
        <header className="main-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem'
        }}>
            <div>
                <h1>E-Resume</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                    Your Persona, Elevated.
                </p>
            </div>

            <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {persona && !isEditing && (
                    <button
                        onClick={() => {
                            if (confirm("This will overwrite current unsaved data. Continue?")) {
                                setPersona(null);
                            }
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        📄 Upload New
                    </button>
                )}

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--color-accent-secondary)' }}>Hi, {user.displayName}</span>
                        <button onClick={() => logout()}>Logout</button>
                    </div>
                ) : (
                    <button
                        onClick={loginWithGoogle}
                        style={{ background: 'var(--color-accent-primary)', border: 'none' }}
                    >
                        Login to Save
                    </button>
                )}
            </div>
        </header>

        <main>
            <ApiKeyInput />
            {!persona ? (
                <UploadSection onAnalysisComplete={handleAnalysisComplete} />
            ) : isEditing ? (
                <PersonaEditor
                    initialData={persona}
                    onSave={handleSavePersona}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div style={{ position: 'relative' }}>
                    <PersonaView
                        data={persona}
                        onEdit={() => setIsEditing(true)}
                    />

                    <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {user && (
                            <button
                                onClick={() => handleSavePersona(persona)}
                                disabled={isSaving}
                                style={{ opacity: 0.8 }}
                            >
                                {isSaving ? "Saving..." : "Save to Cloud ☁️"}
                            </button>
                        )}

                        {user && <ShareButton userId={user.uid} />}
                    </div>

                    {!user && persona && (
                        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                            <p>Login to save this profile permanently.</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    </div>
);
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
