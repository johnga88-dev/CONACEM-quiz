(()=>{
 'use strict';
 const themeKey='surgiprep_theme',filterKey='surgiprep_filters_open';
 const system=typeof window.matchMedia==='function'?window.matchMedia('(prefers-color-scheme: dark)'):null;
 const read=(key,fallback)=>{try{return localStorage.getItem(key)||fallback}catch{return fallback}};
 const write=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
 let preference=read(themeKey,'dark');if(!['dark','light','system'].includes(preference))preference='dark';
 function apply(){const actual=preference==='system'?(system?.matches?'dark':'light'):preference;document.documentElement.dataset.theme=actual;const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',actual==='light'?'#f3f6fa':'#101827')}
 apply();if(system?.addEventListener)system.addEventListener('change',()=>{if(preference==='system')apply()});
 document.addEventListener('DOMContentLoaded',()=>{
  const select=document.getElementById('themeSelect');select.value=preference;select.addEventListener('change',()=>{preference=select.value;write(themeKey,preference);apply()});
  const panel=document.getElementById('filterPanel');panel.open=read(filterKey,'false')==='true';panel.addEventListener('toggle',()=>write(filterKey,String(panel.open)));
  const ids=['topicSel','subSel','blockSel','reviewSel','typeSel','studySel'];
  function describe(){const names=ids.filter(id=>{const el=document.getElementById(id);return el&&el.value&&!el.classList.contains('hidden')&&el.value!=='ALL'&&(id!=='studySel'||el.value!=='random')}).map(id=>{const el=document.getElementById(id);return el.options?.[el.selectedIndex]?.textContent||el.value});const text=names.length?names.join(' · '):'Todo el banco';const target=document.getElementById('filterSummary');target.textContent=text;target.title=text;}
  for(const id of ids)document.getElementById(id).addEventListener('change',describe);
  for(const id of ['studyMode','examMode','goWeak','goDue','newSession'])document.getElementById(id).addEventListener('click',()=>setTimeout(describe,0));
  window.addEventListener('surgiprep-session-restored',describe);window.addEventListener('surgiprep-preferences-restored',()=>{preference=read(themeKey,'dark');if(!['dark','light','system'].includes(preference))preference='dark';select.value=preference;apply();panel.open=read(filterKey,'false')==='true';describe()});describe();
 });
})();
