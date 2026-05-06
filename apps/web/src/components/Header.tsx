import { Search, LogIn, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserPayload } from '.././utils/auth';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  
  // Verificamos se o usuário está logado
  const isAuthenticated = !!localStorage.getItem('eventopia_token');

  // Lógica para verificar se o usuário pode criar eventos
  const user = getUserPayload();
  const canCreateEvent = user && (user.role === 'ORGANIZER' || user.role === 'ADMIN');

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem('eventopia_token');
    navigate('/login');
    window.location.reload(); // Recarrega para limpar estados globais se necessário
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/" className="shrink-0">
          <h1 className="bg-linear-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Eventopia
          </h1>
        </a>

        <div className="relative mx-4 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar eventos, cidades, categorias..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/40 focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/30"
          />
        </div>

        {/* Grupo de ações à direita para manter o alinhamento do Flexbox */}
        <div className="flex items-center gap-4">
          
          {/* Botão dinâmico de Criar Evento */}
          {canCreateEvent && (
            <button
              onClick={() => navigate('/events/create')}
              className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-cyan-500/10 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Criar Evento</span>
            </button>
          )}

          {/* Renderização Condicional do Botão de Autenticação */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex shrink-0 items-center gap-2 rounded-full border border-red-500/15 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-cyan-500/30 hover:bg-white/10 hover:text-zinc-100"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Entrar</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}