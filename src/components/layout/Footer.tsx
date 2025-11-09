import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Packages', href: '/packages' },
  { name: 'Activities', href: '/activities' },
];

const destinations = [
  { name: 'Bwindi Forest', href: '/discover-uganda' },
  { name: 'Murchison Falls', href: '/discover-uganda' },
  { name: 'Queen Elizabeth NP', href: '/discover-uganda' },
  { name: 'Lake Victoria', href: '/discover-uganda' },
];

export const Footer = () => {

  return (
    <footer className="text-white" style={{ backgroundColor: '#013220' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1 lg:pr-4">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/Logo/E_Ug-3.png" 
                alt="Everything Uganda Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold">Everything Uganda</span>
            </div>
            <p className="text-gray-300 mb-4 text-xs leading-relaxed">
              Discover the Pearl of Africa with our expertly crafted tours and authentic experiences.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 text-green-400 flex-shrink-0" />
                <span className="text-xs">+256 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 text-green-400 flex-shrink-0" />
                <span className="text-xs">info@everythinguganda.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:px-2">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="lg:px-2">
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              {destinations.map((destination) => (
                <li key={destination.name}>
                  <Link
                    to={destination.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-xs"
                  >
                    {destination.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Globalism */}
          <div className="lg:pl-4">
            <h3 className="text-lg font-semibold mb-4">Globalism</h3>
            <p className="text-gray-300 mb-4 text-xs leading-relaxed">
              Connecting cultures across continents
            </p>
            <div className="space-y-3">
              {/* Country Flags */}
              <div className="flex items-center">
                {/* Uganda Flag */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-4 flex rounded overflow-hidden border border-gray-600 flex-shrink-0">
                    <div className="flex-1 bg-black"></div>
                    <div className="flex-1 bg-yellow-400"></div>
                    <div className="flex-1 bg-red-500"></div>
                  </div>
                  <span className="text-xs text-gray-300">Uganda</span>
                </div>
              </div>
              
              <div className="flex items-center">
                {/* UK Flag */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-4 bg-blue-700 rounded overflow-hidden border border-gray-600 relative flex-shrink-0">
                    <div className="absolute inset-0 bg-blue-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-white"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0.5 h-full bg-white"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-600"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0.5 h-full bg-red-600"></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-300">United Kingdom</span>
                </div>
              </div>
              
              <div className="flex items-center">
                {/* UAE Flag */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-4 flex rounded overflow-hidden border border-gray-600 flex-shrink-0">
                    <div className="w-1.5 bg-red-600"></div>
                    <div className="flex-1">
                      <div className="h-1.5 bg-green-600"></div>
                      <div className="h-1 bg-white"></div>
                      <div className="h-1.5 bg-black"></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-300">UAE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-8 pt-8 border-t border-emerald-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © 2025 Everything Uganda. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};