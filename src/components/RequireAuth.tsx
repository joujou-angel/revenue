import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        // 1. Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (!session) {
                navigate('/login');
            }
            setChecking(false);
        });

        // 2. Listen for auth changes (e.g. sign out)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                navigate('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return <>{children}</>;
};
