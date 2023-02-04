import { main as localToTidal } from './tidal/local-to-tidal';
import { main as tidalToSpotify } from './spotify/tidal-to-spotify';

(async () => {
  await tidalToSpotify();
})();
