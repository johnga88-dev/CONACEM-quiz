const CACHE='surgiprep-v7-22-3-revision-1500-1';
const CORE=['./','./index.html','./app.js','./settings.js','./appearance.js','./style.css','./questions.json','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./icons/apple-touch-icon-180.png','./assets/brand/logo-header.png'];
// Con red lenta o inestable no se espera indefinidamente: si hay copia guardada, se usa tras este plazo.
const NETWORK_TIMEOUT_MS=4000;

self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(CORE);
 // Reutiliza el banco recién guardado en vez de descargar 7 MB por segunda vez.
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
 if(new URL(request.url).origin!==self.location.origin)return; // enlaces externos: el navegador los gestiona
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const hit=await cache.match(request,{ignoreSearch:true});
  const network=fetch(request).then(async response=>{
   if(response&&response.ok)await cache.put(request,response.clone());
   return response;
  });
  try{
   if(!hit)return await network;
   const timeout=new Promise(resolve=>setTimeout(()=>resolve(null),NETWORK_TIMEOUT_MS));
   const response=await Promise.race([network,timeout]);
   if(response&&response.ok)return response;
   network.catch(()=>{}); // la actualización sigue en segundo plano
   return hit;
  }catch(error){
   if(hit)return hit;
   if(request.mode==='navigate'){const page=await cache.match('./index.html');if(page)return page}
   return Response.error();
  }
 })());
});
