/**
 * Creature artwork from Cloudflare R2 (binding MEDIA, see wrangler.toml), served on the site's own origin
 * under /media/… so the Content-Security-Policy stays 'self'. Responses are kept in the edge cache, so
 * repeat views do not read R2 again. Files are uploaded by scripts/upload-media.mjs during deploy.
 */
const TYPES = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', avif: 'image/avif' };

export async function onRequestGet({ request, env, params, waitUntil }) {
  const key = (params.path || []).join('/');
  const ext = key.split('.').pop().toLowerCase();
  if (!/^art\/[a-z0-9][a-z0-9._-]*$/i.test(key) || !TYPES[ext]) return new Response('Not found', { status: 404 });

  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const object = await env.MEDIA.get(key);
  if (!object) return new Response('Not found', { status: 404 });
  const response = new Response(object.body, {
    headers: {
      'Content-Type': TYPES[ext],
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      ETag: object.httpEtag,
      'X-Content-Type-Options': 'nosniff',
    },
  });
  waitUntil(cache.put(request, response.clone()));
  return response;
}
