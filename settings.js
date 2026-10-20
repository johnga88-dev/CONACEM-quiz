(()=>{
 'use strict';
 const key='surgiprep_voice_settings_v1',defaults={voiceURI:'auto',rate:1,creator:'',textSize:'medium'};
 let preferences={...defaults},initialized=false,previewActive=false,previewToken=0,previewTimer=null,previewUtterance=null;
 const $=id=>document.getElementById(id);
 function sanitize(data){const input=data&&typeof data==='object'?data:{};let rate=Number(input.rate);if(!Number.isFinite(rate))rate=1;rate=Math.max(.7,Math.min(1.3,Math.round(rate*20)/20));return {textSize:['small','medium','large'].includes(input.textSize)?input.textSize:'medium',voiceURI:typeof input.voiceURI==='string'&&input.voiceURI.length>0&&input.voiceURI.length<=500?input.voiceURI:'auto',rate,creator:typeof input.creator==='string'?input.creator.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,100):''}}
 try{preferences=sanitize(JSON.parse(localStorage.getItem(key)||'null'))}catch{}
 function syncTextSize(){document.documentElement.dataset.readingSize=preferences.textSize;if($('settingsTextSize'))$('settingsTextSize').value=preferences.textSize}
 syncTextSize();
 function save(){try{localStorage.setItem(key,JSON.stringify(preferences))}catch{$('settingsVoiceStatus').textContent='No se pudieron guardar los ajustes en este navegador.'}}
 function voices(){try{return window.speechSynthesis?.getVoices?.()||[]}catch{return []}}
 function voiceKey(voice){return voice.voiceURI||[voice.name||'',voice.lang||''].join('::')}
 function getVoice(){const available=voices(),chosen=available.find(v=>voiceKey(v)===preferences.voiceURI);if(chosen&&preferences.voiceURI!=='auto')return chosen;
  const spanish=available.filter(v=>/^es(?:[-_]|$)/i.test(v.lang||''));if(!spanish.length)return null;const pool=spanish;
  const score=v=>(/premium|enhanced|mejorad|natural|neural/i.test(v.name||'')?100:0)+(/^es[-_]CL$/i.test(v.lang||'')?20:/^es[-_]MX$/i.test(v.lang||'')?12:0)+(v.default?5:0);
  return [...pool].sort((a,b)=>score(b)-score(a))[0]||null;
 }
 function getRate(){return preferences.rate}
 function syncRate(){if(!$('settingsRate'))return;$('settingsRate').value=String(preferences.rate);$('settingsRateValue').textContent=preferences.rate.toFixed(2).replace('.',',')+'×';$('settingsRate').setAttribute('aria-valuetext',preferences.rate.toFixed(2).replace('.',',')+' veces')}
 function refreshVoices(){if(!initialized)return;const select=$('settingsVoice'),all=voices(),spanish=all.filter(v=>/^es(?:[-_]|$)/i.test(v.lang||'')),pool=spanish.length?spanish:all;
  select.innerHTML='';const add=(value,text,disabled=false)=>{const option=document.createElement('option');option.value=value;option.textContent=text;option.disabled=disabled;select.appendChild(option)};
  add('auto','Automática · preferir voz mejorada');
  const used=new Set();for(const voice of [...pool].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es'))){const id=voiceKey(voice);if(used.has(id))continue;used.add(id);add(id,(voice.name||'Voz')+' · '+(voice.lang||'Idioma del dispositivo'))}
  if(preferences.voiceURI!=='auto'&&!pool.some(v=>voiceKey(v)===preferences.voiceURI))add(preferences.voiceURI,'Voz guardada no disponible aquí',true);
  select.value=preferences.voiceURI;
  const synthesis=Boolean(window.speechSynthesis&&window.SpeechSynthesisUtterance);
  select.disabled=!synthesis;$('settingsRate').disabled=!synthesis;$('settingsVoiceTest').disabled=!synthesis;
  $('settingsVoiceHint').textContent=!synthesis?'Este navegador no ofrece lectura en voz alta.':!all.length?'El sistema todavía no ha cargado su lista de voces. Puedes probar la voz predeterminada.':preferences.voiceURI!=='auto'&&!all.some(v=>voiceKey(v)===preferences.voiceURI)?'La voz guardada no está disponible en este dispositivo; se usará la automática.':!spanish.length?'No aparece una voz española en la lista. Se muestran las voces disponibles; Automática solicita lectura en español.':'Se muestran las voces que ofrece tu navegador. Puedes compararlas con Probar voz.';
 }
 function stopPreview(announce=false){previewToken++;clearTimeout(previewTimer);previewTimer=null;if(previewActive)window.speechSynthesis?.cancel();previewActive=false;previewUtterance=null;if($('settingsVoiceTest')){$('settingsVoiceTest').textContent='Probar voz';$('settingsVoiceTest').setAttribute('aria-pressed','false')}if(announce&&$('settingsVoiceStatus'))$('settingsVoiceStatus').textContent='Prueba detenida.'}
 function preview(){if(previewActive){stopPreview(true);return}if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
  if(typeof stopVoice==='function')stopVoice();else window.speechSynthesis.cancel();
  const token=++previewToken,utterance=new window.SpeechSynthesisUtterance('Bienvenido a SurgiPrep. Esta es una prueba de lectura en cirugía general. Elige una voz y una velocidad cómodas para estudiar.');previewUtterance=utterance;
  const voice=getVoice();if(voice)utterance.voice=voice;utterance.lang=voice?.lang||'es-CL';utterance.rate=getRate();previewActive=true;
  $('settingsVoiceTest').textContent='Detener prueba';$('settingsVoiceTest').setAttribute('aria-pressed','true');$('settingsVoiceStatus').textContent='Escuchando la voz seleccionada…';
  const done=message=>{if(token!==previewToken)return;clearTimeout(previewTimer);previewTimer=null;previewActive=false;previewUtterance=null;$('settingsVoiceTest').textContent='Probar voz';$('settingsVoiceTest').setAttribute('aria-pressed','false');$('settingsVoiceStatus').textContent=message};
  utterance.onend=()=>done('Prueba terminada. Esta voz se usará en las siguientes lecturas.');utterance.onerror=()=>done('No se pudo reproducir la prueba. Puedes elegir otra voz y reintentar.');
  previewTimer=setTimeout(()=>{if(token===previewToken){stopPreview();$('settingsVoiceStatus').textContent='La voz no terminó de responder. Puedes reintentar.'}},60000);
  try{window.speechSynthesis.speak(utterance)}catch{utterance.onerror()}
 }
 function isOpen(){return initialized&&!$('settingsOverlay').classList.contains('hidden')}
 function showTutorial(show){$('settingsMain').classList.toggle('hidden',show);$('settingsTutorial').classList.toggle('hidden',!show);$('settingsPopover').scrollTop=0;if(show)$('tutorialTitle').focus();else $('settingsTutorialOpen').focus()}
 function open(){if(!initialized)return;if(typeof stopVoice==='function')stopVoice();showTutorial(false);$('settingsOverlay').classList.remove('hidden');$('settingsButton').setAttribute('aria-expanded','true');document.querySelector('.wrap').inert=true;document.body.classList.add('settingsOpen');if(typeof voiceEnabled!=='undefined'&&voiceEnabled&&typeof voiceMessage==='function')voiceMessage('Audio en pausa. Al avanzar de pregunta continuará la lectura.');refreshVoices();$('settingsClose').focus()}
 function close(){if(!initialized)return;stopPreview();$('settingsOverlay').classList.add('hidden');$('settingsButton').setAttribute('aria-expanded','false');document.querySelector('.wrap').inert=false;document.body.classList.remove('settingsOpen');$('settingsButton').focus()}
 function restorePreferences(data){preferences=sanitize({...data,textSize:data?.textSize??preferences.textSize});syncTextSize();save();if(initialized){$('settingsCreator').value=preferences.creator;syncRate();refreshVoices()}}
 function init(){if(initialized)return;initialized=true;syncTextSize();$('settingsTextSize').onchange=()=>{preferences=sanitize({...preferences,textSize:$('settingsTextSize').value});syncTextSize();save()};$('settingsCreator').value=preferences.creator;syncRate();refreshVoices();
  $('settingsButton').onclick=()=>isOpen()?close():open();$('settingsClose').onclick=close;$('settingsOverlay').onclick=e=>{if(e.target===$('settingsOverlay'))close()};
  $('settingsTutorialOpen').onclick=()=>{stopPreview();showTutorial(true)};$('settingsTutorialBack').onclick=()=>showTutorial(false);
  $('settingsVoice').onchange=()=>{stopPreview();preferences.voiceURI=$('settingsVoice').value;save();refreshVoices();$('settingsVoiceStatus').textContent='Voz guardada para la próxima lectura.'};
  $('settingsRate').oninput=()=>{stopPreview();preferences=sanitize({...preferences,rate:$('settingsRate').value});syncRate();save();$('settingsVoiceStatus').textContent='Velocidad guardada para la próxima lectura.'};
  $('settingsCreator').oninput=()=>{preferences.creator=$('settingsCreator').value.replace(/[\u0000-\u001f\u007f]/g,'').slice(0,100);save()};$('settingsCreator').onchange=()=>{preferences=sanitize({...preferences,creator:$('settingsCreator').value});$('settingsCreator').value=preferences.creator;save()};$('settingsVoiceTest').onclick=preview;
  document.addEventListener('keydown',e=>{if(!isOpen())return;if(e.key==='Escape'){e.preventDefault();close();return}if(e.key!=='Tab')return;
   const elements=[...$('settingsPopover').querySelectorAll('button,select,input,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
   if(!elements.length){e.preventDefault();$('settingsPopover').focus();return}const first=elements[0],last=elements[elements.length-1],active=document.activeElement;
   if(e.shiftKey&&(active===first||!elements.includes(active))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(active===last||!elements.includes(active))){e.preventDefault();first.focus()}
  });
  const synth=window.speechSynthesis;if(synth?.addEventListener)synth.addEventListener('voiceschanged',refreshVoices);else if(synth){const previous=synth.onvoiceschanged;synth.onvoiceschanged=e=>{if(typeof previous==='function')previous.call(synth,e);refreshVoices()}};
  window.addEventListener('pagehide',()=>stopPreview());document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPreview()});
 }
 window.SurgiPrepSettings={init,getVoice,getRate,getPreferences:()=>({...preferences}),restorePreferences,stopPreview,open,close,refreshVoices};
})();
