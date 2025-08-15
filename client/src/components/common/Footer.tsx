import { Link } from 'react-router';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Loader2, Smartphone } from 'lucide-react';
import type { ISocialNetwork } from '@/core/types/ISocialNetwork';
import { useEffect, useState } from 'react';
import { createApiService } from '@/core/services/api.service';
import type { IContact } from '@/core/types/IContact';

const Footer = () => {
  const [socialNetworks, setSocialNetworks] = useState<ISocialNetwork[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SocialNetworkService = createApiService({ basePath: 'social_networks' });
  const ContactService = createApiService({ basePath: 'contacts' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [socialResponse, contactResponse] = await Promise.all([
          SocialNetworkService.get('all'),
          ContactService.get('all'),
        ]);

        setSocialNetworks(socialResponse.data || []);
        setContacts(contactResponse.data || []);
      } catch (err) {
        setError('Error al cargar los datos del footer');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-r from-cyan-700 to-blue-900">
        <Loader2 className="animate-spin text-white h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-gradient-to-r from-cyan-700 to-blue-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  const mainContact = contacts[0] || {} as IContact;
  const mainSocial = socialNetworks[0] || {} as ISocialNetwork;

  const formatBusinessHours = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <footer className="footer p-10 bg-gradient-to-r from-cyan-700 to-blue-900 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="animate__animated animate__fadeIn">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin size={20} className="mr-2" />
            Colegio de Topógrafos Cochabamba
          </h3>
          <p className="text-gray-300 mb-4">
            Impulsando el futuro de la topografía boliviana.
          </p>

          {(mainSocial.url_facebook || mainSocial.url_twitter || mainSocial.url_instagram || mainSocial.url_linkedin) && (
            <div className="flex space-x-4">
              {mainSocial.url_facebook && (
                <a href={mainSocial.url_facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {mainSocial.url_twitter && (
                <a href={mainSocial.url_twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {mainSocial.url_instagram && (
                <a href={mainSocial.url_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {mainSocial.url_linkedin && (
                <a href={mainSocial.url_linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="animate__animated animate__fadeIn animate__delay-1s">
          <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Inicio
              </Link>
            </li>
            {/* 🔥 Eliminado: /cursos */}
            {/* 🔥 Eliminado: /eventos */}
            <li>
              <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">
                Contacto
              </Link>
            </li>
            <li>
              <Link to="/afiliados" className="text-gray-300 hover:text-white transition-colors">
                Área de Miembros
              </Link>
            </li>
          </ul>
        </div>

        <div className="animate__animated animate__fadeIn animate__delay-2s">
          <h3 className="text-lg font-semibold mb-4">Contacto</h3>
          <ul className="space-y-3">
            {mainContact.address && (
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{mainContact.address}</span>
              </li>
            )}
            {mainContact.phone_number && (
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>{mainContact.phone_number}</span>
              </li>
            )}
            {mainContact.mobile_number && (
              <li className="flex items-center">
                <Smartphone size={20} className="mr-2 flex-shrink-0" />
                <span>{mainContact.mobile_number}</span>
              </li>
            )}
            {mainContact.email && (
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>{mainContact.email}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="animate__animated animate__fadeIn animate__delay-3s">
          <h3 className="text-lg font-semibold mb-4">Horario</h3>
          {mainContact.business_hours ? (
            <div className="text-gray-300 whitespace-pre-line">
              {formatBusinessHours(mainContact.business_hours)}
            </div>
          ) : (
            <p className="text-gray-400">Horario no disponible</p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-300 text-sm">
          © {new Date().getFullYear()} Colegio de Topógrafos Cochabamba. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;