import { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { type Category, type Event } from '../types/event';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import EventGrid from '../components/EventGrid';

const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD') // Decompõe os caracteres (ex: 'ú' vira 'u' + '´')
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos (diacríticos)
    .trim();
};

export default function Catalog() {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const { data, isLoading, isError } = useEvents();

  const filteredEvents = useMemo(() => {
  if (!data) return [];

  const query = searchTerm.toLowerCase().trim();
  
  return (data as Event[]).filter((event: Event) => {
    // Normalizamos ambos os lados para a comparação de categoria
    const eventCategory = normalizeString(event.category || '');
    const selectedCategory = normalizeString(activeCategory);

    const matchesCategory =
      activeCategory === 'Todos' || eventCategory === selectedCategory;

    // Aproveitamos a normalização na busca textual também
    const matchesSearch =
      query === '' ||
      normalizeString(event.title || '').includes(query) ||
      normalizeString(event.description || '').includes(query) ||
      normalizeString(event.location || '').includes(query);

    return matchesCategory && matchesSearch;
  });
}, [data, searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <FilterBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-100">Eventos em destaque</h2>
          {!isLoading && (
            <p className="mt-1 text-sm text-zinc-500">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <EventGrid events={filteredEvents} isLoading={isLoading} isError={isError} />
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-zinc-600">
        Eventopia &copy; {new Date().getFullYear()} &mdash; Todos os direitos reservados.
      </footer>
    </div>
  );
}