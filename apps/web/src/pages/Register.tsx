import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../services/auth';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signUp(name, email, password, phone);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Criar conta</h2>
            <p className="text-zinc-400">Comece a explorar os melhores eventos</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>

            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                    type="tel"
                    placeholder="Telefone (ex: 83 99999-9999)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                    required
                />
                </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800/50 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group w-full bg-linear-to-r from-indigo-500 to-cyan-500 py-4 rounded-2xl text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? 'Criando conta...' : 'Cadastrar agora'}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <p className="text-center text-sm text-zinc-500">
            Já tem uma conta? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}