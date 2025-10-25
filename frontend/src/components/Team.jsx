import { useEffect, useState } from 'react';
import { teamService } from '../services';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const data = await teamService.getAll();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error al cargar miembros del equipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/400';
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imageUrl}`;
  };

  if (loading) {
    return (
      <section id="equipo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <section id="equipo" className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4 animate-fade-in">
            🌟 Nuestro Equipo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Conoce al Equipo
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Profesionales comprometidos con la innovación y la excelencia
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Imagen */}
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src={getImageUrl(member.image_url)}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Información */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                
                {member.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex justify-center space-x-3 pt-4 border-t border-gray-100">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-primary-600 text-gray-600 hover:text-white rounded-full transition-all duration-300"
                      title="Email"
                    >
                      <FaEnvelope size={18} />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-[#0077B5] text-gray-600 hover:text-white rounded-full transition-all duration-300"
                      title="LinkedIn"
                    >
                      <FaLinkedin size={18} />
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-900 text-gray-600 hover:text-white rounded-full transition-all duration-300"
                      title="GitHub"
                    >
                      <FaGithub size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
