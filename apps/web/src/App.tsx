import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Catalog  from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rota Pública */}
        <Route path="/" element={<Catalog />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rota de Registro */}
        <Route path="/register" element={<Register />} />

        {/* Redirecionar qualquer rota desconhecida para o catálogo */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;