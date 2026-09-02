import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

export const PosterPreview = ({ album, styleVariant }) => {
  const posterRef = useRef(null);

  const handleExport = async () => {
    if (!posterRef.current) return;
    try {
      const dataUrl = await toPng(posterRef.current, { pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `${album.name.replace(/\s+/g, '-').toLowerCase()}-poster.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar poster:', err);
    }
  };

  const isAtmospheric = styleVariant === 'atmospheric';

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={posterRef}
        className={`w-[380px] h-[570px] p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${getStyleClasses(styleVariant)}`}
      >
        {isAtmospheric && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={album.coverUrl}
              alt=""
              className="w-full h-full object-cover scale-150 blur-2xl opacity-60 brightness-90 saturate-200"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="w-full aspect-square overflow-hidden mb-4 shadow-xl rounded-sm">
              <img
                src={album.coverUrl}
                alt={album.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>

            <div className="flex justify-between items-baseline mb-2">
              <div>
                <h2 className="text-xl font-black uppercase leading-none tracking-tight">{album.name}</h2>
                <p className="text-xs opacity-80 font-semibold mt-1">{album.artist}</p>
              </div>
              <span className="text-xs opacity-60 font-mono">{album.releaseYear}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-mono opacity-85 my-2 overflow-hidden">
            {album.tracks?.slice(0, 12).map((track) => (
              <div key={track.trackNumber} className="flex justify-between border-b border-current/15 pb-0.5">
                <span className="truncate pr-1">{track.trackNumber}. {track.name}</span>
                <span className="opacity-70">{track.duration}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-current/25 flex justify-between items-center text-[9px] font-mono opacity-70">
            <span>{album.label || 'STEREO RECORDING'}</span>
            <span>DURACIÓN TOTAL: {album.totalDurationMinutes} MIN</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleExport}
        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition shadow-lg"
      >
        Descargar Poster (PNG)
      </button>
    </div>
  );
};

function getStyleClasses(variant) {
  switch (variant) {
    case 'atmospheric':
      return 'bg-neutral-950 text-white border border-white/10';
    case 'clean-poster':
      return 'bg-[#f8f8f8] text-[#111111] font-sans border-[12px] border-white shadow-2xl';
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
