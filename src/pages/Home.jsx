import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Maximize2,
  ArrowRight,
  Search,
  X,
  Grid,
  Map,
  Home as HomeIcon,
  Briefcase,
  Store
} from 'lucide-react';
import { propiedades } from '../data/propiedadesData';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');

  const categorias = [
    { id: 'todos', label: 'Todos', labelShort: 'Todos', icon: Grid, count: propiedades.length },
    { id: 'terrenos', label: 'Terrenos / Lotizaciones', labelShort: 'Terrenos', icon: Map, count: propiedades.filter(p => p.tipo === 'TERRENO / LOTE').length },
    { id: 'casas', label: 'Casas y Departamentos', labelShort: 'Casas/Dptos', icon: HomeIcon, count: propiedades.filter(p => p.tipo === 'CASA RESIDENCIAL' || p.tipo === 'DEPARTAMENTO').length },
    { id: 'oficinas', label: 'Oficinas Corporativas', labelShort: 'Oficinas', icon: Briefcase, count: propiedades.filter(p => p.tipo === 'OFICINA').length },
    { id: 'tiendas', label: 'Tiendas / Locales', labelShort: 'Tiendas/Locales', icon: Store, count: propiedades.filter(p => p.tipo === 'TIENDA / LOCAL').length }
  ];

  // Estado para el texto dinámico y giratorio del Hero
  const words = ['Proyecto de Inversión', 'Departamento Ideal', 'Hogar Soñado'];
  const [wordIndex, setWordIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.title = "Nexus Domo 360° | Venta de Casas y Propiedades en el Sur del Perú";
  }, []);

  // Intervalo para cambiar la palabra con micro-animaciones premium
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setIsFading(false);
      }, 300); // Duración de la animación de salida
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  // Filtrado en tiempo real interactivo
  const propiedadesFiltradas = propiedades.filter((p) => {
    const matchCategory = activeCategory === 'todos' ||
      (activeCategory === 'terrenos' && p.tipo === 'TERRENO / LOTE') ||
      (activeCategory === 'casas' && (p.tipo === 'CASA RESIDENCIAL' || p.tipo === 'DEPARTAMENTO')) ||
      (activeCategory === 'oficinas' && p.tipo === 'OFICINA') ||
      (activeCategory === 'tiendas' && p.tipo === 'TIENDA / LOCAL');

    const term = searchTerm.toLowerCase();
    const matchSearch = p.titulo.toLowerCase().includes(term) ||
      p.ubicacion.toLowerCase().includes(term) ||
      p.descripcionCorta.toLowerCase().includes(term) ||
      p.descripcionCompleta.toLowerCase().includes(term);

    return matchCategory && matchSearch;
  });



  return (
    <div className="relative min-h-screen text-white flex flex-col items-center overflow-x-hidden bg-transparent">

      <header className="relative w-full pt-24 pb-2 md:pt-28 md:pb-4 px-6 overflow-hidden flex flex-col justify-center items-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-nexus-blue/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-nexus-purple/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-[#00f2fe] text-xs md:text-sm font-black tracking-widest uppercase block mb-3 font-display drop-shadow-[0_2px_8px_rgba(0,242,254,0.3)]">
            PORTAL INMOBILIARIO INMERSIVO 3D
          </span>

          <h1
            style={{ textWrap: 'balance' }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.15] mb-4.5 tracking-tight font-display"
          >
            Encuentra tu próximo<br />
            <span
              className={`text-gradient-rise inline-block transition-all duration-300 transform ${isFading
                ? 'opacity-0 -translate-y-2 scale-95'
                : 'opacity-100 translate-y-0 scale-100'
                }`}
            >
              {words[wordIndex]}
            </span>
          </h1>

          <p
            style={{ textWrap: 'pretty' }}
            className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-8"
          >
            Visita y recorre de forma interactiva tu próxima propiedad sin moverte de casa. Explora lotes, terrenos y viviendas verificadas en Juliaca y el sur de Perú con vuelos de dron y visores 360° en alta definición.
          </p>
        </div>
      </header>

      {/* 2. BARRA DE BÚSQUEDA Y FILTROS ESTILO AIRBNB INTEGRADA */}
      <div className="w-full max-w-3xl mx-auto px-6 mb-12 relative z-20">
        
        {/* Versión Escritorio (Desktop) */}
        <div className="hidden md:flex bg-[#0a0e1a]/80 backdrop-blur-xl border border-white/10 rounded-full p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] items-center justify-between gap-1 w-full relative">
          
          {/* Campo 1: Búsqueda de ubicación */}
          <div className="flex-grow flex items-center gap-3.5 pl-6 pr-4 py-1">
            <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="flex flex-col min-w-0 w-full text-left">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">¿Dónde buscas?</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar casa, departamentos o zona..."
                className="bg-transparent border-0 p-0 text-xs md:text-sm font-semibold text-white placeholder-gray-600 focus:outline-none focus:ring-0 w-full"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer flex-shrink-0"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Divisor vertical */}
          <div className="w-px h-10 bg-white/10 self-center"></div>

          {/* Campo 2: Selector de Categorías de Propiedades */}
          <div className="w-[32%] flex items-center gap-3.5 px-6 py-1 text-left relative cursor-pointer group/select">
            <div className="flex flex-col min-w-0 w-full">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Categoría</label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent border-0 p-0 text-xs md:text-sm font-semibold text-white focus:outline-none focus:ring-0 w-full cursor-pointer appearance-none pr-6 [&>option]:bg-nexus-dark [&>option]:text-white font-display"
              >
                <option value="todos">Todos ({propiedades.length})</option>
                <option value="terrenos">Terrenos ({propiedades.filter(p => p.tipo === 'TERRENO / LOTE').length})</option>
                <option value="casas">Casas y Dptos ({propiedades.filter(p => p.tipo === 'CASA RESIDENCIAL' || p.tipo === 'DEPARTAMENTO').length})</option>
                <option value="oficinas">Oficinas ({propiedades.filter(p => p.tipo === 'OFICINA').length})</option>
                <option value="tiendas">Tiendas ({propiedades.filter(p => p.tipo === 'TIENDA / LOCAL').length})</option>
              </select>
            </div>
            {/* Flecha select decorativa */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover/select:text-white transition-colors duration-200">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Botón Acción (Buscar/Restablecer) */}
          <div className="pr-1.5 flex-shrink-0">
            <button
              onClick={() => {
                if (searchTerm || activeCategory !== 'todos') {
                  setSearchTerm('');
                  setActiveCategory('todos');
                }
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
                searchTerm || activeCategory !== 'todos'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-[#00f2fe] text-black shadow-[0_0_15px_rgba(0,242,254,0.35)] hover:bg-[#00f2fe]/90 hover:shadow-[0_0_20px_rgba(0,242,254,0.5)]'
              }`}
              title={searchTerm || activeCategory !== 'todos' ? "Limpiar filtros" : "Búsqueda activa"}
            >
              {searchTerm || activeCategory !== 'todos' ? (
                <X className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <Search className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
          </div>

        </div>

        {/* Versión Móvil (Mobile) Compacta e Integrada */}
        <div className="flex md:hidden flex-col bg-[#0a0e1a]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.6)] gap-3.5 w-full relative text-left">
          
          {/* Campo Búsqueda */}
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="flex flex-col min-w-0 w-full">
              <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">¿Dónde buscas?</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar casa, departamentos o zona..."
                className="bg-transparent border-0 p-0 text-xs font-semibold text-white placeholder-gray-600 focus:outline-none focus:ring-0 w-full"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Campo Categoría */}
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3 relative group/select">
            <div className="flex flex-col min-w-0 w-full">
              <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Categoría</label>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent border-0 p-0 text-xs font-semibold text-white focus:outline-none focus:ring-0 w-full cursor-pointer appearance-none pr-6 [&>option]:bg-nexus-dark [&>option]:text-white font-display"
              >
                <option value="todos">Todos ({propiedades.length})</option>
                <option value="terrenos">Terrenos ({propiedades.filter(p => p.tipo === 'TERRENO / LOTE').length})</option>
                <option value="casas">Casas y Dptos ({propiedades.filter(p => p.tipo === 'CASA RESIDENCIAL' || p.tipo === 'DEPARTAMENTO').length})</option>
                <option value="oficinas">Oficinas ({propiedades.filter(p => p.tipo === 'OFICINA').length})</option>
                <option value="tiendas">Tiendas ({propiedades.filter(p => p.tipo === 'TIENDA / LOCAL').length})</option>
              </select>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Botón de reset interactivo en móvil (solo si hay filtros activos) */}
          {(searchTerm || activeCategory !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('todos');
              }}
              className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
              Limpiar Búsqueda y Filtros
            </button>
          )}

        </div>

      </div>

      {/* 3. GRID DE PROPIEDADES */}
      <section className="w-full max-w-7xl mx-auto px-3.5 md:px-6 pb-8 md:pb-12 relative z-10">

        {propiedadesFiltradas.length === 0 ? (
          <div className="w-full py-20 text-center bg-[#0c111d]/40 border border-white/5 rounded-3xl backdrop-blur-md">
            <p className="text-gray-400 text-base">No se encontraron propiedades que coincidan con los criterios de búsqueda.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('todos'); }}
              className="mt-4 px-6 py-2 rounded-full font-bold text-xs text-[#00f2fe] border border-[#00f2fe]/20 bg-[#00f2fe]/5 hover:bg-[#00f2fe]/15 transition duration-200"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {propiedadesFiltradas.map((propiedad) => (
              <div
                key={propiedad.id}
                className="group/card bg-[#0c111d]/70 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-[#00f2fe]/20 hover:shadow-[0_10px_30px_rgba(0,242,254,0.05)] transition-all duration-300 flex flex-col justify-between h-full"
              >
                {/* Cabecera de la Tarjeta: Imagen de Portada y Etiquetas */}
                <Link
                  to={`/${propiedad.slug}`}
                  className="relative block aspect-video w-full overflow-hidden bg-black/40 border-b border-white/5 cursor-pointer"
                >
                  <img
                    src={propiedad.portada.startsWith('http') || propiedad.portada.startsWith('data:') ? propiedad.portada : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${propiedad.portada}`}
                    alt={propiedad.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Etiqueta de Tipo de Propiedad */}
                  <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider uppercase border backdrop-blur-md flex items-center gap-1.5 ${propiedad.tipoColor}`}>
                    <span className={`w-1 h-1 rounded-full ${propiedad.tipo === 'TERRENO / LOTE' ? 'bg-blue-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`}></span>
                    {propiedad.tipo}
                  </span>

                  {/* Etiqueta Vista 360° */}
                  {propiedad.tiene360 && (
                    <span
                      className="absolute top-4 right-4 bg-[#05140b]/95 border border-[#09d261]/45 text-[#4ade80] px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_2px_8px_rgba(9,210,97,0.15)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#09d261] animate-pulse"></span>
                      Vista 360°
                    </span>
                  )}
                </Link>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Ubicación */}
                  <div className="flex items-center gap-1.5 text-[#00f2fe] text-xs font-bold mb-2.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{propiedad.ubicacion}</span>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 font-display group-hover/card:text-[#00f2fe] transition-colors duration-300 leading-snug">
                    {propiedad.titulo}
                  </h3>

                  {/* Descripción corta */}
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 flex-grow">
                    {propiedad.descripcionCorta}
                  </p>

                  {/* Ficha de Ubicación Detallada */}
                  <div className="bg-[#0f1626]/60 border border-white/[0.04] rounded-2xl p-3.5 mb-4 space-y-2.5 text-left shadow-inner">
                    <div className="flex items-start gap-2">
                      <span className="text-[#00f2fe] mt-0.5 flex-shrink-0 font-bold text-[9px] bg-[#00f2fe]/10 border border-[#00f2fe]/20 px-1.5 py-0.5 rounded">DIR</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-0.5">Dirección</span>
                        <span className="text-gray-200 text-xs font-medium truncate" title={propiedad.direccion}>{propiedad.direccion}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-white/[0.04]">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Urbanización</span>
                        <span className="text-gray-200 text-xs font-semibold break-words leading-tight" title={propiedad.urbanizacion}>{propiedad.urbanizacion}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Referencia</span>
                        <span className="text-gray-200 text-xs font-medium break-words leading-tight" title={propiedad.referencia}>{propiedad.referencia}</span>
                      </div>
                    </div>
                  </div>

                  {/* Área */}
                  <div className="flex items-center gap-2 text-gray-300 text-xs font-bold py-3.5 border-t border-b border-white/5 mb-4">
                    <Maximize2 className="w-4 h-4 text-[#00f2fe] flex-shrink-0" />
                    <span>Área desde: <span className="text-[#00f2fe]">{propiedad.area}</span></span>
                  </div>

                  {/* Pie de Tarjeta: Precio y Acción */}
                  <div className="flex flex-wrap items-center justify-between gap-3.5 pt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#00f2fe] font-bold uppercase tracking-widest">PRECIO DESDE</span>
                      <span className="text-xl font-black text-[#4ade80] font-display leading-none mt-1">{propiedad.precio}</span>
                    </div>

                    <Link
                      to={`/${propiedad.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-white/5 border border-white/10 hover:bg-[#00f2fe] hover:text-black hover:border-[#00f2fe] hover:shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all duration-300 cursor-pointer select-none btn-mobile-dynamic"
                    >
                      Ver Proyecto
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
