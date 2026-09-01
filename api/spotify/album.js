export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'El ID del álbum es obligatorio' });
  }

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;

    const tokenRes = await fetch(`${protocol}://${host}/api/spotify/token`);
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({ error: 'Error de autenticación' });
    }

    // Consulta detallada del álbum en Spotify
    const albumRes = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const albumData = await albumRes.json();

    if (!albumRes.ok) {
      return res.status(albumRes.status).json(albumData);
    }

    // Formatear canciones con minutos y segundos (mm:ss)
    const tracks = albumData.tracks.items.map((track) => {
      const minutes = Math.floor(track.duration_ms / 60000);
      const seconds = Math.floor((track.duration_ms % 60000) / 1000);
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      return {
        trackNumber: track.track_number,
        name: track.name,
        duration: formattedDuration,
        explicit: track.explicit,
      };
    });

    // Calcular duración total del álbum
    const totalMs = albumData.tracks.items.reduce((acc, t) => acc + t.duration_ms, 0);
    const totalMins = Math.floor(totalMs / 60000);

    return res.status(200).json({
      id: albumData.id,
      name: albumData.name,
      artist: albumData.artists.map((a) => a.name).join(', '),
      releaseDate: albumData.release_date,
      releaseYear: albumData.release_date ? albumData.release_date.split('-')[0] : '',
      coverUrl: albumData.images[0]?.url || '',
      label: albumData.label || '',
      totalTracks: albumData.total_tracks,
      totalDurationMinutes: totalMins,
      spotifyUrl: albumData.external_urls.spotify,
      tracks: tracks,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar el detalle del álbum' });
  }
}
