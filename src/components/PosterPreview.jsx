import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export const PosterPreview = ({ album, styleVariant }) => {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    if (!posterRef.current || downloading) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Error al generar la imagen.');
          setDownloading(false);
          return;
        }

        const cleanFileName = (album.name || 'poster')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-');

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${cleanFileName}-poster.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setDownloading(false);
      }, 'image/png');

    } catch (err) {
      console.error('Error al exportar poster:', err);
      alert('No se pudo procesar la descarga. Intenta de nuevo.');
      setDownloading(false);
    }
  };

  const isAtmospheric = styleVariant === 'atmospheric';
  const tracks = album.tracks || [];

  return (
    <div className="flex flex-col items-center gap-6 my-4 w-full max-w-sm">
      {/* Póster con altura adaptable min-h-[620px] */}
      <div
        ref={posterRef}
        id="poster-canvas"
        className={`w-[380px] min-h-[620px] p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between relative ${getStyleClasses(styleVariant)}`}
      >
        {/* Fondo Atmosférico */}
        {isAtmospheric && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={album.coverUrl}
              alt=""
              className="w-full h-full object-cover scale-150 blur-3xl opacity-50 saturate-200"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md" />
          </div>
        )}

        {/* Contenido */}
        <div className="relative z-10 flex flex-col h-full justify-between gap-4">
          {/* Cabecera y Portada */}
          <div className="flex-shrink-0">
            <div className="w-full aspect-square overflow-hidden mb-3 shadow-xl rounded-sm bg-neutral-800">
              <img
                src={album.coverUrl}
                alt={album.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>

            <div className="flex justify-between items-end border-b border-current/20 pb-2 mb-1">
              <div className="max-w-[75%]">
                <h2 className="text-lg font-extrabold uppercase tracking-tight leading-snug">
                  {album.name}
                </h2>
                <p className="text-xs opacity-80 font-medium">{album.artist}</p>
              </div>
              <span className="text-xs font-mono opacity-60 shrink-0">{album.releaseYear}</span>
            </div>
          </div>

          {/* Tracklist Completo Dinámico */}
          <div className="flex-1 my-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] leading-[12px] opacity-90">
              {tracks.map((track) => (
                <div key={track.trackNumber} className="flex justify-between border-b border-current/10 pb-[2px] min-w-0">
                  <span className="truncate pr-1">
                    {track.trackNumber}. {track.name}
                  </span>
                  <span className="opacity-60 shrink-0">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie de Página */}
          <div className="flex-shrink-0 pt-2 border-t border-current/20 flex justify-between items-center text-[8px] font-mono opacity-60">
            <span className="truncate max-w-[60%]">{album.label || 'STEREO RECORDING'}</span>
            <span>DURACIÓN: {album.totalDurationMinutes} MIN</span>
          </div>
        </div>
      </div>

      {/* Botón de Descarga */}
      <button
        onClick={handleExport}
        disabled={downloading}
        className="w-full max-w-[380px] py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-700 text-black font-bold rounded-lg text-sm transition shadow-lg"
      >
        {downloading ? 'Generando PNG...' : 'Descargar Poster (PNG)'}
      </button>
    </div>
  );
};

function getStyleClasses(variant) {
  switch (variant) {
    case 'atmospheric':
      return 'bg-neutral-950 text-white border border-white/10';
    case 'clean-poster':
      return 'bg-[#fcfbf9] text-[#111111] font-sans border-[12px] border-white shadow-2xl';
    case 'vinyl':
      return 'bg-[#e0d6c3] text-[#1a1a1a] font-serif border-4 border-[#1a1a1a]';
    case 'ticket':
      return 'bg-[#f4f4f0] text-[#111111] font-mono border-t-8 border-dashed border-neutral-400';
    case 'cyberpunk':
      return 'bg-black text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
    case 'swiss':
    default:
      return 'bg-white text-black font-sans';
  }
}
