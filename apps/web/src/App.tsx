import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Catalog  from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 🔓 ROTAS PÚBLICAS: Qualquer um acessa */}
        <Route path="/" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirecionar qualquer rota desconhecida para o catálogo */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* 🔒 Rota restrita: Apenas Organizadores e Admins */}
        <Route element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']} />}>
          <Route path="/events/create" element={<CreateEvent />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;