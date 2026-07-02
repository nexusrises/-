import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  Compass,
  Gavel,
  Check,
  ChevronDown,
  Camera,
  Share2
} from 'lucide-react';

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [telefonoError, setTelefonoError] = useState('');
  const [email, setEmail] = useState(''); // Opcional
  const [tipoPropiedad, setTipoPropiedad] = useState('');
  const [ubicacionPropiedad, setUbicacionPropiedad] = useState('');
  const [estadoLegal, setEstadoLegal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isMensajeCustom, setIsMensajeCustom] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  const [whatsappLink, setWhatsappLink] = useState('');

  // Actualizar el título de la página
  useEffect(() => {
    document.title = "Vender mi Propiedad con Tecnología 3D | Nexus Domo 360°";
    window.scrollTo(0, 0);
  }, []);

  // Autocompletar mensaje según las opciones seleccionadas
  useEffect(() => {
    if (isMensajeCustom) return;

    let nuevoMensaje = '';
    if (tipoPropiedad || ubicacionPropiedad || estadoLegal) {
      nuevoMensaje = `Deseo vender mi propiedad de tipo: ${tipoPropiedad || '______'}. ` +
        `Ubicada en: ${ubicacionPropiedad || '______'}. ` +
        `Estado legal: ${estadoLegal || '______'}. ` +
        `Me interesa coordinar la sesión multimedia 3D y video con dron gratis.`;
    }
    setMensaje(nuevoMensaje);
  }, [tipoPropiedad, ubicacionPropiedad, estadoLegal, isMensajeCustom]);

  // Función preventiva de sanitización contra ataques de inyección XSS
  const sanitizeInput = (val) => {
    if (typeof val !== 'string') return val;
    return val
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const handleTelefonoChange = (e) => {
    const rawVal = e.target.value;
    setTelefono(rawVal);
    const val = rawVal.replace(/\s+/g, ''); // Quitar espacios

    if (val.startsWith('+')) {
      if (val.length < 11) {
        setTelefonoError('El número internacional parece muy corto');
      } else {
        setTelefonoError('');
      }
    } else {
      if (val.length > 0 && !/^[9]\d{8}$/.test(val)) {
        setTelefonoError('Debe empezar con 9 y tener exactamente 9 dígitos (Ej: 951300535)');
      } else {
        setTelefonoError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !telefono || !tipoPropiedad || !ubicacionPropiedad || !estadoLegal || telefonoError) return;

    const sanitizedNombre = sanitizeInput(nombre);
    const sanitizedTelefono = sanitizeInput(telefono);
    const sanitizedMensaje = sanitizeInput(mensaje);
    const sanitizedUbicacion = sanitizeInput(ubicacionPropiedad);

    setStatus('submitting');
    
    const payload = {
      tipoContacto: 'Vender mi Propiedad (Propietario/B2C)',
      nombre: sanitizedNombre,
      telefono: sanitizedTelefono,
      email: sanitizeInput(email) || 'No especificado',
      tipoPropiedad: tipoPropiedad,
      ubicacionPropiedad: sanitizedUbicacion,
      estadoLegal: estadoLegal,
      mensaje: sanitizedMensaje
    };

    setTimeout(() => {
      console.log('Datos de venta registrados con éxito:', payload);
      
      const baseText = `Hola Nexus, deseo solicitar una evaluación y fotos 3D gratis para vender mi propiedad. Aquí están los detalles:\n\n` +
        `*Nombre:* ${sanitizedNombre}\n` +
        `*Teléfono:* ${sanitizedTelefono}\n` +
        `*Correo:* ${email ? sanitizeInput(email) : 'No especificado'}\n` +
        `*Tipo de Inmueble:* ${tipoPropiedad}\n` +
        `*Ubicación:* ${sanitizedUbicacion}\n` +
        `*Estado Legal:* ${estadoLegal}\n` +
        `*Detalles:* ${sanitizedMensaje}`;

      const waUrl = `https://wa.me/51951300535?text=${encodeURIComponent(baseText)}`;
      setWhatsappLink(waUrl);
      setStatus('success');

      window.open(waUrl, '_blank');
    }, 1200);
  };

  const handleReset = () => {
    setNombre('');
    setTelefono('');
    setTelefonoError('');
    setEmail('');
    setTipoPropiedad('');
    setUbicacionPropiedad('');
    setEstadoLegal('');
    setMensaje('');
    setIsMensajeCustom(false);
    setStatus('idle');
    setWhatsappLink('');
  };

  return (
    <div className="animate-fade-in font-sans pb-16 pt-24 md:pt-28">
      {/* 1. HEADER INTEGRADO COMPACTO */}
      <section className="container mx-auto px-6 mb-8 text-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-nexus-accent/5 rounded-full blur-[60px] pointer-events-none z-0"></div>
        <span className="text-[10px] uppercase text-nexus-accent font-black tracking-widest bg-nexus-accent/10 px-3 py-1.5 rounded-full border border-nexus-accent/20 relative z-10 inline-block font-display">
          MARKETING INMOBILIARIO DE ÉLITE EN JULIACA
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-4 leading-tight max-w-3xl mx-auto relative z-10 font-display">
          Agenda la producción multimedia de tu inmueble <span className="text-gradient-rise">a Costo Cero</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed relative z-10 font-sans">
          Diseñamos recorridos virtuales 360° fluidos y videos con dron profesionales gratis para captar compradores serios en todo el país, respaldando la venta con asesoría legal absoluta.
        </p>
      </section>

      {/* 2. FORMULARIO Y CANALES DE CONTACTO */}
      <section className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO PREMIUM COMPACTO (lg:col-span-7) */}
          <div className="lg:col-span-7 glass-panel border-white/5 rounded-3xl p-6 sm:p-8 bg-[#0a0d16]/70 backdrop-blur-md relative">
            {status !== 'success' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
                  <div className="w-10 h-10 rounded-2xl bg-nexus-accent/10 text-nexus-accent flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white font-display">Ficha Técnica de Evaluación</h3>
                    <p className="text-[11px] text-gray-400 font-sans">Ingresa los datos para estructurar la producción 360° y saneamiento legal.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Fila 1: Nombre y Teléfono */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: María Pérez"
                        className="bg-[#070a13] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/35 transition-all font-sans"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Teléfono / WhatsApp</label>
                      <input 
                        type="tel" 
                        value={telefono}
                        onChange={handleTelefonoChange}
                        placeholder="Ej: 951 300 535"
                        className={`bg-[#070a13] border rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none transition-all font-sans ${
                          telefonoError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/25' : 'border-white/10 focus:border-nexus-accent focus:ring-nexus-accent/35'
                        }`}
                        required
                      />
                      {telefonoError && (
                        <span className="text-[10px] text-red-400 font-medium tracking-wide animate-fade-in-up mt-1">{telefonoError}</span>
                      )}
                    </div>
                  </div>

                  {/* Fila 2: Correo y Tipo de Propiedad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Correo Electrónico <span className="text-gray-500 font-normal lowercase">(opcional)</span></label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ej: maria@correo.com"
                        className="bg-[#070a13] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/35 transition-all font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Tipo de Propiedad</label>
                      <select 
                        value={tipoPropiedad}
                        onChange={(e) => setTipoPropiedad(e.target.value)}
                        className="bg-[#070a13] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/35 transition-all font-sans appearance-none pr-10 cursor-pointer"
                        required
                      >
                        <option value="" disabled className="bg-[#0b0f19]">Selecciona tipo de inmueble</option>
                        <option value="Terreno / Lote de campo" className="bg-[#0b0f19]">Terreno / Lote</option>
                        <option value="Casa Residencial" className="bg-[#0b0f19]">Casa Residencial</option>
                        <option value="Departamento" className="bg-[#0b0f19]">Departamento</option>
                        <option value="Local Comercial / Otro" className="bg-[#0b0f19]">Local / Oficina Comercial</option>
                      </select>
                      <div className="absolute right-4 bottom-3 pointer-events-none text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Fila 3: Ubicación y Estado Legal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Ubicación del Inmueble</label>
                      <input 
                        type="text" 
                        value={ubicacionPropiedad}
                        onChange={(e) => setUbicacionPropiedad(e.target.value)}
                        placeholder="Ej: Salida a Huancané Km 4, Juliaca"
                        className="bg-[#070a13] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/35 transition-all font-sans"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Estado Legal</label>
                      <select 
                        value={estadoLegal}
                        onChange={(e) => setEstadoLegal(e.target.value)}
                        className="bg-[#070a13] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/35 transition-all font-sans appearance-none pr-10 cursor-pointer"
                        required
                      >
                        <option value="" disabled className="bg-[#0b0f19]">Selecciona la situación legal</option>
                        <option value="Inscrita en SUNARP (Título de propiedad limpio)" className="bg-[#0b0f19]">Inscrita en SUNARP (Título limpio)</option>
                        <option value="En proceso de independización / Minuta" className="bg-[#0b0f19]">En proceso / Minuta de Posesión</option>
                        <option value="Derechos y acciones" className="bg-[#0b0f19]">Derechos y Acciones</option>
                        <option value="Otra situación legal" className="bg-[#0b0f19]">Otra Situación Legal</option>
                      </select>
                      <div className="absolute right-4 bottom-3 pointer-events-none text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Mensaje / Detalles */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display">Mensaje / Detalles Adicionales</label>
                    <textarea 
                      value={mensaje}
                      onChange={(e) => {
                        setMensaje(e.target.value);
                        setIsMensajeCustom(true);
                      }}
                      placeholder="Deseo vender mi casa de 2 pisos. Cuenta con título inscrito en SUNARP. Me interesa la sesión de fotos 360° y video con dron gratis..."
                      rows="4"
                      className="bg-[#070a13] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/35 transition-all resize-none font-sans"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'submitting' || !!telefonoError}
                    className="w-full btn-neon-cian py-4 rounded-xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider text-xs md:text-sm font-display mt-4 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>SOLICITAR EVALUACIÓN Y FOTOS 3D GRATIS ➔</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-display">¡Solicitud Registrada!</h3>
                <p className="text-gray-400 text-xs sm:text-sm max-w-md mb-8 font-sans">
                  Hemos registrado los detalles de tu propiedad. Te hemos redirigido a WhatsApp para enviar el mensaje con los detalles al asesor inmobiliario en Juliaca.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] text-white hover:bg-[#20ba5a] rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.3)] font-display"
                  >
                    Abrir WhatsApp Manualmente
                  </a>
                  <button 
                    onClick={handleReset}
                    className="px-6 py-3 rounded-full border border-white/10 hover:border-nexus-accent/40 text-gray-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 uppercase tracking-wider font-display"
                  >
                    Registrar otra propiedad
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: CANALES RÁPIDOS Y MAPA (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            
            {/* Canales Directos */}
            <div className="glass-panel border-white/5 rounded-3xl p-6 flex flex-col gap-4 bg-[#0a0d16]/70 backdrop-blur-md">
              <h3 className="text-white font-bold text-base mb-2 uppercase tracking-wider font-display">Canales de Atención</h3>
              
              <a 
                href="https://wa.me/51951300535?text=Hola%20Nexus%2C%20deseo%20hacer%20una%20consulta%20inmobiliaria."
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#09d261]/10 text-[#09d261] hover:bg-[#09d261]/20 border border-[#09d261]/15 transition duration-150 group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-[#09d261] text-white">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.573 1.453 5.361 1.454h.005c5.548 0 10.067-4.515 10.07-10.066.002-2.687-1.043-5.216-2.946-7.12C17.228 1.517 14.7 .472 12.013.472c-5.55 0-10.069 4.515-10.073 10.066-.001 2.036.53 4.02 1.536 5.761l-.183-.284-1.01 3.687 3.774-.99-.262-.156zM15.968 13.09c-.258-.129-1.528-.755-1.765-.84-.237-.086-.41-.129-.582.129t-.667.84c-.161.183-.323.205-.582.076-1.018-.51-1.838-.909-2.548-1.517-.547-.468-.847-1.01-.98-1.242-.132-.233-.014-.359.104-.475.106-.104.237-.276.355-.414.119-.138.158-.233.237-.388.08-.155.04-.293-.02-.422-.06-.129-.582-1.402-.797-1.919-.21-.504-.44-.435-.582-.442l-.497-.008c-.172 0-.452.065-.688.323-.237.258-.905.884-.905 2.155s.927 2.496 1.056 2.668c.13.172 1.824 2.785 4.42 3.904.618.266 1.1.424 1.477.544.62.197 1.185.169 1.631.102.497-.075 1.528-.625 1.744-1.23.215-.603.215-1.12.15-1.23-.064-.11-.236-.174-.495-.304z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white font-display">WhatsApp Corporativo</h4>
                  <p className="text-[10px] text-gray-400 font-sans">Atención instantánea por chat.</p>
                </div>
              </a>

              <a href="mailto:nexus.agencia360@gmail.com?subject=Consulta%20Nexus" className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-nexus-purple/10 text-nexus-purple border border-nexus-purple/15 hover:bg-nexus-purple/20 transition duration-150 group cursor-pointer">
                <div className="p-2.5 rounded-xl bg-nexus-purple text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white font-display">Correo Electrónico</h4>
                  <p className="text-[10px] text-gray-400 font-sans font-medium">nexus.agencia360@gmail.com</p>
                </div>
              </a>

              <a href="tel:+51951300535" className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:border-white/15 transition duration-150 group cursor-pointer">
                <div className="p-2.5 rounded-xl bg-white/5 text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white font-display">Línea Directa</h4>
                  <p className="text-[10px] text-gray-400 font-sans">+51 951 300 535</p>
                </div>
              </a>
            </div>

            {/* Sede Central (SEO Local en Juliaca, Perú) */}
            <div className="glass-panel border-white/5 rounded-3xl p-6 bg-[#0a0d16]/70 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-nexus-accent opacity-[0.03] rounded-full blur-[50px] pointer-events-none"></div>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
                  <Compass className="w-3.5 h-3.5 text-nexus-accent" />
                  <span>Sede Central</span>
                </div>
                <h3 className="text-white font-bold text-base md:text-lg mb-2 font-display">Juliaca, Perú</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-sans font-normal">
                  Nuestra oficina central de coordinación de habilitación urbana, levantamientos topográficos en campo y soporte digital inmobiliario está ubicada en la ciudad de <strong>Juliaca, Perú</strong>, permitiéndonos consolidar nuestra presencia física y legal en el departamento de Puno.
                </p>
              </div>

              {/* Contenedor de Google Maps Responsivo */}
              <div className="w-full h-44 bg-nexus-dark border border-white/10 rounded-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] group/map">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5968.414272319901!2d-70.13478994714418!3d-15.497418550135656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9167f3e5361625b9%3A0x2a1629113760cbfc!2sJuliaca!5e1!3m2!1ses!2spe!4v1780340457115!5m2!1ses!2spe" 
                  className="w-full h-full border-0 rounded-2xl opacity-75 group-hover/map:opacity-100 transition-opacity duration-300" 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Nexus Domo 360° en Juliaca, Perú"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
