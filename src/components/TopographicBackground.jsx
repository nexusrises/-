import React, { useEffect, useRef } from 'react';

// SISTEMA DE CONTROL DE PROPIEDADES AVANZADO (Basado en la especificación oficial de Framer TerrainLines)
const CONFIG = {
  // Patrón geométrico del relieve (Ruido procedimental)
  pattern: {
    scale: 0.0068,    // Escala del ruido (mayor = ondas y colinas más sinuosas y tupidas)
    octaves: 3,       // Octavas de ruido (Fractal Brownian Motion para micro-detalles de relieve)
    smoothing: 0.5,   // Factor de interpolación y suavizado
  },
  
  // Parámetros de la cámara virtual en perspectiva 3D
  view3D: {
    zDepth: 145,         // Elevación vertical física real en el eje Z (mayor = colinas más pronunciadas)
    pitch: 0.92,         // Inclinación vertical de la cámara (~52 grados)
    yaw: -0.22,          // Rotación lateral orbital asimétrica de la cámara (~-12 grados)
    cameraDistance: 850, // Profundidad de fuga / Distancia al plano base
    offsetY: 90,        // Desplazamiento vertical físico de toda la proyección hacia abajo de la pantalla
  },
  
  // Configuración de los cometas luminosos neón (Pulses)
  pulses: {
    count: 48,             // Cantidad de partículas activas en pantalla
    speedMin: 0.75,        // Velocidad mínima individual
    speedMax: 1.85,        // Velocidad máxima individual
    glowRadius: 5.2,       // Radio del halo de brillo neón
    headSizeFactor: 0.7,   // Tamaño relativo del núcleo brillante
  },
  
  // Paleta de colores oficial de la marca Nexus Rise
  colors: {
    background: '#040712',                     // Fondo negro espacial profundo
    gradStart: 'rgba(59, 130, 246, opacity)',   // Nivel bajo: Azul eléctrico
    gradEnd: 'rgba(0, 242, 254, opacity)',       // Nivel medio/alto: Cian neón brillante
    gradAccent: 'rgba(168, 85, 247, opacity)',   // Nivel cumbre: Púrpura orbital
    pulseCian: 'rgba(0, 242, 254, 0.95)',       // Partículas cian
    pulsePurple: 'rgba(168, 85, 247, 0.95)',     // Partículas púrpura
  }
};

