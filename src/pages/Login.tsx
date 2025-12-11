import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                // Check if session is established (Auto-confirm enabled) or not (Confirm needed)
                if (data.session) {
                    alert('註冊成功！系統已自動登入。');
                    navigate('/');
                } else {
                    alert('註冊成功，但 Supabase 需要您驗證 Email！\n請去信箱收信，或者去 Supabase 後台 "Authentication -> Providers -> Email" 把 "Confirm email" 關掉後重試。');
                }

            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/'); // Go to dashboard
            }
        } catch (error: any) {
            console.error(error);
            alert('錯誤: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isSignUp ? '註冊帳號 (Sign Up)' : '登入系統 (Sign In)'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isSignUp ? '建立您的專屬資料庫' : '歡迎回來，請輸入帳號密碼'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        {loading ? '處理中...' : (
                            isSignUp ? <><UserPlus size={20} /> 註冊</> : <><LogIn size={20} /> 登入</>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-blue-600 font-medium hover:underline"
                    >
                        {isSignUp ? '已經有帳號？點此登入' : '還沒有帳號？免費註冊'}
                    </button>
                </div>
            </div>
        </div>
    );
};
