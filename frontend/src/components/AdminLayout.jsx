import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services';
import { FaHome, FaNewspaper, FaEnvelope, FaSignOutAlt, FaBars, FaTimes, FaProjectDiagram, FaUsers, FaUserFriends, FaCog, FaPalette, FaComments } from 'react-icons/fa';
import { useState } from 'react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/projects', icon: FaProjectDiagram, label: 'Proyectos' },
    { path: '/admin/news', icon: FaNewspaper, label: 'Noticias' },
    { path: '/admin/team', icon: FaUserFriends, label: 'Equipo' },
    { path: '/admin/messages', icon: FaEnvelope, label: 'Mensajes' },
    { path: '/admin/forum', icon: FaComments, label: 'Foro' },
    { path: '/admin/users', icon: FaUsers, label: 'Usuarios' },
    { path: '/admin/site-config', icon: FaPalette, label: 'Contenido del Sitio' },
    { path: '/admin/settings', icon: FaCog, label: 'Redes Sociales' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none mr-4"
              >
                {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>

              <Link to="/admin" className="text-xl font-bold text-primary-600">
                Proyectos TI Valpo - Admin
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:block">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600 transition"
              >
                <FaSignOutAlt className="mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out mt-16 md:mt-0`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3" />
                  {item.label}
                </Link>
              );
            })}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <FaHome className="mr-3" />
              Ver sitio público
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay para cerrar sidebar en mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