export default function TopographicBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ajustar resolución física para pantallas Retina/High-DPI
    const dpr = window.devicePixelRatio || 1;

    // CONFIGURACIÓN DE ELEMENTOS DE DIBUJO
    const lineSpacing = 18; // Reducido para mayor densidad de isolíneas topográficas reales
    const segments = 65; // Mayor resolución de segmentos horizontales para curvas 3D perfectas

    let centerX = width / 2;
    let centerY = height / 1.7; // Punto de fuga y horizonte desplazado hacia la mitad inferior de la pantalla
    let stepX = (width * 1.6) / (segments - 1);
    let totalLines = Math.floor(height / lineSpacing) + 16;

    // Inicializar los cometas neón (Pulses) antes de llamar a resizeCanvas
    const particles = [];
    const initialWidthFactor = Math.max(0.4, width / 1440);
    for (let i = 0; i < CONFIG.pulses.count; i++) {
      const baseSpeed = CONFIG.pulses.speedMin + Math.random() * (CONFIG.pulses.speedMax - CONFIG.pulses.speedMin);
      particles.push({
        x: Math.random() * width * 1.6 - width * 0.3,
        lineIndex: Math.floor(Math.random() * totalLines),
        baseSpeed: baseSpeed,
        speed: baseSpeed * initialWidthFactor,
        size: 1.0 + Math.random() * 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.04,
        color: Math.random() > 0.4 ? CONFIG.colors.pulseCian : CONFIG.colors.pulsePurple,
      });
    }

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Recalcular dinámicamente según resolución
      centerX = width / 2;
      centerY = height / 1.7;
      stepX = (width * 1.6) / (segments - 1);
      totalLines = Math.floor(height / lineSpacing) + 16;

      // Adaptar velocidad de partículas al nuevo ancho
      const widthFactor = Math.max(0.4, width / 1440);
      particles.forEach((p) => {
        p.speed = p.baseSpeed * widthFactor;
      });
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // MATRIZ DE PROYECCIÓN 3D A PANTALLA 2D
    const project = (x3d, y3d, z3d) => {
      const px = x3d - width / 2;
      const py = y3d - height / 2;

      // 1. Rotación lateral orbital (Yaw - Eje Z de rotación)
      const rx = px * Math.cos(CONFIG.view3D.yaw) - py * Math.sin(CONFIG.view3D.yaw);
      const ry = px * Math.sin(CONFIG.view3D.yaw) + py * Math.cos(CONFIG.view3D.yaw);
      
      const rz = z3d; // Elevación vertical física

      // 2. Proyección basada en la distancia de la cámara (Profundidad ry)
      const depth = ry + CONFIG.view3D.cameraDistance;
      if (depth <= 10) return null; // Detrás de la cámara

      const scale = CONFIG.view3D.cameraDistance / depth;

      // 3. Inclinación de la cámara (Pitch - Eje X) e incremento vertical por Z + Desplazamiento offsetY
      const sx = centerX + rx * scale;
      const sy = centerY + (ry * Math.sin(CONFIG.view3D.pitch) - rz * Math.cos(CONFIG.view3D.pitch)) * scale + CONFIG.view3D.offsetY;

      return { x: sx, y: sy, scale, opacity: Math.min(1.0, Math.max(0.0, scale * 1.55)) };
    };

    // ALGORITMO PROCEDURAL FRACTAL BROWNIAN MOTION (FBM)
    const getProceduralNoise = (x, y, time) => {
      let value = 0;
      let amplitude = 1.0;
      let frequency = 1.0;
      
      const scale = CONFIG.pattern.scale;
      const octaves = CONFIG.pattern.octaves;

      // Suma interactiva de múltiples octavas de ruido trigonométrico fractal
      for (let i = 0; i < octaves; i++) {
        const tx = x * scale * frequency + time * (0.35 * frequency);
        const ty = y * scale * frequency - time * (0.16 * frequency);
        
        // Combinamos senos y cosenos desfasados para formas orgánicas no-periódicas
        const wave = Math.sin(tx) * Math.cos(ty) + Math.sin(tx * 0.5) * Math.cos(ty * 1.5) * 0.3;
        value += wave * amplitude;
        
        // Ley de decaimiento fractal (disminuye amplitud y duplica frecuencia)
        amplitude *= 0.5;
        frequency *= 2.1;
      }

      // Escalar por el Z-Depth de elevación tridimensional
      return value * CONFIG.view3D.zDepth;
    };

    let time = 0;
    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      const delta = Math.min(50, now - lastTime) / 16.666; // Normalizado a ~1.0 a 60 FPS
      lastTime = now;

      time += 0.0016 * delta; // Avanzar el tiempo virtual del relieve independiente de los FPS

      // Limpieza transparente del canvas en cada frame para revelar el fondo de la app
      ctx.clearRect(0, 0, width, height);

      // Suavizado e interpolación de la posición del ratón
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      ctx.lineWidth = 1.1;

      // 1. RENDERIZADO DE LAS CURVAS DE NIVEL TOPOGRÁFICAS EN 3D
      for (let i = -6; i < totalLines; i++) {
        const baseY = i * lineSpacing;

        ctx.beginPath();
        const projectedPoints = [];

        for (let j = 0; j < segments; j++) {
          const px = j * stepX - width * 0.25;
          let py = baseY;
          let pz = 0; // Elevación vertical inicial

          // A) Calcular relieve fractal FBM
          pz += getProceduralNoise(px, py, time);

          // B) Influencia elástica interactiva del ratón en 3D
          if (mouse.x > -500) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 260; // Radio elástico de la colina interactiva

            if (dist < radius) {
              const force = (1 - dist / radius) ** 2.2;
              const wave = Math.sin(dist * 0.045 - time * 6) * 45;
              pz += wave * force;
            }
          }

          // C) Proyectar a pantalla 2D
          const pt = project(px, py, pz);
          if (pt) {
            projectedPoints.push(pt);
          }
        }

        // Trazar curvas continuas suavizadas
        if (projectedPoints.length > 0) {
          ctx.moveTo(projectedPoints[0].x, projectedPoints[0].y);
          
          for (let j = 0; j < projectedPoints.length - 1; j++) {
            const xc = (projectedPoints[j].x + projectedPoints[j + 1].x) / 2;
            const yc = (projectedPoints[j].y + projectedPoints[j + 1].y) / 2;
            ctx.quadraticCurveTo(projectedPoints[j].x, projectedPoints[j].y, xc, yc);
          }
          
          ctx.lineTo(projectedPoints[projectedPoints.length - 1].x, projectedPoints[projectedPoints.length - 1].y);
        }

        // D) Niebla atmosférica y asignación cromática
        if (projectedPoints.length > 0) {
          const avgScale = projectedPoints[0].scale;
          
          // La opacidad decae exponencialmente al alejarse en profundidad (Horizon Fog)
          let opacity = Math.max(0.02, 0.28 * Math.pow(avgScale, 1.4));
          
          // Desvanecer bordes
          const distToCenter = Math.abs(baseY - height / 2.2) / (height / 2.2);
          opacity *= Math.max(0.1, 1 - distToCenter * 0.75);

          // Mapear gradiente de colores basado en la altura y atenuación de opacidad
          const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
          lineGrad.addColorStop(0, CONFIG.colors.gradStart.replace('opacity', (opacity * 0.35).toString()));
          lineGrad.addColorStop(0.5, CONFIG.colors.gradEnd.replace('opacity', opacity.toString()));
          lineGrad.addColorStop(1, CONFIG.colors.gradAccent.replace('opacity', (opacity * 0.45).toString()));

          ctx.strokeStyle = lineGrad;
          ctx.stroke();
        }
      }

      // 2. RENDERIZADO DE PARTÍCULAS NEÓN (PULSES) EN PERSPECTIVA 3D
      particles.forEach((p) => {
        p.x += p.speed * delta; // Desplazamiento horizontal independiente de los FPS
        
        if (p.x > width * 1.25) {
          p.x = -width * 0.25;
          p.lineIndex = Math.floor(Math.random() * totalLines);
        }

        const baseY = p.lineIndex * lineSpacing;
        let pz = getProceduralNoise(p.x, baseY, time);

        // Deformación elástica de la partícula al cursor
        if (mouse.x > -500) {
          const dx = p.x - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 260;

          if (dist < radius) {
            const force = (1 - dist / radius) ** 2.2;
            const wave = Math.sin(dist * 0.045 - time * 6) * 45;
            pz += wave * force;
          }
        }

        // Proyectar partícula
        const pt = project(p.x, baseY, pz);
        if (pt) {
          p.pulsePhase += p.pulseSpeed;
          const pulseFactor = 1 + Math.sin(p.pulsePhase) * 0.35;
          const size = p.size * pt.scale * pulseFactor;

          // Halo difuso de brillo neón
          const glowSize = size * CONFIG.pulses.glowRadius;
          const glowGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowSize);
          glowGrad.addColorStop(0, p.color);
          glowGrad.addColorStop(0.3, p.color.replace('0.95', '0.35'));
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, glowSize, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo brillante
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, size * CONFIG.pulses.headSizeFactor, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mapear coordenadas de pantalla 2D al plano inclinado rotado 3D
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const relativeX = clientX - centerX;
      const relativeY = clientY - centerY;

      const cosY = Math.cos(CONFIG.view3D.yaw);
      const sinY = Math.sin(CONFIG.view3D.yaw);
      
      const rawDepth = relativeY / Math.sin(CONFIG.view3D.pitch);
      const unscaledDepth = rawDepth * 1.5;

      mouseRef.current.tx = width / 2 + (relativeX * cosY + unscaledDepth * sinY);
      mouseRef.current.ty = height / 2 + (-relativeX * sinY + unscaledDepth * cosY);
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.tx = -1000;
      mouseRef.current.ty = -1000;
      mouseRef.current.active = false;
    };

    // Registrar eventos interactivos a nivel global en window
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Compatibilidad móvil táctil global
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches[0].clientX - rect.left;
        const clientY = e.touches[0].clientY - rect.top;

        const relativeX = clientX - centerX;
        const relativeY = clientY - centerY;
        const cosY = Math.cos(CONFIG.view3D.yaw);
        const sinY = Math.sin(CONFIG.view3D.yaw);
        const rawDepth = relativeY / Math.sin(CONFIG.view3D.pitch);
        const unscaledDepth = rawDepth * 1.5;

        mouseRef.current.tx = width / 2 + (relativeX * cosY + unscaledDepth * sinY);
        mouseRef.current.ty = height / 2 + (-relativeX * sinY + unscaledDepth * cosY);
        mouseRef.current.active = true;
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
