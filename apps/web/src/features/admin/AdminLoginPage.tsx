import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string, user: any) => void;
  onReturnToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnToStore,
}) => {
  const [email, setEmail] = useState('admin@customry.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Invalid admin credentials');
      }

      const { accessToken, user } = data.data;
      if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
        throw new Error('Access denied. Admin or Staff role required.');
      }

      onLoginSuccess(accessToken, user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1c1c] text-white flex flex-col justify-center items-center p-6 relative">
      <div className="max-w-md w-full bg-[#303030]/60 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#745a27]/40 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#745a27]/30 text-[#c9a96e] rounded-full flex items-center justify-center mx-auto border border-[#745a27]">
            <Shield size={24} />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#c9a96e]">
            CUSTOMRY ADMIN
          </h1>
          <p className="text-xs text-gray-400 font-sans uppercase tracking-widest">
            Atelier Management Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-[#1b1c1c] border border-gray-600 rounded-xl text-xs text-white focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-[#1b1c1c] border border-gray-600 rounded-xl text-xs text-white focus:border-[#c9a96e] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#745a27] hover:bg-[#c9a96e] text-white hover:text-[#1b1c1c] font-semibold text-xs uppercase tracking-widest py-3.5 rounded-full transition duration-300 flex items-center justify-center gap-2 shadow-lg mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onReturnToStore}
            className="text-xs text-gray-400 hover:text-[#c9a96e] transition"
          >
            ← Return to Customry Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
