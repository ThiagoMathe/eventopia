import { useEffect, useState } from 'react';
import { signIn } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
      const token = localStorage.getItem('eventopia_token');
      if (token) {
        navigate('/'); // Se já tem token, tchau login!
      }
    }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // O '/' leva para a home (catálogo)
      navigate('/'); 
      
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Erro ao realizar login. Verifique suas credenciais.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-zinc-400 mt-2">Entre na sua conta Eventopia</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-indigo-500 to-cyan-500 py-3 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Ainda não tem uma conta?{' '}
            <button 
              type="button"
              onClick={() => navigate('/register')} 
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
            >
              Cadastre-se agora
            </button>
          </p>
        </div>

      </div>
    </div>
  );}