import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Catalog  from './pages/Catalog';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Catalog />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Redirecionar qualquer rota desconhecida para o catálogo */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;