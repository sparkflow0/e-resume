import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from './firebase-config';

interface AuthContextType {
    user: any; // Using any for user type as we don't have types installed
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged is user on the auth instance in compat mode
        const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const loginWithGoogle = async () => {
        try {
            await auth.signInWithPopup(googleProvider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Check console.");
        }
    };

    const logout = async () => {
        await auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
