import { type Event } from '../types/event';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/80">
      <div className="aspect-video bg-zinc-800" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-5 w-3/4 rounded bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-800" />
        <div className="flex gap-3 pt-2">
          <div className="h-3 w-20 rounded bg-zinc-800" />
          <div className="h-3 w-24 rounded bg-zinc-800" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div className="h-6 w-20 rounded bg-zinc-800" />
          <div className="h-9 w-36 rounded-full bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export default function EventGrid({ events, isLoading, isError }: EventGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-red-500/10 p-6">
          <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-300">Erro ao carregar eventos</h3>
        <p className="mt-1 text-sm text-zinc-500">Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-white/5 p-6">
          <svg className="h-10 w-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-300">Nenhum evento encontrado</h3>
        <p className="mt-1 text-sm text-zinc-500">Tente ajustar os filtros ou a busca.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
