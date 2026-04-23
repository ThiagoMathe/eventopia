import { MapPin, Calendar, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type Event } from '../types/event';
import { useMemo } from 'react';


interface EventCardProps {
  event: Event;
}

const formatPrice = (price: number) => {
  // O "?? 0" garante que se o preço for nulo/undefined, ele usa 0
  return (price ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

function formatDate(dateStr: string) {
  if (!dateStr) return 'Data a definir';

  let date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    date = new Date(dateStr + 'T00:00:00');
  }

  if (isNaN(date.getTime())) {
    console.error("Formato de data não reconhecido:", dateStr);
    return 'Data inválida';
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  const lowestPrice = useMemo(() => {
    if (!event.tickets || event.tickets.length === 0) return null;
    const prices = event.tickets.map(t => Number(t.price));
    return Math.min(...prices);
  }, [event.tickets]);

  function handleBuyClick() {
    const token = localStorage.getItem('eventopia_token');
    if (!token) {
      navigate('/login');
      return;
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/80 transition-all duration-300 hover:border-white/15 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5">
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-sm">
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold leading-snug text-zinc-100 group-hover:text-white">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {event.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              A partir de
            </span>
            <span className="text-xl font-bold text-white">
              {lowestPrice !== null ? formatPrice(lowestPrice) : 'Grátis'}
            </span>
          </div>

          <button
            onClick={handleBuyClick}
            className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95"
          >
            <Ticket className="h-4 w-4" />
            Garantir Ingresso
          </button>
        </div>
      </div>
    </article>
  );
}
