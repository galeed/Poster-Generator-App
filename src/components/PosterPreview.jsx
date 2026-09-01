import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

export const PosterPreview = ({ album, styleVariant }) => {
  const posterRef = useRef(null);

  const handleExport = async () => {
    if (!posterRef.current) return;
    const dataUrl = await toPng(posterRef.current, { pixelRatio: 3 });
    const link = document.createElement('a');
    link.download = `${album.name.replace(/\s+/g, '-').toLowerCase()}-poster.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Contenedor del Poster */}
      <div
        ref={posterRef}
        className={`w-[380px] h-[570px] p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${getStyleClasses(styleVariant)}`}
      >
        {/* Cabecera / Portada */}
        <div>
          <div className="w-full aspect-square overflow-hidden mb-4 shadow-md rounded-sm">
            <img
              src={album.coverUrl}
              alt={album.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>

          <div className="flex justify-between items-baseline mb-3">
            <div>
              <h2 className="text-lg font-bold uppercase leading-none tracking-tight">{album.name}</h2>
              <p className="text-xs opacity-75 font-medium mt-1">{album.artist}</p>
            </div>
            <span className="text-xs opacity-50 font-mono">{album.releaseYear}</span>
          </div>
        </div>

        {/* Tracklist en 2 Columnas */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-mono opacity-80 my-2 overflow-hidden">
          {album.tracks?.slice(0, 12).map((track) => (
            <div key={track.trackNumber} className="flex justify-between border-b border-current/10 pb-0.5">
              <span className="truncate pr-1">{track.trackNumber}. {track.name}</span>
              <span className="opacity-60">{track.duration}</span>
            </div>
          ))}
        </div>

        {/* Pie de Poster / Metadata */}
        <div className="pt-3 border-t border-current/20 flex justify-between items-center text-[9px] font-mono opacity-60">
          <span>{album.label || 'STEREO RECORDING'}</span>
          <span>DURACIÓN TOTAL: {album.totalDurationMinutes} MIN</span>
        </div>
      </div>

      {/* Botón de Exportación */}
      <button
        onClick={handleExport}
        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm transition shadow-lg"
      >
        Descargar Poster (PNG)
      </button>
    </div>
  );
};

// Función auxiliar para aplicar los estilos visuales mediante Tailwind CSS
function getStyleClasses(variant) {
  switch (variant) {
    case 'vinyl':
      return 'bg-[#e0d6c3] text-[#1a1a1a] font-serif border-4 border-[#1a1a1a]';
    case 'ticket':
      return 'bg-[#f4f4f0] text-[#111111] font-mono border-t-8 border-dashed border-neutral-400';
    case 'cyberpunk':
      return 'bg-black text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    case 'swiss':
    default:
      return 'bg-white text-black font-sans';
  }
}
