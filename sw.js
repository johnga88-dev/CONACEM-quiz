const CACHE='surgiprep-v7-23-14-corregida-2600-1';
const CORE=['./','./index.html','./app.js','./settings.js','./appearance.js','./style.css','./questions.json','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./icons/apple-touch-icon-180.png','./assets/brand/logo-header.png'];

self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(CORE);
 const stored=await cache.match('./questions.json');
 const bank=stored?await stored.json():[];
 const images=[...new Set(bank.map(q=>q.image).filter(Boolean))];
 await Promise.all(images.map(async path=>{try{await cache.add(path)}catch(error){console.warn('Imagen no disponible sin conexión:',path)}}));
 // Use the normal waiting lifecycle: an open exam is not claimed by a new worker.
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys()){
  if(key.startsWith('surgiprep-')&&key!==CACHE)await caches.delete(key);
 }
 // Existing uncontrolled pages keep their current code until a normal navigation.
})()));

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const hit=await cache.match(request,{ignoreSearch:true});
  // This is a static, versioned distribution. Never mix a newer script/bank into
  // the installed edition. The next worker installs a complete new core first.
  if(hit)return hit;
  try{
   const response=await fetch(request);
   if(response&&response.ok)await cache.put(request,response.clone());
   return response;
  }catch(error){
   if(request.mode==='navigate'){
    const page=await cache.match('./index.html');if(page)return page;
   }
   return Response.error();
  }
 })());
});
