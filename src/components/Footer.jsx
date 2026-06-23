import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isContacto = location.pathname === '/contacto';

  // --- Bouncing glow ---
  const footerRef = useRef(null);
  const glowRef = useRef(null);
  const posRef = useRef({ x: 100, y: 30 });
  const velRef = useRef({
    x: Math.random() < 0.5 ? 1 : -1,
    y: Math.random() < 0.5 ? 1 : -1,
  });
  const rafRef = useRef(null);
  const GLOW_W = 380;
  const GLOW_H = 200;

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time) => {
      const footer = footerRef.current;
      const glow = glowRef.current;
      if (!footer || !glow) { 
        lastTime = performance.now();
        rafRef.current = requestAnimationFrame(animate); 
        return; 
      }

      const fw = footer.offsetWidth;
      const fh = footer.offsetHeight;
      const maxX = fw - GLOW_W;
      const maxY = fh - GLOW_H;

      // Calcular diferencia de tiempo en segundos
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Limitar dt para evitar saltos raros al cambiar de pestaña
      const limitedDt = Math.min(dt, 0.1);

      // Velocidad constante en píxeles por segundo (110px/s es equivalente a ~1.83px/frame a 60 FPS)
      const SPEED = 110;

      posRef.current.x += velRef.current.x * SPEED * limitedDt;
      posRef.current.y += velRef.current.y * SPEED * limitedDt;

      // Rebote en X
      if (posRef.current.x <= 0) {
        posRef.current.x = 0;
        velRef.current.x = Math.abs(velRef.current.x);
      } else if (posRef.current.x >= maxX) {
        posRef.current.x = maxX;
        velRef.current.x = -Math.abs(velRef.current.x);
      }

      // Rebote en Y
      if (posRef.current.y <= 0) {
        posRef.current.y = 0;
        velRef.current.y = Math.abs(velRef.current.y);
      } else if (posRef.current.y >= maxY) {
        posRef.current.y = maxY;
        velRef.current.y = -Math.abs(velRef.current.y);
      }

      glow.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  // --- fin bouncing glow ---

  const handleLogoClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer ref={footerRef} className={`w-full bg-[#070a12] border-t border-white/5 relative z-10 pb-8 overflow-hidden ${isContacto ? 'pt-8' : 'pt-5'}`}>
      {/* Glow de fondo decorativo - bouncing */}
      {!isContacto && (
        <div
          ref={glowRef}
          style={{ width: GLOW_W, height: GLOW_H, willChange: 'transform' }}
          className="absolute top-0 left-0 bg-nexus-accent opacity-[0.07] rounded-full blur-[90px] pointer-events-none"
        />
      )}

      {!isContacto && (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 mb-3">
        {/* Columna 1: Brand Info (ocupa 4 de 12 columnas) */}
        <div className="flex flex-col gap-4 md:col-span-4">
          <Link 
            to="/" 
            onClick={handleLogoClick} 
            className="flex flex-row items-center gap-3 group select-none cursor-pointer w-fit"
          >
            <img src={`${import.meta.env.BASE_URL}logo3.2.png`} alt="Nexus Rise Logo" className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110 translate-y-[-15px]" />

            {/* Puedes modificar la clase 'translate-y-[5px]' (u otros píxeles) para subir o bajar el texto respecto al logo */}
            <div className="text-4xl font-logo flex items-center transform translate-y-[1px]">
              <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">Nexus</span>
              <span className="text-gradient-rise drop-shadow-[0_2px_8px_rgba(0,242,254,0.25)] ml-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">Rise</span>
            </div>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Elevando el estándar digital corporativo a través de experiencias web inmersivas, desarrollo de software premium y recorridos virtuales interactivos.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-gray-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-[#ff0000] hover:border-[#ff0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] active:scale-95 group cursor-pointer" 
              aria-label="YouTube"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.53 12 3.53 12 3.53s-7.53 0-9.388.525a3.003 3.003 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.47 12 20.47 12 20.47s7.53 0 9.388-.525a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-gray-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-[#1877f2] hover:border-[#1877f2] hover:shadow-[0_0_20px_rgba(24,119,242,0.5)] active:scale-95 group cursor-pointer" 
              aria-label="Facebook"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-gray-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-[#ee2a7b] hover:shadow-[0_0_20px_rgba(238,42,123,0.5)] active:scale-95 group cursor-pointer" 
              aria-label="Instagram"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-gray-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-[#010101] hover:border-white/20 hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] active:scale-95 group cursor-pointer" 
              aria-label="TikTok"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.56 4.2 1.12 1.35 2.7 2.29 4.38 2.68v3.83c-1.89-.01-3.76-.58-5.33-1.66v7.4c.03 2.13-.57 4.29-1.9 5.96-1.76 2.24-4.56 3.58-7.39 3.58-2.6 0-5.17-1.12-6.84-3.13C-.17 20.35-1.01 16.86-.41 13.88c.6-2.92 2.61-5.46 5.4-6.67 1.24-.55 2.58-.82 3.93-.82.38 0 .76.02 1.14.07v3.91c-.48-.07-.98-.1-1.47-.08-1.57.06-3.11.75-4.11 1.96-1.17 1.4-1.53 3.42-1.04 5.14.49 1.76 1.88 3.19 3.63 3.69 1.88.54 4.02-.03 5.31-1.46.99-1.11 1.43-2.61 1.41-4.09l.01-15.52z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Columna 2: Sitemap (ocupa 2 de 12 columnas, de la 6 a la 7) */}
        <div className="md:col-span-2 md:col-start-6">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Mapa del Sitio</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><Link to="/" className={`transition duration-150 ${location.pathname === '/' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Inicio</Link></li>
            <li><Link to="/proceso" className={`transition duration-150 ${location.pathname === '/proceso' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Proceso</Link></li>
            <li><Link to="/portafolio" className={`transition duration-150 ${location.pathname === '/portafolio' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Portafolio</Link></li>
            <li><Link to="/nosotros" className={`transition duration-150 ${location.pathname === '/nosotros' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Nosotros</Link></li>
            <li><Link to="/contacto" className={`transition duration-150 ${location.pathname === '/contacto' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Contactar</Link></li>
          </ul>
        </div>

        {/* Columna 3: Servicios (ocupa 2 de 12 columnas, de la 8 a la 9) */}
        <div className="md:col-span-2">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Servicios</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li><Link to="/servicios/Constructoras&Inmobiliarias" className={`transition duration-150 ${location.pathname === '/servicios/Constructoras&Inmobiliarias' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Constructoras & Inmobiliarias</Link></li>
            <li><Link to="/servicios/Clínicas&CentrosMédicos" className={`transition duration-150 ${location.pathname === '/servicios/Clínicas&CentrosMédicos' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Clínicas & Centros Médicos</Link></li>
            <li><Link to="/servicios/empresas&comercios" className={`transition duration-150 ${location.pathname === '/servicios/empresas&comercios' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Empresas & Comercios</Link></li>
            <li><Link to="/servicios/Profesionales&Consultores" className={`transition duration-150 ${location.pathname === '/servicios/Profesionales&Consultores' ? 'text-nexus-accent font-bold' : 'text-gray-400 hover:text-white'}`}>Profesionales & Consultores</Link></li>
          </ul>
        </div>

        {/* Columna 4: Asesoría e Ideas (Enlaces de contacto premium) */}
        <div className="flex flex-col gap-4 md:col-span-3">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Asesoría e Ideas</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            ¿Tienes dudas sobre tu proyecto? Escríbenos directamente para recibir asesoría personalizada e impulsar las ventas de tu negocio.
          </p>
          <div className="flex flex-col gap-3.5">
            {/* Botón WhatsApp */}
            <a 
              href="https://wa.me/51951300535?text=Hola%20Nexus%20Rise,%20me%20gustaría%20solicitar%20asesoría%20para%20mi%20proyecto%20web" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/20 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] group cursor-pointer text-sm"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 2.012 14.101.99 11.482.99 6.047.99 1.624 5.361 1.62 10.79c-.001 1.705.452 3.37 1.312 4.822l-1.02 3.725 3.818-1.002c1.47.804 3.078 1.228 4.707 1.229H12c-.002 0-.002 0 0 0zm6.985-7.797c-.382-.191-2.263-1.117-2.612-1.244-.349-.127-.603-.191-.856.191-.253.382-.98 1.244-1.202 1.503-.221.258-.443.287-.825.096-1.928-.962-3.197-2.115-4.148-3.751-.253-.437-.028-.675.186-.889.192-.192.382-.446.572-.669.19-.223.253-.382.381-.637.127-.255.063-.478-.032-.669-.095-.191-.856-2.07-1.171-2.831-.307-.741-.619-.64-.856-.652-.221-.01-.475-.013-.728-.013-.253 0-.665.095-.1.013-.349-.382-1.189-1.244-1.189-2.736s.792-2.931.951-3.122c.159-.191 1.559-2.381 3.778-3.342 2.22-.962 2.22-.64 2.6-.603.381.037 1.268.519 1.446 1.02.178.5.178.929.127 1.02-.051.09-.253.191-.637.382z" />
              </svg>
              <span>Consultar por WhatsApp</span>
            </a>

            {/* Botón Correo */}
            <a 
              href="mailto:contacto@nexusrise.com" 
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-nexus-purple/10 border border-nexus-purple/30 text-nexus-purple font-bold hover:bg-nexus-purple/20 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group cursor-pointer text-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Enviar Correo</span>
            </a>
          </div>
        </div>
      </div>
      )}

      {/* Barra inferior */}
      <div className={`max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 ${isContacto ? '' : 'pt-6 border-t border-white/5'}`}>
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-nexus-accent" /> +51 951 300 535</div>
          <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-nexus-purple" /> contacto@nexusrise.com</div>
          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-500" /> Juliaca, Perú</div>
        </div>
        <p className="text-center md:text-right">
          &copy; {currentYear} Nexus Rise. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
