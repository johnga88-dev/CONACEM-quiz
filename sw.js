const CACHE='surgiprep-v6-5-5-ui';
const ASSETS=["./", "./index.html", "./manifest.json", "./questions.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./assets/breast_axilla.svg", "./assets/whipple.svg", "./assets/roux.svg", "./assets/ecmo.svg", "./assets/neck.svg", "./assets/vent_loop.svg", "./assets/burn_tbsa.svg", "./assets/anal_fistula.svg", "./assets/retroperitoneo.svg", "./assets/reboa.svg", "./assets/critical_view.svg"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).then(r=>{let c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request))));
