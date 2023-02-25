import { headersWithToken as spotifyHeaders } from '../spotify/network/headers';
import { headersWithToken as tidalHeaders } from '../tidal/network/headers';

const getHeaders = (service: 'spotify' | 'tidal') => {
  if (service === 'spotify') {
    return spotifyHeaders();
  } else if (service === 'tidal') {
    return tidalHeaders();
  }
};

export async function fetchWithHeaders(url: string, service: 'spotify' | 'tidal', method?: 'PUT' | 'POST', body?: any) {
  return fetch(url, {
    method: method ?? 'GET',
    headers: getHeaders(service),
    body: body ?? null,
  });
}
