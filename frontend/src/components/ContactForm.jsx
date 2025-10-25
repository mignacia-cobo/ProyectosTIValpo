import { useState } from 'react';
import { contactService } from '../services';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaUser, FaEnvelope, FaCommentDots } from 'react-icons/fa';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.send(formData.name, formData.email, formData.message);
      toast.success('Mensaje enviado exitosamente. Te contactaremos pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div className="relative group">
        <label 
          htmlFor="name" 
          className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 group-hover:text-primary-600"
        >
          Nombre completo
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaUser className={`text-lg transition-colors duration-300 ${
              focusedField === 'name' ? 'text-primary-600' : 'text-gray-400'
            }`} />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                     focus:outline-none focus:border-primary-500 focus:bg-white 
                     transition-all duration-300 text-gray-900 placeholder-gray-400
                     hover:border-primary-300"
            placeholder="Escribe tu nombre completo"
          />
        </div>
      </div>

      {/* Email */}
      <div className="relative group">
        <label 
          htmlFor="email" 
          className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 group-hover:text-primary-600"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaEnvelope className={`text-lg transition-colors duration-300 ${
              focusedField === 'email' ? 'text-primary-600' : 'text-gray-400'
            }`} />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                     focus:outline-none focus:border-primary-500 focus:bg-white 
                     transition-all duration-300 text-gray-900 placeholder-gray-400
                     hover:border-primary-300"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      {/* Mensaje */}
      <div className="relative group">
        <label 
          htmlFor="message" 
          className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 group-hover:text-primary-600"
        >
          Mensaje
        </label>
        <div className="relative">
          <div className="absolute top-4 left-4 pointer-events-none">
            <FaCommentDots className={`text-lg transition-colors duration-300 ${
              focusedField === 'message' ? 'text-primary-600' : 'text-gray-400'
            }`} />
          </div>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField('')}
            required
            rows={6}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl 
                     focus:outline-none focus:border-primary-500 focus:bg-white 
                     transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none
                     hover:border-primary-300"
            placeholder="Cuéntanos sobre tu proyecto o consulta..."
          />
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full bg-gradient-to-r from-primary-600 to-purple-600 
                 text-white font-bold py-4 px-8 rounded-xl
                 hover:from-primary-700 hover:to-purple-700
                 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                 overflow-hidden"
      >
        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
        
        <span className="relative flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg">Enviando mensaje...</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="text-lg transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="text-lg">Enviar mensaje</span>
            </>
          )}
        </span>
      </button>

      {/* Mensaje informativo */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Responderemos tu mensaje en menos de <span className="font-semibold text-primary-600">24 horas</span>
      </p>
    </form>
  );
};

export default ContactForm;
