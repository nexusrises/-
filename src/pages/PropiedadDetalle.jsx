import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Maximize2, 
  ArrowLeft, 
  ExternalLink, 
  Check 
} from 'lucide-react';
import VirtualTour from '../components/VirtualTour';
import { propiedades } from '../data/propiedadesData';

export default function PropiedadDetalle() {
  const { slug } = useParams();
  const propiedad = propiedades.find((p) => p.slug === slug);

  const [isTourLoaded, setIsTourLoaded] = useState(false);

  useEffect(() => {
    setIsTourLoaded(false);
    const timer = setTimeout(() => {
      setIsTourLoaded(true);
    }, 400);

    window.scrollTo(0, 0);

    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    if (propiedad) {
      document.title = `${propiedad.titulo} | Nexus Domo 360°`;
    }
  }, [propiedad]);

  if (!propiedad) {
    return (
      <div className="container mx-auto px-6 pt-32 pb-32 relative z-10 flex flex-col items-center text-center animate-fade-in">
        <h2 className="text-4xl font-bold text-white mb-6">Propiedad no encontrada</h2>
        <p className="text-xl text-gray-400 max-w-2xl mb-8">El proyecto solicitado no existe o ha sido retirado.</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-white bg-white/5 border border-white/10 hover:bg-[#00f2fe] hover:text-black hover:border-[#00f2fe] transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 relative z-10 animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Barra Superior con botón Volver y Categoría */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/15 transition-all duration-200 select-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#00f2fe]" />
            Volver al Catálogo
          </Link>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-md text-[9px] font-black tracking-wider uppercase border backdrop-blur-md flex items-center gap-1.5 ${propiedad.tipoColor}`}>
              <span className={`w-1 h-1 rounded-full ${propiedad.tipo === 'TERRENO / LOTE' ? 'bg-blue-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`}></span>
              {propiedad.tipo}
            </span>

            {/* Enlace de Google Maps */}
            <a
              href={propiedad.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider uppercase text-gray-400 hover:text-[#00f2fe] border border-white/5 hover:border-[#00f2fe]/20 bg-white/[0.02] hover:bg-[#00f2fe]/5 transition-all duration-200 select-none cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00f2fe] flex-shrink-0" />
              Ver en Google Maps
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Cabecera del Proyecto */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-white font-display leading-tight">
            {propiedad.titulo}
          </h1>
          <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-1">
            <MapPin className="w-4 h-4 text-nexus-accent" />
            {propiedad.ubicacion}
          </p>
        </div>

        {/* CUERPO PRINCIPAL REESTRUCTURADO */}
        <div className="flex flex-col gap-8 text-left">
          
          {/* Fila 1: Visor VirtualTour 360° en Ancho Completo */}
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            {isTourLoaded ? (
              <VirtualTour
                tourId={propiedad.tourId}
                isExpanded={false}
                setIsExpanded={() => {}}
                autoRotate={true}
                showThumbnails={true}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070a13]">
                <img 
                  src={propiedad.portada.startsWith('http') || propiedad.portada.startsWith('data:') ? propiedad.portada : `${import.meta.env.BASE_URL.replace(/\/$/, "")}${propiedad.portada}`}
                  alt="Cargando visor" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm pointer-events-none"
                />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-[#00f2fe]/20 border-t-[#00f2fe] rounded-full animate-spin"></div>
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase font-display">Iniciando Visor 360°</span>
                </div>
              </div>
            )}
          </div>

          {/* Fila 2: Información en 2 Columnas Balanceadas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Columna Izquierda: Detalles Narrativos, Beneficios y Mapa (8/12) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Descripción Completa */}
              <div className="glass-panel border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 bg-[#0a0d16]/30 backdrop-blur-md">
                <h3 className="text-white text-sm md:text-base font-black tracking-wider uppercase flex items-center gap-2 font-display">
                  <span className="w-1.5 h-3.5 bg-[#00f2fe] rounded-full"></span>
                  Descripción del Proyecto
                </h3>
                <p className="text-[#e4e7ec] text-sm md:text-base leading-relaxed font-sans text-left tracking-wide font-normal">
                  {propiedad.descripcionCompleta}
                </p>
              </div>

              {/* Beneficios */}
              <div className="glass-panel border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 bg-[#0a0d16]/30 backdrop-blur-md">
                <h3 className="text-white text-sm md:text-base font-black tracking-wider uppercase flex items-center gap-2 font-display">
                  <span className="w-1.5 h-3.5 bg-[#00f2fe] rounded-full"></span>
                  Beneficios Destacados
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {propiedad.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start gap-3 text-[#e4e7ec] text-xs md:text-sm leading-relaxed">
                      <div className="p-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/20 text-[#00f2fe] mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-left font-medium">{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Columna Derecha: Tarjeta de Venta y Datos Rápidos (Sticky 4/12) */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              
              <div className="flex flex-col gap-6 p-6 sm:p-8 bg-[#0a0d16]/40 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
                
                {/* Datos Técnicos (Área y Precio) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col text-left">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Área Total</span>
                    <span className="text-sm md:text-base font-black text-white mt-1.5 flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-[#00f2fe]" />
                      {propiedad.area}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col text-left">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Precio Especial</span>
                    <span className="text-sm md:text-base font-black text-[#4ade80] mt-1.5 font-display">
                      {propiedad.precio}
                    </span>
                  </div>
                </div>

                {/* Dirección y Referencias de Ubicación */}
                <div className="p-5 rounded-2xl bg-[#0f1626]/40 border border-white/5 space-y-4 text-left">
                  <span className="text-[#00f2fe] text-[9px] font-black tracking-widest uppercase block">Ubicación y Accesos</span>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Dirección</span>
                      <span className="text-gray-200 text-xs md:text-sm font-medium">{propiedad.direccion}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.04]">
                      <div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Urbanización</span>
                        <span className="text-gray-200 text-xs font-semibold">{propiedad.urbanizacion}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Referencia</span>
                        <span className="text-gray-200 text-xs font-medium">{propiedad.referencia}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enlace WhatsApp Dinámico */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/51951300535?text=Hola%20Nexus%2C%20estoy%20interesado%20en%20el%20proyecto%20*${encodeURIComponent(propiedad.titulo)}*%2C%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20esta%20propiedad.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-[#09d261]/10 border border-[#09d261]/25 text-left hover:bg-[#09d261]/15 hover:border-[#09d261]/40 transition-all duration-300 shadow-[0_0_20px_rgba(9,210,97,0.02)] hover:shadow-[0_0_30px_rgba(9,210,97,0.1)] cursor-pointer select-none group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#09d261] flex items-center justify-center text-white shadow-[0_0_15px_rgba(9,210,97,0.35)] transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
                      <svg className="w-5.5 h-5.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-0.5 select-none text-left">
                      <span className="text-white text-xs md:text-sm font-black tracking-wide font-display group-hover:text-[#00f2fe] transition-colors duration-200">
                        Consultar Disponibilidad
                      </span>
                      <span className="text-gray-400 text-[9px] md:text-[10px] font-semibold leading-none">
                        Pregunta por precios y planos en tiempo real
                      </span>
                    </div>
                  </a>
                </div>

              </div>

            </div>

          </div>

          {/* Fila 3: Mapa de ubicación geográfica en Ancho Completo (Último abajo del todo) */}
          <div className="w-full glass-panel border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 bg-[#0a0d16]/30 backdrop-blur-md">
            <h3 className="text-white text-sm md:text-base font-black tracking-wider uppercase flex items-center gap-2 font-display">
              <span className="w-1.5 h-3.5 bg-[#00f2fe] rounded-full"></span>
              Ubicación Geográfica
            </h3>
            <div className="w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-md relative bg-black/40">
              {isTourLoaded ? (
                <iframe
                  src={propiedad.mapsIframe}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={`Mapa de ubicación de ${propiedad.titulo}`}
                  className="w-full h-full filter invert-[0.9] hue-rotate-[180deg] contrast-[1.2]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#070a13]/50">
                  <div className="w-6 h-6 border-2 border-white/5 border-t-white/20 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

        </div>
      </div>
    </div>
  </div>
  );
}
