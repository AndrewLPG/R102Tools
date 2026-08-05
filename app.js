const form = document.querySelector('#design-form');
const rows = document.querySelector('#hazard-rows');
const template = document.querySelector('#hazard-template');
const empty = document.querySelector('#empty-state');
const STORAGE_KEY = 'r102-design-assistant-v1';

const escapeHtml = (s) => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const n = value => Number.parseFloat(value) || 0;

function addHazard(data = {}) {
  const row = template.content.firstElementChild.cloneNode(true);
  row.querySelectorAll('[data-field]').forEach(el => { if (data[el.dataset.field] !== undefined) el.value = data[el.dataset.field]; });
  row.querySelector('.remove').addEventListener('click', () => { row.remove(); refresh(); saveDraft(); });
  row.querySelectorAll('input,select').forEach(el => el.addEventListener('input', () => { refresh(); saveDraft(); }));
  rows.append(row); refresh();
}

function hazards() {
  return [...rows.children].map((row, index) => {
    const value = field => row.querySelector(`[data-field="${field}"]`).value.trim();
    return {index:index+1,type:value('type'),id:value('id'),width:n(value('width')),depth:n(value('depth')),height:n(value('height')),nozzle:value('nozzle'),points:n(value('points')),maxWidth:n(value('maxWidth')),maxDepth:n(value('maxDepth')),manualSection:value('manualSection')};
  });
}

function projectData() {
  const fd = new FormData(form); const data = Object.fromEntries(fd.entries());
  data.capacity=n(data.capacity); data.reserve=n(data.reserve); data.pipeLength=n(data.pipeLength); data.fittings=n(data.fittings); data.elevation=n(data.elevation);
  for (const key of ['manualConfirmed','ductCovered','plenumCovered','fuelInterlock','manualPull','detection','alarmInterface']) data[key]=fd.has(key);
  return data;
}

function calculate() {
  const hs=hazards(), d=projectData();
  const required=hs.reduce((sum,h)=>sum+h.points,0), available=Math.max(0,d.capacity-d.reserve), margin=available-required;
  const checks=[];
  checks.push({level:hs.length?'pass':'error',text:hs.length?`${hs.length} hazard${hs.length===1?'':'s'} recorded.`:'Add at least one protected hazard.'});
  hs.forEach(h => {
    const name=h.id||`${h.type} ${h.index}`;
    if(!h.width||!h.depth) checks.push({level:'error',text:`${name}: enter actual width and depth.`});
    if(!h.nozzle||!h.points) checks.push({level:'error',text:`${name}: enter the manual-selected nozzle and flow points.`});
    if(!h.maxWidth||!h.maxDepth||!h.manualSection) checks.push({level:'error',text:`${name}: enter controlled-manual limits and the source section.`});
    if(h.maxWidth&&h.width>h.maxWidth) checks.push({level:'error',text:`${name}: width ${h.width} mm exceeds the entered manual limit of ${h.maxWidth} mm.`});
    if(h.maxDepth&&h.depth>h.maxDepth) checks.push({level:'error',text:`${name}: depth ${h.depth} mm exceeds the entered manual limit of ${h.maxDepth} mm.`});
  });
  checks.push({level:d.manualConfirmed?'pass':'error',text:d.manualConfirmed?'Current manual access confirmed.':'Confirm access to the current jurisdiction-appropriate manual.'});
  checks.push({level:d.capacity>0?(margin>=0?'pass':'error'):'error',text:d.capacity>0?(margin>=0?`Agent capacity margin is ${margin.toFixed(1)} flow points.`:`Required allocation exceeds available capacity by ${Math.abs(margin).toFixed(1)} flow points.`):'Enter the selected system capacity from the current manual.'});
  if(!d.ductCovered) checks.push({level:'warn',text:'Duct protection has not been confirmed.'});
  if(!d.plenumCovered) checks.push({level:'warn',text:'Plenum protection has not been confirmed.'});
  for(const [key,label] of [['fuelInterlock','Fuel/electric shutoff'],['manualPull','Manual pull station'],['detection','Detection coverage'],['alarmInterface','Alarm/building interface']]) if(!d[key]) checks.push({level:'warn',text:`${label} review is incomplete.`});
  checks.push({level:'warn',text:'Distribution-piping arrangement and limits require manual verification; this version records but does not calculate them.'});
  return {required,available,margin,checks,project:d,hazards:hs};
}

function refresh(showDetails=false) {
  empty.hidden=rows.children.length>0;
  const result=calculate(), passes=result.checks.filter(x=>x.level==='pass').length;
  document.querySelector('#required-points').textContent=result.required.toFixed(1);
  document.querySelector('#available-points').textContent=result.project.capacity?result.available.toFixed(1):'—';
  document.querySelector('#margin-points').textContent=result.project.capacity?result.margin.toFixed(1):'—';
  document.querySelector('#check-score').textContent=`${passes} / ${result.checks.length}`;
  if(showDetails) document.querySelector('#results').innerHTML=`<ul>${result.checks.map(x=>`<li class="${x.level}">${x.level==='pass'?'✓':x.level==='error'?'✕':'!'} ${escapeHtml(x.text)}</li>`).join('')}</ul>`;
}

function auditExport() {
  const result=calculate();
  return {schemaVersion:'1.0',tool:'R-102 Design Assistant',generatedAt:new Date().toISOString(),status:document.querySelector('#approval').checked?'qualified-person review recorded':'DRAFT — NOT APPROVED',disclaimer:'Design assistance only. Verify against the latest ANSUL manual, listings, applicable codes, AHJ requirements, and an authorised qualified person.',calculation:{formula:'required = sum(hazard.flowPoints); available = tankCapacity - reserve; margin = available - required',requiredFlowPoints:result.required,availableFlowPoints:result.available,marginFlowPoints:result.margin},...result};
}

function saveDraft(){ try{localStorage.setItem(STORAGE_KEY,JSON.stringify({project:projectData(),hazards:hazards(),approval:document.querySelector('#approval').checked}));}catch{} }
function loadDraft(){ try{const draft=JSON.parse(localStorage.getItem(STORAGE_KEY));if(!draft)return;Object.entries(draft.project||{}).forEach(([key,val])=>{const el=form.elements[key];if(!el)return;if(el.type==='checkbox')el.checked=Boolean(val);else el.value=val;});(draft.hazards||[]).forEach(addHazard);document.querySelector('#approval').checked=Boolean(draft.approval);}catch{} }

document.querySelector('#add-hazard').addEventListener('click',()=>{addHazard();saveDraft();});
form.addEventListener('input',()=>{refresh();saveDraft();});
form.addEventListener('submit',e=>{e.preventDefault();refresh(true);document.querySelector('#results').scrollIntoView({behavior:'smooth',block:'center'});});
document.querySelector('#save-json').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(auditExport(),null,2)],{type:'application/json'}));a.download=`r102-audit-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);});
document.querySelector('#print-report').addEventListener('click',()=>{refresh(true);window.print();});
document.querySelector('#reset-form').addEventListener('click',()=>{if(!confirm('Clear this local draft? Export it first if you need an audit record.'))return;localStorage.removeItem(STORAGE_KEY);form.reset();rows.innerHTML='';addHazard();refresh(true);});
loadDraft();if(!rows.children.length)addHazard();refresh();
