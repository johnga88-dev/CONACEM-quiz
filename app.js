// The interface owns the visible/spoken letter; source text may already include it.
function optionBody(text,index){let body=String(text??'');const letter=String.fromCharCode(65+index),prefix=new RegExp('^\\s*(?:'+letter+'[.:)]|\\('+letter+'\\))\\s+','i');while(prefix.test(body))body=body.replace(prefix,'');return body}
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function matchesReview(q){let choice=$('reviewSel')?.value||'ALL';return choice==='ALL'||(choice==='pending'?Boolean(q.audit_flag?.pending):!q.audit_flag?.pending)}
function renderReviewDetails(q){
 if(!q.audit_flag?.pending)return '';
 const raw=q.review_notes,notes=(Array.isArray(raw)?raw:typeof raw==='string'?[raw]:[]).filter(n=>typeof n==='string'&&n.trim());
 if(!notes.length)return '';
 return '<details class="sourceCompact auditDetail"><summary>⚠ Observaciones de revisión</summary>'+notes.map(n=>'<div class="srcItem">'+escapeHTML(n)+'</div>').join('')+'</details>';
}
function refreshSubtopics(){let topic=$('topicSel').value;let subs=[...new Set(bank.filter(q=>topic==='ALL'||q.topic===topic).map(q=>q.subtopic))].sort((a,b)=>a.localeCompare(b,'es'));$('subSel').innerHTML='<option value="ALL">Todos los subtemas</option>'+subs.map(s=>'<option>'+escapeHTML(s)+'</option>').join('')}

