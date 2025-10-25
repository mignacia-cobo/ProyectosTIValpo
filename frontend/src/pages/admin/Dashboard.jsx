import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { projectService, newsService, contactService } from '../../services';
import { FaProjectDiagram, FaNewspaper, FaEnvelope, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    news: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, news, messages] = await Promise.all([
        projectService.getAllAdmin(),
        newsService.getAllAdmin(),
        contactService.getAllMessages()
      ]);

      setStats({
        projects: projects.length,
        news: news.length,
        unreadMessages: messages.filter(m => !m.read).length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, link }) => (
    <Link to={link} className="card p-6 hover:shadow-2xl transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </Link>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={FaProjectDiagram}
              title="Total Proyectos"
              value={stats.projects}
              color="bg-blue-500"
              link="/admin/projects"
            />
            <StatCard
              icon={FaNewspaper}
              title="Total Noticias"
              value={stats.news}
              color="bg-green-500"
              link="/admin/news"
            />
            <StatCard
              icon={FaEnvelope}
              title="Mensajes Sin Leer"
              value={stats.unreadMessages}
              color="bg-red-500"
              link="/admin/messages"
            />
          </div>

          {/* Accesos rápidos */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/admin/projects"
                className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <FaProjectDiagram className="text-primary-600 text-2xl mr-3" />
                <span className="font-semibold">Gestionar Proyectos</span>
              </Link>
              <Link
                to="/admin/news"
                className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <FaNewspaper className="text-primary-600 text-2xl mr-3" />
                <span className="font-semibold">Gestionar Noticias</span>
              </Link>
              <Link
                to="/admin/messages"
                className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <FaEnvelope className="text-primary-600 text-2xl mr-3" />
                <span className="font-semibold">Ver Mensajes</span>
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <FaEye className="text-primary-600 text-2xl mr-3" />
                <span className="font-semibold">Ver Sitio Público</span>
              </a>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
