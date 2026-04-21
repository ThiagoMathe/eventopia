// apps/web/src/App.tsx
function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-4">
          Eventopia Web 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          O frontend está rodando localmente! Próximo passo: Integração com a API e RAG.
        </p>
        <div className="flex gap-2 justify-center">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            React + Vite
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Tailwind CSS
          </span>
        </div>
      </div>
    </div>
  )
}

export default App