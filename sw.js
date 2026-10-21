const CACHE='surgiprep-v7-23-1-banco2000-1';
const CORE=['./','./index.html','./app.js','./settings.js','./appearance.js','./style.css','./questions.json','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./icons/apple-touch-icon-180.png','./assets/brand/logo-header.png'];
// Archivos de la aplicación: siempre se piden a la red primero para no mezclar versiones; la copia guardada solo se usa sin conexión.
const isCore=url=>url.pathname.endsWith('/')||/\.(html|js|css|json)$/.test(url.pathname);

self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // cache:'reload' evita guardar copias antiguas de la caché HTTP de GitHub Pages (hasta 10 min).
 await Promise.all(CORE.map(async path=>{const r=await fetch(new Request(path,{cache:'reload'}));if(!r.ok)throw new Error('No se pudo guardar '+path);await cache.put(path,r)}));
 const stored=await cache.match('./questions.json');
 const bank=stored?await stored.json():[];
 const images=[...new Set(bank.map(q=>q.image).filter(Boolean))];
 await Promise.all(images.map(async path=>{try{await cache.add(path)}catch(error){console.warn('Imagen no disponible sin conexión:',path)}}));
 await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys()){if(key.startsWith('surgiprep-')&&key!==CACHE)await caches.delete(key)}
 await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return; // enlaces externos: el navegador los gestiona
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(request.mode==='navigate'||isCore(url)){
   try{
    const response=await fetch(request,{cache:'no-cache'});
    if(response&&response.ok){await cache.put(request,response.clone());return response}
    const hit=await cache.match(request,{ignoreSearch:true});
    return hit||response;
   }catch(error){
    const hit=await cache.match(request,{ignoreSearch:true});
    if(hit)return hit;
    if(request.mode==='navigate'){const page=await cache.match('./index.html');if(page)return page}
    return Response.error();
   }
  }
  // Imágenes e iconos: copia guardada primero (no cambian entre versiones).
  const hit=await cache.match(request,{ignoreSearch:true});
  if(hit)return hit;
  try{const response=await fetch(request);if(response&&response.ok)await cache.put(request,response.clone());return response}
  catch(error){return Response.error()}
 })());
});
