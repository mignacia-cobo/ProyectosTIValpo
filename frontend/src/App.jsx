import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Páginas públicas
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';

// Páginas de administración
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/Projects';
import NewsAdmin from './pages/admin/News';
import MessagesAdmin from './pages/admin/Messages';

// Componente de ruta protegida
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          
          {/* Rutas de administración */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/projects" 
            element={
              <ProtectedRoute>
                <ProjectsAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/news" 
            element={
              <ProtectedRoute>
                <NewsAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/messages" 
            element={
              <ProtectedRoute>
                <MessagesAdmin />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
