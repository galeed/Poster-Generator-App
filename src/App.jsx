// En el método render de App.jsx, dentro del selector de estilos:
<div className="grid grid-cols-2 gap-2">
  {[
    { id: 'swiss', label: 'Suizo / Minimal' },
    { id: 'atmospheric', label: 'Atmospheric (Blur)' },
    { id: 'clean-poster', label: 'Clean Poster' },
    { id: 'vinyl', label: 'Vintage / Vinilo' },
    { id: 'ticket', label: 'Receipt / Ticket' },
    { id: 'cyberpunk', label: 'Cyber / Dark' },
  ].map((style) => (
    <button
      key={style.id}
      onClick={() => setCurrentStyle(style.id)}
      className={`py-2 px-3 text-xs rounded-lg border transition text-left ${
        currentStyle === style.id
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
      }`}
    >
      {style.label}
    </button>
  ))}
</div>
