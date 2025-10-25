import { useEffect, useState } from 'react';
import { FaRocket, FaLightbulb, FaCogs } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import NewsCard from '../components/NewsCard';
import ContactForm from '../components/ContactForm';
import { projectService, newsService } from '../services';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, newsData] = await Promise.all([
        projectService.getAll(),
        newsService.getLatest(3)
      ]);
      setProjects(projectsData);
      setNews(newsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section id="inicio" className="pt-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Proyectos TI Valpo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Desarrollamos y mantenemos soluciones tecnológicas innovadoras
            </p>
            <a 
              href="#proyectos" 
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Ver Proyectos
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <FaRocket className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovación Constante</h3>
              <p className="text-gray-600">
                Implementamos las últimas tecnologías para crear soluciones modernas y eficientes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <FaLightbulb className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Soluciones Inteligentes</h3>
              <p className="text-gray-600">
                Desarrollamos sistemas que optimizan procesos y mejoran la productividad.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <FaCogs className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mantenimiento Continuo</h3>
              <p className="text-gray-600">
                Brindamos soporte y actualizaciones constantes para garantizar el óptimo funcionamiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="proyectos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Proyectos
            </h2>
            <p className="text-xl text-gray-600">
              Conoce las soluciones que hemos desarrollado
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay proyectos disponibles en este momento.</p>
          )}
        </div>
      </section>

      {/* News Section */}
      <section id="noticias" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Últimas Novedades
            </h2>
            <p className="text-xl text-gray-600">
              Mantente informado sobre nuestras actualizaciones
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay noticias disponibles en este momento.</p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h2>
            <p className="text-xl text-gray-600">
              ¿Tienes alguna pregunta o propuesta? Escríbenos
            </p>
          </div>

          <div className="card p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
