import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Páginas públicas
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import NewForumPost from './pages/NewForumPost';

// Páginas de administración
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/Projects';
import NewsAdmin from './pages/admin/News';
import MessagesAdmin from './pages/admin/Messages';
import UsersAdmin from './pages/admin/Users';
import TeamAdmin from './pages/admin/Team';
import SettingsAdmin from './pages/admin/Settings';
import SiteConfigAdmin from './pages/admin/SiteConfig';
import ForumAdmin from './pages/admin/Forum';

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
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/post/:id" element={<ForumPost />} />
          <Route path="/forum/new" element={<NewForumPost />} />
          
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
          <Route 
            path="/admin/team" 
            element={
              <ProtectedRoute>
                <TeamAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <UsersAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute>
                <SettingsAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/site-config" 
            element={
              <ProtectedRoute>
                <SiteConfigAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/forum" 
            element={
              <ProtectedRoute>
                <ForumAdmin />
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