let activeBankIds=new Set();
function activeStatEntries(){return Object.entries(stats).filter(([id])=>activeBankIds.has(String(id)))}
function activeStats(){return activeStatEntries().map(([,s])=>s)}
let bank=[],byObj={},queue=[],pos=0,mode='study',studyAnswers={},examAnswers={},examFlags={},examFinished=false,sessionCorrect=0,timer=null,deadline=0,selectedDifficulty='ALL',examProfileMode='custom',activeExamSettings=null,examTiming={},examChanges={},shownAt=0,lastShownId=null;const $=id=>document.getElementById(id);const KSTATS='surgiprep700_stats',KREPORT='surgiprep700_reports',KFAV='surgiprep700_favs',KERRORWHY='surgiprep700_errorwhy';// Stored data can be corrupt or come from an imported file: parse defensively and normalize shapes.
function readStored(keys,fallback){for(const k of keys){try{const raw=localStorage.getItem(k);if(raw==null)continue;return JSON.parse(raw)}catch(error){console.warn('Dato local ilegible, se ignora:',k,error)}}return fallback}
function asStats(v){
 const out={};if(!v||typeof v!=='object'||Array.isArray(v))return out;
 const count=x=>{const n=Number(x);return Number.isFinite(n)&&n>=0?Math.min(Number.MAX_SAFE_INTEGER,Math.floor(n)):0};
 for(const[id,s]of Object.entries(v)){
  // Numeric historical IDs remain available; special/prototype keys are never assigned.
  if(!/^[1-9]\d*$/.test(id)||!Number.isSafeInteger(Number(id))||!s||typeof s!=='object'||Array.isArray(s))continue;
  const attempts=count(s.attempts),correct=Math.min(attempts,count(s.correct));
  out[id]={...s,attempts,correct,incorrect:attempts-correct,streak:Math.min(correct,count(s.streak)),nextDue:count(s.nextDue)};
 }return out;
}
function asList(v){return Array.isArray(v)?v.filter(x=>x&&typeof x==='object'):[]}
function asFavs(v){return Array.isArray(v)?[...new Set(v.map(Number).filter(Number.isInteger))]:[]}
let stats=asStats(readStored([KSTATS,'surgiprep670_stats','surgiprep660_stats'],{})),reports=asList(readStored([KREPORT,'surgiprep670_reports','surgiprep660_reports'],[])),favs=asFavs(readStored([KFAV,'surgiprep670_favs','surgiprep660_favs'],[])),errorWhy=asList(readStored([KERRORWHY],[]));let persistWarned=false;function persist(){try{localStorage.setItem(KSTATS,JSON.stringify(stats));localStorage.setItem(KREPORT,JSON.stringify(reports));localStorage.setItem(KFAV,JSON.stringify(favs));localStorage.setItem(KERRORWHY,JSON.stringify(errorWhy));persistWarned=false}catch(error){console.warn('No se pudo guardar el progreso',error);if(!persistWarned&&typeof noticeSession==='function'){persistWarned=true;noticeSession('No se pudo guardar tu progreso en este navegador (almacenamiento lleno o bloqueado). Exporta un respaldo.')}}}function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}function stat(q){return stats[q.id]||{attempts:0,correct:0,incorrect:0,streak:0,nextDue:0,topic:q.topic,difficulty:q.difficulty,objective_id:q.objective_id}}function objectiveAttempts(oid){return activeStats().filter(s=>s.objective_id===oid).reduce((n,s)=>n+s.attempts,0)}function filtered(){let t=$('topicSel').value,ty=$('typeSel')?.value||'ALL',s=$('subSel').value,b=$('blockSel').value,d=selectedDifficulty;return bank.filter(q=>(t==='ALL'||q.topic===t)&&(ty==='ALL'||q.type===ty)&&(s==='ALL'||q.subtopic===s)&&(d==='ALL'||q.difficulty===d)&&(b==='ALL'||String(q.block)===b)&&matchesReview(q))}function pickOnePerObjective(arr){let m={};shuffle(arr).forEach(q=>{if(!m[q.objective_id])m[q.objective_id]=q});return Object.values(m)}function topicPerf(topic,diff=null){let ss=activeStats().filter(s=>s.topic===topic&&(!diff||s.difficulty===diff)),a=ss.reduce((n,s)=>n+s.attempts,0),c=ss.reduce((n,s)=>n+s.correct,0);return{a,c,p:a?100*c/a:0}}// Precomputed indexes: avoid scanning every stat for every question inside sorts (slow on phones).
function objectiveAttemptIndex(){const out={};for(const s of activeStats())out[s.objective_id]=(out[s.objective_id]||0)+s.attempts;return out}
function topicPerfIndex(){const acc={};for(const s of activeStats()){const k=s.topic+'|'+s.difficulty,x=acc[k]??={a:0,c:0};x.a+=s.attempts;x.c+=s.correct}return(topic,diff)=>{const x=acc[topic+'|'+diff]||{a:0,c:0};return{...x,p:x.a?100*x.c/x.a:0}}}
let whyCounts=null;function errorWhyCount(id){if(!whyCounts){whyCounts={};for(const r of errorWhy)whyCounts[r.id]=(whyCounts[r.id]||0)+1}return whyCounts[id]||0}
function adaptiveScore(q){let s=stat(q),err=s.attempts?s.incorrect/s.attempts:0,overdue=s.nextDue&&s.nextDue<Date.now()?1:0,why=errorWhyCount(q.id);return (s.attempts===0?0.35:0)+err*3+overdue*1.5+Math.min(2,why*.5)-Math.min(1,s.streak*.2)}function buildStudy(){stopVoice();clearNotice();sessionId=newSessionId();lastVoiceQuestion=null;mode='study';examFinished=false;activeExamSettings=null;clearInterval(timer);$('resultBox').innerHTML='';let arr=filtered(),kind=$('studySel').value,now=Date.now();if(kind==='cases'){let base=bank.filter(q=>q.case_id&&matchesReview(q)),groups={};base.forEach(q=>(groups[q.case_id]??=[]).push(q));let candidates=Object.values(groups).filter(g=>{let t=$('topicSel').value,b=$('blockSel').value;return (t==='ALL'||g.some(q=>q.topic===t))&&(b==='ALL'||g.some(q=>String(q.block)===b))});if(candidates.length){queue=shuffle(candidates)[0].sort((a,b)=>(a.case_step||0)-(b.case_step||0));}else queue=[];}else{if(kind==='failed')arr=arr.filter(q=>stat(q).incorrect>0);if(kind==='due')arr=arr.filter(q=>stat(q).attempts===0||stat(q).nextDue<=now);if(kind==='weak'){const perf=topicPerfIndex();arr=arr.filter(q=>{let p=perf(q.topic,q.difficulty);return p.a<10||p.p<70})}if(kind==='adaptive'){whyCounts=null;const scores=new Map(arr.map(q=>[q.id,adaptiveScore(q)]));arr=shuffle(arr).sort((a,b)=>scores.get(b.id)-scores.get(a.id))}else if(kind==='new'){const seen=objectiveAttemptIndex();arr=shuffle(arr).sort((a,b)=>(seen[a.objective_id]||0)-(seen[b.objective_id]||0))}else arr=shuffle(arr);queue=arr;}pos=0;studyAnswers={};sessionCorrect=0;$('timerPill').textContent=kind==='cases'?'Caso':'Estudio';$('nav').classList.add('hidden');$('flag').classList.add('hidden');$('finish').classList.add('hidden');render()}function applyModeUI(m){mode=m;$('newSession').classList.toggle('hidden',m==='exam');$('startExam').classList.toggle('hidden',m!=='exam');clearInterval(timer);$('studyMode').classList.toggle('on',m==='study');$('examMode').classList.toggle('on',m==='exam');$('examProfile').classList.toggle('hidden',m!=='exam');$('examConfig').classList.toggle('hidden',m!=='exam');$('studySel').classList.toggle('hidden',m==='exam');$('flag').classList.toggle('hidden',m!=='exam');$('finish').classList.toggle('hidden',m!=='exam')}
function setMode(m,fresh=false,saveCurrent=true){stopVoice();if(saveCurrent)saveSession();applyModeUI(m);if(!fresh&&restoreSession(m))return;sessionId=newSessionId();clearNotice();if(m==='study'){$('studySel').value='random';buildStudy()}else{queue=[];pos=0;examAnswers={};examFlags={};examFinished=false;activeExamSettings=null;lastVoiceQuestion=null;$('question').textContent='Configura el examen y pulsa “Iniciar examen”.';$('options').innerHTML='';$('labs').innerHTML='';$('visual').innerHTML='';$('feedback').className='feedback';$('resultBox').innerHTML='';$('timerPill').textContent='Examen';$('scorePill').textContent='Sin corregir';$('posPill').textContent='0/0';$('blockPill').textContent='Bloque: —';$('meta').innerHTML='';$('nav').classList.add('hidden');$('finish').classList.add('hidden');$('flag').disabled=true;$('fav').disabled=true;$('report').disabled=true;refreshVoice()}if(sessionBankNotice){noticeSession(sessionBankNotice);sessionBankNotice=''}}
function setExamProfile(kind){examProfileMode=kind;$('customExam').classList.toggle('on',kind==='custom');$('realExam').classList.toggle('on',kind==='real');$('simNote').classList.toggle('hidden',kind!=='real');['examCount','examDifficulty','examTime','examCut'].forEach(id=>{$(id).classList.toggle('examLocked',kind==='real');$(id).disabled=kind==='real'});if(kind==='real'){$('examCount').value='100';$('examDifficulty').value='Mixto';$('examTime').value='120';$('examCut').value='65';}}
function balancedRealExam(arr,n=100){let chosen=[],used=new Set(),diffs=['Fácil','Intermedio','Difícil','Muy difícil'],per=Math.floor(n/diffs.length);diffs.forEach(d=>{let pool=shuffle(pickOnePerObjective(arr.filter(q=>q.difficulty===d)));for(let q of pool){if(chosen.filter(x=>x.difficulty===d).length>=per)break;if(!used.has(q.id)){chosen.push(q);used.add(q.id)}}});let rest=shuffle(pickOnePerObjective(arr.filter(q=>!used.has(q.id))));for(let q of rest){if(chosen.length>=n)break;chosen.push(q);used.add(q.id)}return shuffle(chosen).slice(0,n)}
function startExam(){stopVoice();clearNotice();sessionId=newSessionId();lastVoiceQuestion=null;let arr,n,mins;if(examProfileMode==='real'){arr=balancedRealExam(bank.filter(matchesReview),100);n=arr.length;queue=arr;mins=120;}else{let t=$('topicSel').value,ty=$('typeSel')?.value||'ALL',s=$('subSel').value,d=$('examDifficulty').value,b=$('blockSel').value;arr=bank.filter(q=>(t==='ALL'||q.topic===t)&&(ty==='ALL'||q.type===ty)&&(s==='ALL'||q.subtopic===s)&&(d==='Mixto'||q.difficulty===d)&&(b==='ALL'||String(q.block)===b)&&matchesReview(q));arr=pickOnePerObjective(arr);n=Math.min(parseInt($('examCount').value),arr.length);queue=shuffle(arr).slice(0,n);mins=parseInt($('examTime').value);}if(!queue.length){activeExamSettings=null;deadline=0;examFinished=false;pos=0;examAnswers={};examFlags={};clearInterval(timer);$('resultBox').innerHTML='';render();return;}activeExamSettings={profile:examProfileMode,count:queue.length,difficulty:examProfileMode==='real'?'Mixto':$('examDifficulty').value,minutes:mins,cut:examProfileMode==='real'?65:normalizeExamCut($('examCut').value)};pos=0;examAnswers={};examFlags={};examTiming={};examChanges={};shownAt=Date.now();lastShownId=null;examFinished=false;$('resultBox').innerHTML='';$('nav').classList.remove('hidden');$('finish').classList.remove('hidden');deadline=mins?Date.now()+mins*60000:0;clearInterval(timer);if(mins){timer=setInterval(tick,1000);tick()}else $('timerPill').textContent='Sin límite';render()}function tick(){let ms=deadline-Date.now();if(ms<=0){clearInterval(timer);finishExam(true);return}let sec=Math.floor(ms/1000),m=Math.floor(sec/60),s=sec%60;$('timerPill').textContent=`${m}:${String(s).padStart(2,'0')}`}function renderLabs(q){if(!q.labs){$('labs').innerHTML='';return}let h='<div class="labbox"><div class="small">DATOS CLÍNICOS / LABORATORIO</div><div class="labgrid">';Object.entries(q.labs).forEach(([k,o])=>h+=`<div class="lab"><b>${escapeHTML(k)}</b>${escapeHTML(o?.value)}<span class="ref">Normal/referencia: ${escapeHTML(o?.reference)}</span></div>`);h+='</div></div>';$('labs').innerHTML=h}function render(){if(!queue.length){$('question').textContent='No hay preguntas disponibles con este filtro.';['meta','options','visual','feedback','labs'].forEach(id=>$(id).innerHTML='');$('feedback').className='feedback';$('fav').disabled=true;$('flag').disabled=true;$('report').disabled=true;$('whyFailed').classList.add('hidden');$('prev').disabled=true;$('next').disabled=true;$('posPill').textContent='0/0';$('progressBar').style.width='0%';$('blockPill').textContent='Bloque: —';$('finish').classList.add('hidden');refreshVoice();saveSession();return;}$('fav').disabled=false;$('flag').disabled=false;$('report').disabled=false;let q=queue[pos],ans=mode==='study'?studyAnswers[q.id]:examAnswers[q.id];if(mode==='exam'&&!examFinished){let now=Date.now();if(lastShownId!==null&&shownAt){examTiming[lastShownId]=(examTiming[lastShownId]||0)+(now-shownAt)}if(lastShownId!==q.id){lastShownId=q.id;shownAt=now}else shownAt=now}$('meta').innerHTML=`<span class="diff">${escapeHTML(q.difficulty)}</span>${q.audit_flag?.pending?`<span class="auditPending" role="status" title="Pregunta conservada; pendiente de verificación">⚠ Revisión pendiente</span><div class="auditReasons">${(q.audit_flag.reasons||[]).map(escapeHTML).join(' · ')}</div>`:''}${$('studySel')?.value==='cases'&&q.case_id?`<div class="caseNote">Caso encadenado · etapa ${q.case_step}/${q.case_total}</div>`:''}`;$('question').textContent=q.question;renderLabs(q);$('visual').innerHTML=q.image?`<img class="visual" src="${escapeHTML(q.image)}" alt="Imagen clínica o esquema asociado a la pregunta" onclick="openImage(this.src)"><div class="imageZoomHint">Toca la imagen para ampliarla</div>`:'';$('options').innerHTML='';$('feedback').className='feedback';q.options.forEach((o,i)=>{let b=document.createElement('button');b.className='opt';b.innerHTML=`<span class="radio"></span><span><strong>${String.fromCharCode(65+i)}.</strong> ${escapeHTML(optionBody(o,i))}</span>`;if(mode==='study'&&ans!==undefined){if(i===q.answer)b.classList.add('good');if(i===ans&&i!==q.answer)b.classList.add('bad');b.disabled=true}if(mode==='exam'&&examAnswers[q.id]===i)b.classList.add('sel');if(mode==='exam'&&examFinished){b.classList.remove('sel');if(i===q.answer)b.classList.add('good');if(i===examAnswers[q.id]&&i!==q.answer)b.classList.add('bad');b.disabled=true}b.onclick=()=>{if(voiceEnabled)readVoiceSection('alternatives');else choose(i)};$('options').appendChild(b)});if((mode==='study'&&ans!==undefined)||(mode==='exam'&&examFinished))showFeedback(q,mode==='study'?ans:examAnswers[q.id]);$('prev').disabled=pos===0;$('next').disabled=pos>=queue.length-1;$('posPill').textContent=`${pos+1}/${queue.length}`;$('progressBar').style.width=`${100*(pos+1)/queue.length}%`;$('blockPill').textContent=`Bloque: ${q.block}`;if(mode==='study'){let n=Object.keys(studyAnswers).length;$('scorePill').textContent=`${sessionCorrect}/${n}`}else{$('scorePill').textContent=examFinished?'Corregido':`${Object.keys(examAnswers).length}/${queue.length}`;renderNav()}$('flag').textContent=examFlags[q.id]?'⚑ Marcada':'⚑ Revisar';$('fav').textContent=favs.includes(q.id)?'★ Favorito':'☆ Favorito';let wrongAnswered=(mode==='study'&&ans!==undefined&&ans!==q.answer)||(mode==='exam'&&examFinished&&examAnswers[q.id]!==undefined&&examAnswers[q.id]!==q.answer);$('whyFailed').classList.toggle('hidden',!wrongAnswered);$('flag').disabled=mode==='exam'&&examFinished;refreshVoice();saveSession()}function navigateQuestion(delta){
 if(!Number.isInteger(delta)||Math.abs(delta)!==1||activePanel!=='quiz')return;
 const nextPosition=pos+delta;if(nextPosition<0||nextPosition>=queue.length)return;
 pos=nextPosition;render();
 const id=queue[pos]?.id,turnSession=sessionId;
 requestAnimationFrame(()=>{
  if(activePanel!=='quiz'||sessionId!==turnSession||queue[pos]?.id!==id||document.hidden)return;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  $('qcard').scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
 });
}
function setupQuestionSwipes(){
 const card=$('qcard');let gesture=null,lastSwipeAt=0;
 const controls='button,a,input,select,textarea,summary,img,video,audio,[contenteditable="true"]';
 card.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch'||!e.isPrimary){gesture=null;return}
  if(activePanel!=='quiz'||e.target.closest?.(controls)||e.clientX<24||e.clientX>window.innerWidth-24){gesture=null;return}
  gesture={id:e.pointerId,x:e.clientX,y:e.clientY,at:Date.now(),questionId:queue[pos]?.id,session:sessionId};
 },{passive:true});
 card.addEventListener('pointercancel',()=>{gesture=null},{passive:true});
 card.addEventListener('pointerup',e=>{
  const start=gesture;gesture=null;
  if(!start||start.id!==e.pointerId||e.pointerType!=='touch'||activePanel!=='quiz'||document.hidden||start.session!==sessionId||start.questionId!==queue[pos]?.id)return;
  if(e.target.closest?.(controls)||window.getSelection?.()?.isCollapsed===false)return;
  const dx=e.clientX-start.x,dy=e.clientY-start.y;
  if(Date.now()-start.at>700||Math.abs(dx)<70||Math.abs(dy)>60||Math.abs(dx)<Math.abs(dy)*1.6)return;
  const delta=dx<0?1:-1;
  if(pos+delta<0||pos+delta>=queue.length)return;
  lastSwipeAt=Date.now();navigateQuestion(delta);
 },{passive:true});
 // A completed swipe must not also trigger the section's playback click.
 card.addEventListener('click',e=>{if(e.detail>0&&Date.now()-lastSwipeAt<400){e.preventDefault();e.stopImmediatePropagation()}},true);
}
function choose(i){
 if(!queue[pos]||!Number.isInteger(i)||i<0||i>=queue[pos].options.length)return;
 if(mode==='exam'&&!examFinished&&deadline&&Date.now()>=deadline){finishExam(true);return}
 const q=queue[pos];if((mode==='study'&&studyAnswers[q.id]!==undefined)||(mode==='exam'&&examFinished))return;
 stopVoice();
 if(mode==='study'){studyAnswers[q.id]=i;const ok=i===q.answer;if(ok)sessionCorrect++;record(q,ok);saveSession();render();revealExplanation(q.id,sessionId)}
 else{if(examAnswers[q.id]!==undefined&&examAnswers[q.id]!==i)examChanges[q.id]=(examChanges[q.id]||0)+1;examAnswers[q.id]=i;saveSession();render()}
 voiceAfterAnswer(q,i);
}function revealExplanation(questionId,answerSessionId){
 requestAnimationFrame(()=>{
  if(mode!=='study'||activePanel!=='quiz'||sessionId!==answerSessionId||queue[pos]?.id!==questionId||studyAnswers[questionId]===undefined||document.hidden)return;
  const feedback=$('feedback');
  if(!feedback?.classList.contains('show'))return;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  feedback.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
 });
}
function record(q,ok,examToken=null){let s=stat(q);if(examToken&&s.lastExamSessionToken===examToken)return;s.attempts++;if(ok){s.correct++;s.streak++}else{s.incorrect++;s.streak=0}let days=ok?(s.streak===1?1:s.streak===2?3:s.streak===3?7:Math.min(60,(s.intervalDays||7)*2)):1;s.intervalDays=days;s.nextDue=Date.now()+days*86400000;if(examToken)s.lastExamSessionToken=examToken;stats[q.id]=s;persist()}function showFeedback(q,selected){let ok=selected===q.answer,h=`<strong>${ok?'✅ Correcto':'❌ Incorrecto'}</strong><div class="rationale explanationText"><strong>Explicación:</strong> ${escapeHTML(q.explanation)}</div><section class="alternativeAnalysis" id="alternativeAnalysis"><button type="button" class="analysisToggle" id="analysisToggle" aria-expanded="false" aria-controls="analysisPanel"><span>Análisis de alternativas</span><svg class="analysisChevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="analysisPanel" id="analysisPanel" role="region" aria-labelledby="analysisToggle" aria-hidden="true" inert><div class="analysisClip"><div class="analysisContent">`;q.options.forEach((o,i)=>{h+=`<div style="margin-top:7px"><b>${String.fromCharCode(65+i)}.</b> ${escapeHTML(optionBody(q.rationales?.[i]||'Análisis individual pendiente de revisión.',i))}</div>`});h+='</div></div></div></section>';h+=renderReviewDetails(q);if(q.sources?.length){h+='<details class="sourceCompact"><summary>📚 Referencias bibliográficas de revisión</summary>';q.sources.forEach(raw=>{let src=typeof raw==='string'?{name:raw}:raw;if(!src)return;let name=src.name||src.title||src.code||'Referencia aportada',url=String(src.url||''),label=/^https?:\/\//.test(url)?`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(name)}</a>`:escapeHTML(name),excerpt=src.excerpt||src.access||'';h+=`<div class="srcItem">${label}${excerpt?`<div style="margin-top:3px;color:#94a3b8">${escapeHTML(excerpt)}</div>`:''}</div>`});h+='</details>'}$('feedback').className='feedback show '+(ok?'good':'bad');$('feedback').innerHTML=h;
 const analysis=$('alternativeAnalysis'),toggle=$('analysisToggle'),panel=$('analysisPanel');
 toggle.onclick=()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open));panel.inert=!open;analysis.classList.toggle('is-open',open)};
}
function renderNav(){let h='';queue.forEach((q,i)=>{let cl='';if(examAnswers[q.id]!==undefined)cl+=' answered';if(examFlags[q.id])cl+=' flag';if(i===pos)cl+=' cur';h+=`<button class="${cl}" onclick="pos=${i};render()">${i+1}</button>`});$('nav').innerHTML=h}function finishExam(auto=false,restoreOnly=false){if((examFinished&&!restoreOnly)||!queue.length)return;if(!auto&&!restoreOnly&&!confirm('¿Finalizar y corregir el examen?'))return;stopVoice();let now=Date.now();if(!restoreOnly&&lastShownId!==null&&shownAt)examTiming[lastShownId]=(examTiming[lastShownId]||0)+(now-shownAt);clearInterval(timer);examFinished=true;lastVoiceQuestion=queue[pos]?sessionId+':'+mode+':'+queue[pos].id+':true':null;let c=0,by={},byType={},byDiff={};queue.forEach(q=>{let ok=examAnswers[q.id]===q.answer;if(ok)c++;let k=q.topic+'|'+q.difficulty;(by[k]??={n:0,c:0,topic:q.topic,diff:q.difficulty}).n++;if(ok)by[k].c++;(byType[q.type]??={n:0,c:0}).n++;if(ok)byType[q.type].c++;(byDiff[q.difficulty]??={n:0,c:0}).n++;if(ok)byDiff[q.difficulty].c++;if(!restoreOnly)record(q,ok,sessionId)});saveSession();let p=Math.round(100*c/queue.length),cut=activeExamSettings?.cut??(examProfileMode==='real'?65:normalizeExamCut($('examCut').value)),wrong=queue.length-c,unanswered=queue.filter(q=>examAnswers[q.id]===undefined).length,totalMs=Object.values(examTiming).reduce((a,b)=>a+b,0),answeredN=Math.max(1,Object.keys(examAnswers).length),avgSec=Math.round(totalMs/answeredN/1000),changes=Object.values(examChanges).reduce((a,b)=>a+b,0),h=`<div class="result"><div class="score">${p}%</div><b>${c}/${queue.length}</b> · ${p>=cut?'✅ APROBADO':'❌ BAJO CORTE'} (corte ${cut}%)<div class="examSummary"><div class="examStat"><b>${c}</b><span>Correctas</span></div><div class="examStat"><b>${wrong}</b><span>Incorrectas</span></div><div class="examStat"><b>${unanswered}</b><span>Sin responder</span></div><div class="examStat"><b>${avgSec}s</b><span>Promedio/pregunta</span></div><div class="examStat"><b>${changes}</b><span>Cambios de respuesta</span></div><div class="examStat"><b>${Object.values(examFlags).filter(Boolean).length}</b><span>Marcadas</span></div></div><h3>Por tipo de pregunta</h3>`;Object.entries(byType).forEach(([t,v])=>h+=`<div class="topicrow"><div class="topichead"><b>${escapeHTML(t)}</b><span>${Math.round(100*v.c/v.n)}%</span></div><div class="small">${v.c}/${v.n}</div></div>`);h+='<h3>Por dificultad</h3>';['Fácil','Intermedio','Difícil','Muy difícil'].forEach(d=>{let v=byDiff[d];if(v)h+=`<div class="topicrow"><div class="topichead"><b>${d}</b><span>${Math.round(100*v.c/v.n)}%</span></div><div class="small">${v.c}/${v.n}</div></div>`});h+='<h3>Por tema y dificultad</h3>';Object.values(by).sort((a,b)=>a.topic.localeCompare(b.topic)).forEach(v=>h+=`<div class="topicrow"><div class="topichead"><b>${escapeHTML(v.topic)}</b><span>${escapeHTML(v.diff)} ·${Math.round(100*v.c/v.n)}%</span></div><div class="small">${v.c}/${v.n}</div></div>`);h+='<h3>Revisión rápida</h3><div class="reviewList">';queue.slice(0,20).forEach((q,i)=>{let ok=examAnswers[q.id]===q.answer;h+=`<div class="reviewItem ${ok?'good':'bad'}"><b>${i+1}. ${ok?'Correcta':'Incorrecta'}</b><div class="small">${escapeHTML(q.topic)} · ${escapeHTML(q.type)} · ${escapeHTML(q.difficulty)}</div></div>`});h+='</div></div>';$('resultBox').innerHTML=h;$('timerPill').textContent=auto?'Agotado':'Finalizado';render();$('finish').classList.add('hidden');renderDashboard();window.scrollTo({top:0,behavior:'smooth'})}function renderDashboard(){let ss=activeStats(),a=ss.reduce((n,s)=>n+s.attempts,0),c=ss.reduce((n,s)=>n+s.correct,0);$('global').textContent=a?Math.round(100*c/a)+'%':'0%';$('attempts').textContent=a;let topics=[...new Set(bank.map(q=>q.topic))],dom=0,weak=0,h='';topics.forEach(t=>{let p=topicPerf(t);let st=p.a>=20&&p.p>=85?'Dominado':p.p>=70?'En progreso':'Débil';if(st==='Dominado')dom++;if(st==='Débil')weak++;let cls=st==='Dominado'?'strong':st==='En progreso'?'mid':'weak';h+=`<div class="topicrow"><div class="topichead"><b>${escapeHTML(t)}</b><span class="${cls}">${p.a?Math.round(p.p):0}% · ${st}</span></div>`;['Fácil','Intermedio','Difícil','Muy difícil'].forEach(d=>{let x=topicPerf(t,d);h+=`<div class="small" style="margin-top:4px">${d}: ${x.a?Math.round(x.p):0}% (${x.c}/${x.a})</div>`});h+=`<div class="bar"><span style="width:${Math.min(100,p.p)}%"></span></div></div>`});$('dominated').textContent=dom;$('weakN').textContent=weak;$('topicStats').innerHTML=h;let types=['Caso clínico','Teoría','Técnica','Imagenología'],th='';types.forEach(t=>{let qs=bank.filter(q=>q.type===t),ids=new Set(qs.map(q=>String(q.id))),x=Object.entries(stats).filter(([id])=>ids.has(String(id))),aa=x.reduce((n,[,s])=>n+s.attempts,0),cc=x.reduce((n,[,s])=>n+s.correct,0),pp=aa?Math.round(100*cc/aa):0;th+=`<div class="topicrow"><div class="topichead"><b>${t}</b><span>${pp}%</span></div><div class="small">${cc}/${aa} correctas</div><div class="bar"><span style="width:${pp}%"></span></div></div>`});$('typeStats').innerHTML=th;let rank={'Fácil':1,'Intermedio':2,'Difícil':3,'Muy difícil':4},emp=[];bank.forEach(q=>{let st=stats[q.id];if(st&&st.attempts>=3){let acc=100*st.correct/st.attempts,ed=acc>=85?1:acc>=70?2:acc>=50?3:4;if(ed!==rank[q.difficulty])emp.push({q,acc,ed})}});emp.sort((a,b)=>Math.abs(rank[b.q.difficulty]-b.ed)-Math.abs(rank[a.q.difficulty]-a.ed)||a.acc-b.acc);$('empiricalStats').innerHTML=emp.length?emp.slice(0,12).map(x=>`<div class="listitem"><div class="topichead"><b>Pregunta ${x.q.id}</b><span>${Math.round(x.acc)}% acierto</span></div><div class="small">Editorial: ${x.q.difficulty} · Empírica sugerida: ${['','Fácil','Intermedio','Difícil','Muy difícil'][x.ed]}</div></div>`).join(''):'<div class="small">Se necesitan al menos 3 intentos por pregunta para estimar dificultad empírica.</div>';let chart='';topics.map(t=>({t,...topicPerf(t)})).sort((a,b)=>b.p-a.p).slice(0,10).forEach(x=>{chart+=`<div class="chartrow"><div class="chartlabel">${escapeHTML(x.t)}</div><div class="charttrack"><div class="chartfill" style="width:${Math.min(100,x.p)}%"></div></div><div class="chartpct">${x.a?Math.round(x.p):0}%</div></div>`});if($('topicChart'))$('topicChart').innerHTML=chart}function renderErrors(){let arr=activeStatEntries().filter(([id,st])=>st.incorrect>0).sort((a,b)=>b[1].incorrect-a[1].incorrect),counts={};errorWhy.filter(r=>activeBankIds.has(String(r.id))).forEach(r=>counts[r.reason]=(counts[r.reason]||0)+1);$('errorSummary').innerHTML=Object.keys(counts).length?`<div class="chartbox"><b>Patrón de errores identificado</b><div style="margin-top:7px">${Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span class="errorTag">${escapeHTML(k)}: ${v}</span>`).join('')}</div></div>`:'<div class="small">Cuando falles una pregunta, usa “¿Por qué fallé?” para identificar el patrón de error.</div>';$('errorList').innerHTML=arr.length?arr.map(([id,st])=>{let q=bank.find(x=>x.id==id),why=errorWhy.filter(r=>String(r.id)===String(id)).slice(-2);return `<div class="listitem"><div class="topichead"><b>${escapeHTML(q?.topic)} › ${escapeHTML(q?.subtopic)}</b><span class="weak">${st.incorrect} fallos</span></div><div class="small">${escapeHTML(q?.difficulty)} · ${st.correct}/${st.attempts} correctas</div><div style="margin-top:6px">${escapeHTML(q?.question)}</div>${why.length?`<div style="margin-top:7px">${why.map(w=>`<span class="errorTag">${escapeHTML(w.reason)}</span>`).join('')}</div>`:''}</div>`}).join(''):'<div class="listitem">Sin errores registrados.</div>'}function renderFavs(){const visibleFavs=favs.filter(id=>activeBankIds.has(String(id)));$('favList').innerHTML=visibleFavs.length?visibleFavs.map(id=>{let q=bank.find(x=>x.id===id);return q?`<div class="listitem"><b>Pregunta ${q.id} · ${escapeHTML(q.topic)}</b><div class="small">${escapeHTML(q.subtopic)} · ${escapeHTML(q.difficulty)}</div><div>${escapeHTML(q.question)}</div></div>`:''}).join(''):'<div class="listitem">Sin favoritos.</div>'}function renderReports(){const visibleReports=reports.filter(r=>activeBankIds.has(String(r.id)));$('reportList').innerHTML=visibleReports.length?visibleReports.slice().reverse().map(r=>`<div class="listitem"><div class="topichead"><b>Pregunta ${escapeHTML(r.id)}</b><span>${escapeHTML(r.reason)}</span></div><div class="small">${escapeHTML(r.topic)} · ${escapeHTML(r.difficulty)} · ${escapeHTML(new Date(r.date).toLocaleString())}</div><div>${escapeHTML(r.text||'Sin nota')}</div></div>`).join(''):'<div class="listitem">Sin reportes.</div>'}function showPanel(id){activePanel=id;if(id!=='quiz')stopVoice();document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('on'));$(id).classList.add('on');document.querySelector(`.tabs button[data-panel="${id}"]`).classList.add('on');if(id==='dashboard')renderDashboard();if(id==='errors')renderErrors();if(id==='favorites')renderFavs();if(id==='reports')renderReports();saveSession()}function download(obj,name){let blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),30000)}let zoomScale=1;function openImage(src){stopVoice();zoomScale=1;$('imageZoom').src=src;$('imageZoom').style.transform='scale(1)';$('imageModal').classList.add('show')}function setZoom(delta){zoomScale=Math.max(1,Math.min(4,zoomScale+delta));$('imageZoom').style.transform=`scale(${zoomScale})`; $('zoomReset').textContent=zoomScale.toFixed(1)+'×'}// Session state and voice controls. Shares the quiz's lexical state in app.js.
const SESSION_KEYS={study:'surgiprep_session_v1_study',exam:'surgiprep_session_v1_exam'},LAST_MODE_KEY='surgiprep_last_mode_v1';
let sessionReady=false,restoringSession=false,sessionId='',activePanel='quiz',sessionBankNotice='';
function localRead(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function localWrite(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
function newSessionId(){return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}
function checkpointTime(){if(mode==='exam'&&!examFinished&&lastShownId!==null&&shownAt){const now=Date.now();examTiming[lastShownId]=(examTiming[lastShownId]||0)+Math.max(0,now-shownAt);shownAt=now}}
function snapshotSession(){return {schema:1,sessionId,mode,savedAt:Date.now(),queueIds:queue.map(q=>q.id),position:pos,studyAnswers:{...studyAnswers},examAnswers:{...examAnswers},examFlags:{...examFlags},examFinished,examTiming:{...examTiming},examChanges:{...examChanges},deadline,examProfileMode,activeExamSettings:activeExamSettings?{...activeExamSettings}:null,selectedDifficulty,panel:activePanel,filters:Object.fromEntries(['topicSel','subSel','blockSel','reviewSel','typeSel','studySel'].map(id=>[id,$(id).value])),settings:Object.fromEntries(['examCount','examDifficulty','examTime','examCut'].map(id=>[id,$(id).value]))}}
function saveSession(){if(!sessionReady||restoringSession||!sessionId||(mode==='exam'&&!queue.length))return;checkpointTime();const data=snapshotSession();if(localWrite(SESSION_KEYS[mode],data))localWrite(LAST_MODE_KEY,mode);else noticeSession('No se pudo guardar la sesión en este navegador. Puedes exportar un respaldo.');}
function noticeSession(message){$('sessionNoticeText').textContent=message;$('sessionNotice').classList.remove('hidden')}
function clearNotice(){$('sessionNotice').classList.add('hidden')}
function preferredSessionMode(){const saved=localRead(LAST_MODE_KEY);return saved==='exam'?'exam':'study'}
function cleanAnswerMap(obj,ids){const out={};if(!obj||typeof obj!=='object'||Array.isArray(obj))return out;for(const [id,value]of Object.entries(obj)){if(ids.has(String(id))&&Number.isInteger(value)&&value>=0&&value<5)out[id]=value}return out}
function normalizeExamCut(value){const n=Number(value);return [65,70,75].includes(n)?n:65}
function restoreSession(target){const data=localRead(SESSION_KEYS[target]);if(!data||data.schema!==1||data.mode!==target||!Array.isArray(data.queueIds)||(target==='exam'&&!data.queueIds.length)||data.queueIds.length>30000)return false;
 const lookup=new Map(bank.map(q=>[q.id,q]));if(data.queueIds.some(id=>!Number.isInteger(id))||new Set(data.queueIds).size!==data.queueIds.length)return false;
 const oldIds=data.queueIds,retained=oldIds.filter(id=>lookup.has(id));
 if(retained.length!==oldIds.length){
  if(target==='exam'){sessionBankNotice='El examen guardado contiene preguntas retiradas. Inicia un examen nuevo; tu historial se conserva.';return false}
  if(!retained.length){sessionBankNotice='Las preguntas de la sesión anterior fueron retiradas. Se ha preparado una sesión nueva.';return false}
  const oldPos=Math.max(0,Math.min(oldIds.length-1,Number.isInteger(data.position)?data.position:0));
  const anchor=oldIds.slice(oldPos).find(id=>lookup.has(id));
  data.queueIds=retained;data.position=anchor===undefined?retained.length-1:retained.indexOf(anchor);
 }

 restoringSession=true;
 try{
  applyModeUI(target);sessionId=typeof data.sessionId==='string'&&data.sessionId.length<100?data.sessionId:newSessionId();
  for(const id of ['topicSel','blockSel','reviewSel','typeSel','studySel'])if(typeof data.filters?.[id]==='string'){$(id).value=data.filters[id];if(!$(id).value)$(id).value=id==='studySel'?'random':'ALL'}refreshSubtopics();if(typeof data.filters?.subSel==='string'){$('subSel').value=data.filters.subSel;if(!$('subSel').value)$('subSel').value='ALL'};
  selectedDifficulty=['ALL','Fácil','Intermedio','Difícil','Muy difícil'].includes(data.selectedDifficulty)?data.selectedDifficulty:'ALL';document.querySelectorAll('.diffCard').forEach(card=>{const on=card.dataset.d===selectedDifficulty;card.classList.toggle('on',on);card.setAttribute('aria-pressed',String(on))});
  setExamProfile(data.examProfileMode==='real'?'real':'custom');for(const id of ['examCount','examDifficulty','examTime','examCut'])if(typeof data.settings?.[id]==='string')$(id).value=data.settings[id];if(examProfileMode==='real')setExamProfile('real');
  // Old sessions have no activeExamSettings: migrate once from their saved configuration.
  const savedConfig=data.activeExamSettings,oldProfile=data.examProfileMode==='real'?'real':'custom';
  activeExamSettings=target==='exam'?{profile:savedConfig?.profile==='real'?'real':savedConfig?.profile==='custom'?'custom':oldProfile,count:data.queueIds.length,difficulty:typeof savedConfig?.difficulty==='string'?savedConfig.difficulty:(data.settings?.examDifficulty||'Mixto'),minutes:[0,30,60,120].includes(Number(savedConfig?.minutes))?Number(savedConfig.minutes):[0,30,60,120].includes(Number(data.settings?.examTime))?Number(data.settings.examTime):0,cut:savedConfig?.profile==='real'||(!savedConfig&&oldProfile==='real')?65:normalizeExamCut(savedConfig?.cut??data.settings?.examCut)}:null;
  queue=data.queueIds.map(id=>lookup.get(id));pos=Math.max(0,Math.min(queue.length-1,Math.max(0,Number.isInteger(data.position)?data.position:0)));const ids=new Set(queue.map(q=>String(q.id)));studyAnswers=cleanAnswerMap(data.studyAnswers,ids);examAnswers=cleanAnswerMap(data.examAnswers,ids);examFlags={};for(const[id,value]of Object.entries(data.examFlags||{}))if(ids.has(String(id))&&value===true)examFlags[id]=true;
  examTiming={};examChanges={};for(const[id,value]of Object.entries(data.examTiming||{}))if(ids.has(String(id))&&Number.isFinite(value)&&value>=0)examTiming[id]=value;for(const[id,value]of Object.entries(data.examChanges||{}))if(ids.has(String(id))&&Number.isInteger(value)&&value>=0)examChanges[id]=value;
  sessionCorrect=queue.filter(q=>studyAnswers[q.id]===q.answer).length;examFinished=target==='exam'&&data.examFinished===true;deadline=Number.isFinite(data.deadline)&&data.deadline>0?data.deadline:0;lastShownId=null;shownAt=Date.now();clearInterval(timer);$('resultBox').innerHTML='';
  $('nav').classList.toggle('hidden',target!=='exam');$('flag').classList.toggle('hidden',target!=='exam');$('finish').classList.toggle('hidden',target!=='exam'||examFinished);$('timerPill').textContent=target==='study'?'Estudio':deadline?'Examen':'Sin límite';
  if(target==='exam'&&examFinished)finishExam(false,true);else if(target==='exam'&&deadline&&deadline<=Date.now())finishExam(true);else{render();if(target==='exam'&&deadline){timer=setInterval(tick,1000);tick()}}
  activePanel=['quiz','dashboard','errors','favorites','reports'].includes(data.panel)?data.panel:'quiz';showPanel(activePanel);
  noticeSession((queue.length?(retained.length!==oldIds.length?'Sesión ajustada al banco actual · ':'Sesión recuperada · '):'Filtros recuperados sin preguntas · ')+(target==='study'?'Estudio':'Examen')+' · pregunta '+(queue.length?pos+1:0)+' de '+queue.length+(target==='exam'&&deadline?' · el reloj continúa al cerrar.':'.'));
  window.dispatchEvent(new Event('surgiprep-session-restored'));return true;
 }catch(error){console.warn('No se pudo recuperar la sesión',error);queue=[];return false}finally{restoringSession=false;saveSession()}
}
function startFreshSession(){stopVoice();clearNotice();try{localStorage.removeItem(SESSION_KEYS[mode])}catch{}queue=[];sessionId='';setMode(mode,true)}
function setupEnhancements(){sessionReady=true;$('dismissSession').onclick=clearNotice;setupVoice();setupQuestionSwipes();window.SurgiPrepSettings?.init();window.addEventListener('pagehide',()=>{checkpointTime();saveSession();shownAt=0;stopVoice()});document.addEventListener('visibilitychange',()=>{if(document.hidden){checkpointTime();saveSession();shownAt=0;stopVoice()}else{shownAt=Date.now();if(mode==='exam'&&!examFinished&&queue.length&&deadline)tick()}});}
// One enabled audio session, with cancellable reading -> delay -> recognition turns.
// A fresh recognizer is created for every answer, never kept alive during synthesis.
let recognizer=null,voiceEpoch=0,lastVoiceQuestion=null,voiceEnabled=false,
 voicePhase='off',voiceDelay=null,voiceWatchdog=null,currentUtterance=null,
 voicePaused=null,voiceSpeech=null,voiceDelayDeadline=0;
function voiceMessage(message){$('voiceStatus').textContent=message;$('voiceStatus').classList.toggle('hidden',!message)}
function updateAudioButton(){const button=$('audioToggle');if(!button)return;
 const unavailable=!queue[pos]||!window.speechSynthesis||typeof window.SpeechSynthesisUtterance!=='function';
 button.disabled=false;button.classList.toggle('on',voiceEnabled);button.classList.toggle('listening',voicePhase==='listening');
 button.setAttribute('aria-label','Controles de audio');button.title='Controles de audio';button.dataset.phase=voicePhase;
 const busy=voiceEnabled&&['reading','explanation','verdict','waiting','starting','listening'].includes(voicePhase);
 const label=busy?'Pausar':voicePaused?'Continuar':'Reproducir';
 $('audioPlayIcon').innerHTML=busy?'<svg class="audioPauseBars" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" fill="#ffffff"/><rect x="14" y="4" width="4" height="16" rx="1" fill="#ffffff"/></svg>':'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5v14l11-7Z" fill="currentColor"/></svg>';$('audioPlayLabel').textContent=label;$('audioPlayLabel').classList.add('sr-only');
 $('audioPlay').setAttribute('aria-label',label);$('audioPlay').title=label;$('audioPlay').disabled=unavailable;
 $('audioPlay').setAttribute('aria-pressed',String(busy));
 $('audioStop').disabled=!voiceEnabled;$('audioRepeat').disabled=unavailable;
 $('qcard').classList.toggle('audioSectionMode',voiceEnabled);
 const question=$('question');question.tabIndex=voiceEnabled?0:-1;
 if(voiceEnabled){question.setAttribute('role','button');question.setAttribute('aria-label','Escuchar solo el enunciado: '+(queue[pos]?.question||''))}else{question.removeAttribute('role');question.removeAttribute('aria-label')}
 const locked=Boolean(queue[pos]&&(mode==='study'?studyAnswers[queue[pos].id]!==undefined:examFinished));
 for(const option of $('options').children){option.disabled=locked&&!voiceEnabled;if(voiceEnabled)option.setAttribute('aria-label','Leer las cinco alternativas: '+option.textContent);else option.removeAttribute('aria-label')}
 const explanation=$('feedback').querySelector?.('.explanationText');if(explanation){explanation.tabIndex=voiceEnabled?0:-1;if(voiceEnabled){explanation.setAttribute('role','button');explanation.setAttribute('aria-label','Escuchar solo la explicación')}else{explanation.removeAttribute('role');explanation.removeAttribute('aria-label')}}

}
function setAudioMenu(open,focus=false){$('audioMenu').classList.toggle('hidden',!open);$('audioToggle').setAttribute('aria-expanded',String(open));if(focus)(open?$('audioPlay'):$('audioToggle')).focus()}
function stopAudio(){voiceEnabled=false;stopVoice();voiceMessage('Modo audio detenido.');}
function pauseAudio(){if(!voiceEnabled)return;
 if(['reading','explanation','verdict'].includes(voicePhase)&&currentUtterance){
  if(typeof window.speechSynthesis.pause!=='function'||typeof window.speechSynthesis.resume!=='function'){voiceMessage('Este navegador no permite pausar. Puedes usar Parar o Repetir.');return}
  const state={kind:'speech',phase:voicePhase,message:$('voiceStatus').textContent};voicePaused=state;voicePhase='paused';
  clearTimeout(voiceWatchdog);voiceWatchdog=null;
  try{window.speechSynthesis.pause()}catch{voicePaused=null;voicePhase=state.phase;voiceSpeech?.arm();voiceMessage('No se pudo pausar la lectura.');updateAudioButton();return}
 }else if(voicePhase==='waiting'){
  voicePaused={kind:'waiting',remaining:Math.max(0,voiceDelayDeadline-Date.now())};clearTimeout(voiceDelay);voiceDelay=null;voicePhase='paused';
 }else if(['starting','listening'].includes(voicePhase)){
  stopVoice();voicePaused={kind:'listening'};voicePhase='paused';
 }else return;
 voiceMessage('Audio en pausa. Pulsa Continuar para retomar.');updateAudioButton();
}
function resumeAudio(){const state=voicePaused;if(!state)return;voicePaused=null;
 if(state.kind==='speech'){
  voicePhase=state.phase;voiceMessage(state.message);updateAudioButton();
  try{window.speechSynthesis.resume()}catch{voiceFailure('No se pudo continuar. Pulsa Repetir para reiniciar.');return}
  // An end event can race with pause. Continue the remaining chunks only after explicit resume.
  if(voiceSpeech?.deferred){const next=voiceSpeech.deferred;voiceSpeech.deferred=null;next()}else voiceSpeech?.arm();
 }else if(state.kind==='waiting')scheduleVoiceListen(state.remaining);
 else if(state.kind==='listening')listenAnswer();
}
function toggleAudioPlayback(){if(!queue[pos]||activePanel!=='quiz'||document.hidden)return;
 if(voicePaused){resumeAudio();return}
 if(voiceEnabled&&['reading','explanation','verdict','waiting','starting','listening'].includes(voicePhase)){pauseAudio();return}
 voiceEnabled=true;readQuestion();
}
function repeatAudio(){if(!queue[pos]||activePanel!=='quiz'||document.hidden)return;voiceEnabled=true;readQuestion()}
function scheduleVoiceListen(delay=2000){const token=voiceEpoch,id=queue[pos]?.id;
 voicePhase='waiting';voiceMessage('Micrófono en dos segundos…');updateAudioButton();voiceDelayDeadline=Date.now()+delay;
 voiceDelay=setTimeout(()=>{voiceDelay=null;if(voiceContextOK(token,id)&&!voicePaused)listenAnswer()},delay);
}
function stopVoice(announce=false){window.SurgiPrepSettings?.stopPreview();voiceEpoch++;clearTimeout(voiceDelay);clearTimeout(voiceWatchdog);voiceDelay=null;voiceWatchdog=null;
 const previous=recognizer;recognizer=null;if(previous){try{previous.abort()}catch{}}
 voicePaused=null;voiceSpeech=null;voiceDelayDeadline=0;
 if(window.speechSynthesis){window.speechSynthesis.cancel();if(window.speechSynthesis.paused)window.speechSynthesis.resume?.()}currentUtterance=null;
 voicePhase=voiceEnabled?'paused':'off';$('voiceRetry')?.classList.add('hidden');updateAudioButton();
 if(announce)voiceMessage(voiceEnabled?'Audio interrumpido. Pulsa Reproducir o avanza de pregunta para continuar.':'Modo audio desactivado.');
}
function voiceContextOK(token,id){return token===voiceEpoch&&voiceEnabled&&queue[pos]?.id===id&&activePanel==='quiz'&&!document.hidden}
function voiceFailure(message,retry=false){stopVoice();voicePhase='error';voiceMessage(message);$('voiceRetry').classList.toggle('hidden',!retry);updateAudioButton()}
function canReadExplanation(){const q=queue[pos];return Boolean(q&&(mode==='study'?studyAnswers[q.id]!==undefined:examFinished))}
function refreshVoice(){const q=queue[pos],key=q?sessionId+':'+mode+':'+q.id+':'+examFinished:null;
 if(key!==lastVoiceQuestion){stopVoice();lastVoiceQuestion=key;
  if(voiceEnabled&&q&&activePanel==='quiz'&&!restoringSession&&!document.hidden)readQuestion();
  else voiceMessage(voiceEnabled&&q?'Audio interrumpido. Abre los controles y pulsa Reproducir para continuar.':'');
 }updateAudioButton();
}
function speechChunks(text,max=220){const words=String(text).replace(/\s+/g,' ').trim().split(' '),parts=[];let part='';for(const word of words){if(part.length+word.length>max&&part){parts.push(part);part=''}part+=(part?' ':'')+word}if(part)parts.push(part);return parts}
function speakText(text,onDone=()=>{},phase='reading'){
 const q=queue[pos],id=q?.id,token=voiceEpoch;if(!q||!voiceContextOK(token,id))return;
 if(!window.speechSynthesis||typeof window.SpeechSynthesisUtterance!=='function'){voiceFailure('La lectura no está disponible en este navegador.');return}
 const parts=speechChunks(text),voices=window.speechSynthesis.getVoices?.()||[];
 const voice=window.SurgiPrepSettings?.getVoice()||voices.find(v=>/^es[-_]CL$/i.test(v.lang))||voices.find(v=>/^es/i.test(v.lang)),rate=window.SurgiPrepSettings?.getRate()||1;
 voicePhase=phase;updateAudioButton();
 const next=()=>{if(!voiceContextOK(token,id))return;if(voicePaused?.kind==='speech'){voiceSpeech.deferred=next;return}clearTimeout(voiceWatchdog);voiceWatchdog=null;
  const part=parts.shift();if(!part){currentUtterance=null;voiceSpeech=null;onDone();return}
  const u=new window.SpeechSynthesisUtterance(part);currentUtterance=u;u.lang=voice?.lang||'es-CL';if(voice)u.voice=voice;u.rate=rate;
  let ended=false;u.onend=()=>{if(ended)return;ended=true;next()};
  u.onerror=()=>{if(ended||!voiceContextOK(token,id))return;ended=true;voiceFailure('Se interrumpió la lectura. Pulsa Repetir para reiniciarla.')};
  // Some mobile engines can stall without emitting end/error. Never open the mic on a guessed end time.
  voiceSpeech={deferred:null,arm:()=>{clearTimeout(voiceWatchdog);voiceWatchdog=setTimeout(()=>{if(voiceContextOK(token,id)&&!voicePaused)voiceFailure('La lectura no pudo terminar. Pulsa Repetir para reiniciarla.')},Math.max(45000,part.length*250/rate))}};voiceSpeech.arm();
  try{window.speechSynthesis.speak(u)}catch{u.onerror()}
 };next();
}
function questionOnlySpeech(q){let text=q.question;
 if(q.labs)for(const[label,value]of Object.entries(q.labs))text+='. '+label+': '+value.value+'. Referencia: '+value.reference;
 if(q.image)text+='. Esta pregunta incluye una imagen. Revísala en pantalla.';
 return text;
}
function alternativesSpeech(q){return q.options.map((v,i)=>'Alternativa '+String.fromCharCode(65+i)+'. '+optionBody(v,i)).join(' ')}
function questionSpeech(q){return questionOnlySpeech(q)+' '+alternativesSpeech(q)}
function afterAlternatives(){const q=queue[pos];if(!q||!voiceEnabled)return;
 if(mode==='exam'&&examFinished){voicePhase='ready';voiceMessage('Examen finalizado.');updateAudioButton();return}
 if(mode==='study'&&studyAnswers[q.id]!==undefined){voicePhase='ready';voiceMessage('Alternativas terminadas. Esta pregunta ya está respondida.');updateAudioButton();return}
 if(!(window.SpeechRecognition||window.webkitSpeechRecognition)){voicePhase='ready';voiceMessage('Lectura terminada. Este navegador no admite respuestas por micrófono. Pulsa Parar para responder en pantalla.');updateAudioButton();return}
 scheduleVoiceListen();
}
function readVoiceSection(section){const q=queue[pos];if(!voiceEnabled||!q||activePanel!=='quiz'||document.hidden)return;
 if(mode==='exam'&&!examFinished&&deadline&&Date.now()>=deadline){finishExam(true);return}
 if(section==='explanation'&&!((mode==='study'&&studyAnswers[q.id]!==undefined)||(mode==='exam'&&examFinished)))return;
 stopVoice();const token=voiceEpoch,id=q.id;
 const ready=message=>{if(!voiceContextOK(token,id))return;voicePhase='ready';voiceMessage(message);updateAudioButton()};
 if(section==='question'){voiceMessage('Leyendo solo el enunciado…');speakText(questionOnlySpeech(q),()=>ready('Enunciado terminado. Toca las alternativas para escucharlas.'))}
 else if(section==='alternatives'){voiceMessage('Leyendo solo las alternativas…');speakText(alternativesSpeech(q),()=>{if(voiceContextOK(token,id))afterAlternatives()})}
 else if(section==='explanation'){voiceMessage('Leyendo solo la explicación…');speakText(q.explanation,()=>ready('Explicación terminada.'),'explanation')}
}
function explanationSectionEvent(e){if(!voiceEnabled)return;const target=e.target.closest?.('.explanationText');if(!target||!$('feedback').contains(target))return;
 if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;e.preventDefault();readVoiceSection('explanation');
}
function readQuestion(){stopVoice();const q=queue[pos];if(!q||!voiceEnabled||activePanel!=='quiz'||document.hidden)return;
 const token=voiceEpoch,id=q.id;voiceMessage('Leyendo pregunta y alternativas…');
 speakText(questionSpeech(q),()=>{
  if(!voiceContextOK(token,id))return;
  if(mode==='study'&&studyAnswers[id]!==undefined){readExplanation();return}
  afterAlternatives();
 });
}
function readExplanation(){const q=queue[pos];if(!voiceEnabled||mode!=='study'||!q||studyAnswers[q.id]===undefined)return;
 voiceMessage('Leyendo explicación…');speakText(q.explanation,()=>{voicePhase='ready';voiceMessage('Explicación terminada. Avanza cuando quieras.');updateAudioButton()},'explanation');
}
function voiceAfterAnswer(q,selected){if(!voiceEnabled||queue[pos]?.id!==q.id||activePanel!=='quiz'||document.hidden)return;
 const spoken=selected===q.answer?'Correcto.':'Incorrecto.';voiceMessage(spoken);
 speakText(spoken,()=>{
  if(mode==='study')readExplanation();
  else{voicePhase='ready';voiceMessage('Respuesta registrada. Avanza cuando quieras.');updateAudioButton()}
 },'verdict');
}
function parseVoiceCommand(raw){const t=String(raw).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.,;:!?¡¿]/g,' ').replace(/\s+/g,' ').trim();
 const match=t.match(/^(?:(?:elijo|mi respuesta es|la respuesta es)\s+)?(?:(?:la\s+)?(?:alternativa|opcion|letra|respuesta)\s+|la\s+)?(a|b|be|ve|c|ce|se|d|de|e|alfa|bravo|charlie|delta|eco)$/);
 if(!match)return null;return {action:'answer',index:{a:0,alfa:0,b:1,be:1,ve:1,bravo:1,c:2,ce:2,se:2,charlie:2,d:3,de:3,delta:3,e:4,eco:4}[match[1]]};
}
function applyVoiceCommand(raw,expectedQuestionId){const q=queue[pos];if(!q||q.id!==expectedQuestionId||activePanel!=='quiz'||document.hidden||!voiceEnabled)return false;
 if(mode==='exam'&&!examFinished&&deadline&&Date.now()>=deadline){finishExam(true);voiceMessage('El tiempo del examen terminó.');return false}
 const command=parseVoiceCommand(raw);if(!command){voiceFailure('No identifiqué una sola alternativa. Puedes reintentar y decir «alternativa B».',true);return false}
 if((mode==='study'&&studyAnswers[q.id]!==undefined)||(mode==='exam'&&examFinished)){voiceMessage('Esta pregunta ya está corregida.');return false}
 choose(command.index);return true;
}
function listenAnswer(){stopVoice();const q=queue[pos],Constructor=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!voiceEnabled||!q||activePanel!=='quiz'||document.hidden)return;
 if((mode==='study'&&studyAnswers[q.id]!==undefined)||(mode==='exam'&&examFinished))return;
 if(mode==='exam'&&deadline&&Date.now()>=deadline){finishExam(true);return}
 if(!Constructor){voiceFailure('Este navegador no admite respuestas por micrófono. Pulsa Parar para responder en pantalla.');return}
 const id=q.id,token=voiceEpoch;let resultReceived=false,r;
 try{r=new Constructor()}catch{voiceFailure('No se pudo preparar el micrófono. Puedes reintentar o pulsar Parar para responder en pantalla.',true);return}
 recognizer=r;r.lang='es-CL';r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
 voicePhase='starting';voiceMessage('Activando micrófono…');updateAudioButton();
 const fail=message=>{if(!voiceContextOK(token,id))return;resultReceived=true;voiceFailure(message,true)};
 r.onstart=()=>{if(!voiceContextOK(token,id))return;voicePhase='listening';voiceMessage('Escuchando. Di A, B, C, D o E.');updateAudioButton()};
 r.onresult=e=>{if(!voiceContextOK(token,id))return;const result=e.results?.[e.resultIndex||0];if(!result||result.isFinal===false||resultReceived)return;
  resultReceived=true;const first=result[0];if(first?.confidence>0&&first.confidence<.55){fail('La respuesta no se reconoció con claridad. Reintenta diciendo «alternativa B».');return}
  // Invalidate callbacks and release the microphone before any verdict is spoken.
  const text=first?.transcript||'';stopVoice();applyVoiceCommand(text,id);
 };
 r.onerror=e=>{if(!voiceContextOK(token,id))return;const messages={
  'not-allowed':'No se autorizó el micrófono. Revisa el permiso del sitio y pulsa Reintentar micrófono.',
  'service-not-allowed':'El servicio de voz no está disponible. Revisa Siri o Dictado y el permiso del sitio.',
  'network':'No se pudo conectar con el servicio de voz. Revisa la conexión o pulsa Parar para responder en pantalla.',
  'no-speech':'No se detectó una respuesta. Puedes reintentar el micrófono.',
  'audio-capture':'No se pudo acceder al micrófono. Revisa si otra aplicación lo está usando.',
  'aborted':'El micrófono se interrumpió. Puedes reintentar.'};fail(messages[e.error]||'No se pudo reconocer la respuesta. Puedes reintentar o pulsar Parar para responder en pantalla.');
 };
 r.onend=()=>{if(!voiceContextOK(token,id)||resultReceived)return;fail('El micrófono se detuvo sin una respuesta. Puedes reintentar.')};
 voiceWatchdog=setTimeout(()=>fail('El servicio no devolvió una respuesta. Puedes reintentar el micrófono o tocar una alternativa.'),20000);
 try{r.start()}catch{fail('El navegador no inició el micrófono automáticamente. Pulsa Reintentar micrófono.')}
}
function setupVoice(){
 $('audioToggle').onclick=()=>setAudioMenu($('audioMenu').classList.contains('hidden'));
 $('audioPlay').onclick=toggleAudioPlayback;$('audioStop').onclick=stopAudio;$('audioRepeat').onclick=repeatAudio;
 document.addEventListener('click',e=>{if(!$('audioControls').contains(e.target))setAudioMenu(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('audioMenu').classList.contains('hidden')){e.preventDefault();setAudioMenu(false,true)}});
 $('question').onclick=()=>readVoiceSection('question');
 $('question').onkeydown=e=>{if(voiceEnabled&&['Enter',' '].includes(e.key)){e.preventDefault();readVoiceSection('question')}};
 $('options').onclick=e=>{if(voiceEnabled&&e.target===$('options'))readVoiceSection('alternatives')};
 $('feedback').addEventListener('click',explanationSectionEvent);$('feedback').addEventListener('keydown',explanationSectionEvent);
 $('voiceRetry').onclick=()=>{if(voiceEnabled)listenAnswer()};updateAudioButton();
}

function buildBackup(){saveSession();return {version:'7.23.14-beta-2600',questionCount:bank.length,date:new Date().toISOString(),stats,reports,favs,errorWhy,sessionState:{study:localRead(SESSION_KEYS.study),exam:localRead(SESSION_KEYS.exam),lastMode:preferredSessionMode()},preferences:{theme:localStorage.getItem('surgiprep_theme'),filtersOpen:localStorage.getItem('surgiprep_filters_open'),appSettings:window.SurgiPrepSettings?.getPreferences()||null}}}
function importSessionState(data){stopAudio();clearInterval(timer);sessionReady=false;sessionId='';queue=[];activeExamSettings=null;lastVoiceQuestion=null;for(const m of ['study','exam']){const value=data.sessionState?.[m];if(value?.schema===1&&value.mode===m)localWrite(SESSION_KEYS[m],value);else try{localStorage.removeItem(SESSION_KEYS[m])}catch{}}localWrite(LAST_MODE_KEY,data.sessionState?.lastMode==='exam'?'exam':'study');if(['dark','light','system'].includes(data.preferences?.theme))localStorage.setItem('surgiprep_theme',data.preferences.theme);if(['true','false'].includes(data.preferences?.filtersOpen))localStorage.setItem('surgiprep_filters_open',data.preferences.filtersOpen);if(data.preferences?.appSettings)window.SurgiPrepSettings?.restorePreferences(data.preferences.appSettings);sessionReady=true;window.dispatchEvent(new Event('surgiprep-preferences-restored'));setMode(preferredSessionMode(),false,false)}

async function init(){let response=await fetch('questions.json');if(!response.ok)throw new Error('Banco no disponible');bank=(await response.json()).map(q=>q.difficulty==='Intermedia'?{...q,difficulty:'Intermedio'}:q);bank.sort((a,b)=>a.id-b.id);activeBankIds=new Set(bank.map(q=>String(q.id)));bank.forEach(q=>{q.block=Number.isInteger(Number(q.block))&&Number(q.block)>0?Number(q.block):Math.floor((Number(q.id)-1)/100)+1;(byObj[q.objective_id]??=[]).push(q)});let blocks=[...new Set(bank.map(q=>q.block))].sort((a,b)=>a-b);$('blockSel').innerHTML='<option value="ALL">Todos los bloques</option>'+blocks.map(b=>{let ids=bank.filter(q=>q.block===b).map(q=>q.id);return '<option value="'+b+'">Bloque '+b+' · '+ids.length+' preguntas · IDs '+Math.min(...ids)+'–'+Math.max(...ids)+'</option>'}).join('');let pending=bank.filter(q=>q.audit_flag?.pending).length;$('reviewSel').innerHTML='<option value="ALL">Todos los estados</option><option value="pending">Revisión pendiente ('+pending+')</option><option value="unflagged">Sin marcas específicas ('+(bank.length-pending)+')</option>';let topics=[...new Set(bank.map(q=>q.topic))];$('topicSel').innerHTML='<option value="ALL">Todos los temas</option>'+topics.map(t=>`<option>${escapeHTML(t)}</option>`).join('');$('topicSel').onchange=()=>{refreshSubtopics();if(mode==='study')buildStudy()};
 // Keep stored topic/difficulty in sync with the current bank (difficulties have been reclassified across versions).
 const byId=new Map(bank.map(q=>[String(q.id),q]));for(const[id,s]of Object.entries(stats)){const q=byId.get(String(id));if(q){s.topic=q.topic;s.difficulty=q.difficulty;s.objective_id=q.objective_id}}
 // "Casos encadenados" needs questions with case_id; the current bank has none.
 const caseOption=$('studySel').querySelector('option[value="cases"]');if(caseOption&&!bank.some(q=>q.case_id)){caseOption.disabled=true;caseOption.textContent='Casos encadenados (sin casos en este banco)'}refreshSubtopics();$('subSel').onchange=()=>mode==='study'&&buildStudy();$('blockSel').onchange=()=>mode==='study'&&buildStudy();$('reviewSel').onchange=()=>mode==='study'&&buildStudy();$('typeSel').onchange=()=>mode==='study'&&buildStudy();$('studySel').onchange=buildStudy;document.querySelectorAll('.diffCard').forEach(card=>card.onclick=()=>{document.querySelectorAll('.diffCard').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});card.classList.add('on');card.setAttribute('aria-pressed','true');let d=card.dataset.d;selectedDifficulty=d;if(mode==='study'){buildStudy()}else{$('examDifficulty').value=d==='ALL'?'Mixto':d}});$('newSession').onclick=startFreshSession;$('studyMode').onclick=()=>setMode('study');$('examMode').onclick=()=>setMode('exam');$('customExam').onclick=()=>setExamProfile('custom');$('realExam').onclick=()=>setExamProfile('real');$('startExam').onclick=startExam;$('finish').onclick=()=>finishExam(false);$('prev').onclick=()=>navigateQuestion(-1);$('next').onclick=()=>navigateQuestion(1);$('flag').onclick=()=>{let q=queue[pos];if(!q)return;examFlags[q.id]=!examFlags[q.id];render()};$('fav').onclick=()=>{let q=queue[pos];if(!q)return;let i=favs.indexOf(q.id);if(i>=0)favs.splice(i,1);else favs.push(q.id);persist();render();renderFavs()};$('whyFailed').onclick=()=>{stopVoice();let q=queue[pos];if(!q)return;$('errorText').value='';$('errorModal').classList.add('show')};$('cancelError').onclick=()=>$('errorModal').classList.remove('show');$('saveError').onclick=()=>{let q=queue[pos];if(!q)return;errorWhy.push({id:q.id,case_id:q.case_id||null,topic:q.topic,difficulty:q.difficulty,reason:$('errorReason').value,text:$('errorText').value.trim(),date:new Date().toISOString()});persist();$('errorModal').classList.remove('show');renderErrors()};$('imageClose').onclick=()=>$('imageModal').classList.remove('show');$('imageModal').onclick=e=>{if(e.target===$('imageModal'))$('imageModal').classList.remove('show')};$('zoomIn').onclick=()=>setZoom(.5);$('zoomOut').onclick=()=>setZoom(-.5);$('zoomReset').onclick=()=>{zoomScale=1;$('imageZoom').style.transform='scale(1)';$('zoomReset').textContent='1×'};$('report').onclick=()=>{stopVoice();let q=queue[pos];if(!q)return;$('reportTitle').textContent=`Reportar pregunta ${q.id}`;$('reportText').value='';$('reportModal').classList.add('show')};$('cancelReport').onclick=()=>$('reportModal').classList.remove('show');$('saveReport').onclick=()=>{let q=queue[pos];if(!q)return;reports.push({id:q.id,objective:q.objective_id,topic:q.topic,difficulty:q.difficulty,origin:q.origin,reason:$('reportReason').value,text:$('reportText').value.trim(),date:new Date().toISOString()});persist();$('reportModal').classList.remove('show');renderReports();alert('Reporte guardado')};document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));$('goWeak').onclick=()=>{showPanel('quiz');setMode('study');$('studySel').value='weak';buildStudy()};$('goDue').onclick=()=>{showPanel('quiz');setMode('study');$('studySel').value='due';buildStudy()};$('backup').onclick=()=>download(buildBackup(),'respaldo_SurgiPrep_2600.json');$('restore').onchange=e=>{let input=e.target,f=input.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{input.value='';let d;try{d=JSON.parse(r.result)}catch(err){alert('Archivo no válido: no es un JSON legible.');return}if(!d||typeof d!=='object'||Array.isArray(d)||!('stats'in d||'reports'in d||'favs'in d||'errorWhy'in d)){alert('Archivo no válido: no parece un respaldo de SurgiPrep.');return}if(!confirm('Importar este respaldo reemplazará el progreso guardado en este dispositivo. ¿Continuar?'))return;try{const normalizedStats=asStats(d.stats),statsAdjusted=JSON.stringify(normalizedStats)!==JSON.stringify(d.stats||{});stats=normalizedStats;reports=asList(d.reports);favs=asFavs(d.favs);errorWhy=asList(d.errorWhy);persist();importSessionState(d);renderDashboard();alert(statsAdjusted?'Respaldo importado. Se normalizaron contadores incompletos o inconsistentes y se descartaron claves no válidas.':'Respaldo importado')}catch(err){console.error(err);alert('El respaldo se importó parcialmente: '+err.message)}};r.onerror=()=>{input.value='';alert('No se pudo leer el archivo.')};r.readAsText(f)};$('exportReports').onclick=()=>download(reports,'reportes_SurgiPrep_2600.json');$('clearReports').onclick=()=>{if(confirm('¿Borrar reportes?')){reports=[];persist();renderReports()}};setupEnhancements();setMode(preferredSessionMode());renderDashboard();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js')}init().catch(error=>{console.error('No se pudo cargar SurgiPrep:',error);$('question').textContent='No se pudo cargar el banco. Comprueba la conexión y vuelve a abrir la aplicación desde su dirección publicada.';});
