import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-display ${
      isScrolled 
        ? 'bg-[#070a13]/92 backdrop-blur-md border-b border-[#00f2fe]/10 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-transparent border-b border-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={handleLinkClick} className="text-2xl md:text-3xl font-logo flex items-center gap-2 group select-none tracking-wide whitespace-nowrap">
          <img src={`${import.meta.env.BASE_URL}logo3.2.png`} alt="Nexus Domo 360 Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform duration-300 group-hover:scale-110" />

          <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">Nexus</span>
          <span className="text-gradient-rise drop-shadow-[0_2px_8px_rgba(0,242,254,0.25)] ml-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">Domo 360°</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider">
          <Link 
            to="/" 
            className={`hover:text-nexus-accent transition-colors duration-200 py-2 uppercase ${isActive('/') ? 'text-nexus-accent' : 'text-white'}`}
          >
            Proyectos
          </Link>
          <Link 
            to="/compra-seguro" 
            className={`hover:text-nexus-accent transition-colors duration-200 py-2 uppercase ${isActive('/compra-seguro') ? 'text-nexus-accent' : 'text-white'}`}
          >
            Compra con Seguridad
          </Link>
          <Link 
            to="/vende-tu-propiedad" 
            className={`hover:text-nexus-accent transition-colors duration-200 py-2 uppercase ${isActive('/vende-tu-propiedad') ? 'text-nexus-accent' : 'text-white'}`}
          >
            Vende tu Propiedad
          </Link>
        </div>

        {/* Contact Button (Desktop) - Estilo botón neón cian */}
        <div className="hidden md:block">
          <Link 
            to="/contacto" 
            className="inline-flex btn-neon-cian px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-200 active:scale-95"
          >
            Contactar
          </Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 text-gray-400 hover:text-white focus:outline-none w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all duration-200 ${
            isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
          }`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className={`md:hidden absolute top-full left-0 w-full bg-[#070a13]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.8)] p-6 pb-7 flex flex-col gap-5 transition-all duration-300 origin-top z-40 ${
        isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible pointer-events-none'
      }`}>
        <div className="flex flex-col gap-4 text-base font-semibold">
          <Link 
            to="/" 
            onClick={handleLinkClick}
            className={`p-2 rounded-xl hover:bg-white/5 ${isActive('/') ? 'text-nexus-accent' : 'text-white'}`}
          >
            Proyectos
          </Link>
          <Link 
            to="/compra-seguro" 
            onClick={handleLinkClick}
            className={`p-2 rounded-xl hover:bg-white/5 ${isActive('/compra-seguro') ? 'text-nexus-accent' : 'text-white'}`}
          >
            Compra con Seguridad
          </Link>
          <Link 
            to="/vende-tu-propiedad" 
            onClick={handleLinkClick}
            className={`p-2 rounded-xl hover:bg-white/5 ${isActive('/vende-tu-propiedad') ? 'text-nexus-accent' : 'text-white'}`}
          >
            Vende tu Propiedad
          </Link>
        </div>

        <Link 
          to="/contacto" 
          onClick={handleLinkClick}
          className="w-full inline-flex items-center justify-center btn-neon-cian py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-200 active:scale-95 text-center"
        >
          Contactar
        </Link>

        {/* Botón adhesivo/sticker de cerrar en la línea inferior del menú */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 bg-[#070a13] border border-white/10 text-gray-400 hover:text-nexus-accent px-4.5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-1.5 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap z-50 hover:border-nexus-accent/30"
        >
          <X className="w-3 h-3" />
          Cerrar menú
        </button>
      </div>
    </nav>
  );
}

