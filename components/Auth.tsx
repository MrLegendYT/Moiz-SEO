import React, { useState } from 'react';
import { Zap, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';

interface AuthProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth success
    onLogin({ 
      name: name || 'Moiz User', 
      email: email || 'user@example.com' 
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      
      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
              {isLogin ? 'Welcome Back' : 'Join Moiz SEO'}
            </h1>
            <p className="text-zinc-500 font-medium text-sm">
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Start your journey to the top of SERPs today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium placeholder:text-zinc-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-black transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-full h-[1px] bg-zinc-800" />
              <span className="relative z-10 bg-[#0c0c0e] px-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Social Indexing</span>
            </div>
            
            <button className="w-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 rounded-2xl py-4 font-bold transition-all flex items-center justify-center gap-3 active:scale-95">
              <Github size={20} />
              Continue with GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-zinc-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
