import { Link } from 'react-router';
import { Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import type { ISocialNetwork } from '@/core/types/ISocialNetwork';
import { useEffect, useState } from 'react';
import { createApiService } from '@/core/services/api.service';
import type { IContact } from '@/core/types/IContact';

const Footer = () => {
  const [socialNetworks, setSocialNetworks] = useState<ISocialNetwork[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);
  // We render the footer regardless of loading to avoid layout jumps; data will hydrate when available.
  // Optional: capture fetch errors in console only to avoid UI noise

  const SocialNetworkService = createApiService({basePath: 'social_networks'});
  const ContactService = createApiService({basePath: 'contacts'});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [socialResponse, contactResponse] = await Promise.all([
          SocialNetworkService.get('all'),
          ContactService.get('all')
        ]);
        setSocialNetworks(socialResponse.data || []);
        setContacts(contactResponse.data || []);
      } catch (err) {
        console.error('Error al cargar los datos del footer', err);
      }
    };
    fetchData();
  }, []);

  const mainContact = contacts[0] || {};
  const mainSocial = socialNetworks[0] || {};

  // reserved for future use if we show business hours again
  // const formatBusinessHours = (text: string) => {
  //   if (!text) return null;
  //   return text.split('\n').map((line, i) => (
  //     <span key={i}>
  //       {line}
  //       <br />
  //     </span>
  //   ));
  // };

  return (
    <section className="relative">
      {/* Wave top separator */}
      <div className="absolute -top-[60px] left-0 right-0 h-[60px] pointer-events-none" aria-hidden>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,32L60,26.7C120,21,240,11,360,10.7C480,11,600,21,720,26.7C840,32,960,32,1080,26.7C1200,21,1320,11,1380,5.3L1440,0L1440,60L1380,60C1320,60,1200,60,1080,60C960,60,840,60,720,60C600,60,480,60,360,60C240,60,120,60,60,60L0,60Z"
            fill="#1A1B16"
          />
        </svg>
      </div>

      <footer className="bg-[#1A1B16] text-white pt-20 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          {/* Brand */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight">Directorii</span>
            </div>
            <p className="mt-6 text-gray-300 text-lg">
              {mainContact.address || '16650 Bass Lake Rd, Suite 102, Maple Grove, MN, 55311'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-6 text-gray-300">
              {(mainContact.phone_number || mainContact.mobile_number) && (
                <a href={`tel:${mainContact.phone_number || mainContact.mobile_number}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Phone className="size-5" />
                  <span>{mainContact.phone_number || mainContact.mobile_number}</span>
                </a>
              )}
              {mainContact.email && (
                <a href={`mailto:${mainContact.email}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Mail className="size-5" />
                  <span>{mainContact.email}</span>
                </a>
              )}
            </div>

            {/* Social icons */}
            <div className="mt-8 flex items-center justify-center gap-6">
              {mainSocial.url_instagram && (
                <a href={mainSocial.url_instagram} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center size-14 rounded-full border border-white/30 hover:bg-white/10 transition">
                  <Instagram className="size-6 text-white" />
                </a>
              )}
              {mainSocial.url_facebook && (
                <a href={mainSocial.url_facebook} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center size-14 rounded-full border border-white/30 hover:bg-white/10 transition">
                  <Facebook className="size-6 text-white" />
                </a>
              )}
              {mainSocial.url_linkedin && (
                <a href={mainSocial.url_linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center size-14 rounded-full border border-white/30 hover:bg-white/10 transition">
                  <Linkedin className="size-6 text-white" />
                </a>
              )}
              {/* Optional YouTube if available via a custom field */}
              {(mainSocial as any).url_youtube && (
                <a href={(mainSocial as any).url_youtube} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center size-14 rounded-full border border-white/30 hover:bg-white/10 transition">
                  <Youtube className="size-6 text-white" />
                </a>
              )}
            </div>

            {/* Store badges */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <a href="#" className="block">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-12 w-auto"
                  loading="lazy"
                />
              </a>
              <a href="#" className="block">
                <img
                  src="https://play.google.com/intl/en/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-14 w-auto"
                  loading="lazy"
                />
              </a>
            </div>

            {/* Legal */}
            <div className="mt-10 flex items-center justify-center gap-8 text-gray-300">
              <Link to="/terms" className="hover:text-white">Terms of Use</Link>
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Copyright © {new Date().getFullYear()} Directorii LLC. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;