import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Lógica para gerar o slug (letras minúsculas, números e hifens)
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .normalize('NFD')                     // Decompõe os acentos
      .replace(/[\u0300-\u036f]/g, '')     // Remove os acentos
      .replace(/[^\w\s-]/g, '')            // Remove caracteres especiais
      .replace(/[\s_-]+/g, '-')            // Troca espaços por hifens
      .replace(/^-+|-+$/g, '');            // Remove hifens soltos no início/fim

    try {
      const token = localStorage.getItem('eventopia_token');

      await axios.post('http://localhost:3000/events', {
        title,
        description,
        date: new Date(date).toISOString(),
        location,
        category,
        slug: generatedSlug,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Evento criado com sucesso!');
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      setError(error.response?.data?.message || 'Falha ao criar o evento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl">
        <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          Criar Novo Evento
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-5 text-center">
            {Array.isArray(error) ? error.join(' | ') : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Título do Evento</label>
            <input
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Ex: Workshop de NestJS e React"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Data e Hora</label>
              <input
                type="datetime-local" 
                required 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/50 text-zinc-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Cidade / Local</label>
              <input
                type="text" 
                required 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Ex: Campina Grande - PB"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Categoria</label>
            <select
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/50 text-zinc-300"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Música">Música</option>
              <option value="Esportes">Esportes</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
            <textarea
              rows={4} 
              required 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              placeholder="Descreva os detalhes do evento..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button" 
              onClick={() => navigate('/')}
              className="w-1/2 border border-white/10 py-3 rounded-xl hover:bg-white/5 transition-all text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit" 
              disabled={isLoading}
              className="w-1/2 bg-linear-to-r from-indigo-500 to-cyan-500 py-3 rounded-xl font-bold hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Criando...' : 'Publicar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}