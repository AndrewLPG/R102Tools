const form = document.querySelector('#design-form');
const rows = document.querySelector('#hazard-rows');
const template = document.querySelector('#hazard-template');
const empty = document.querySelector('#empty-state');
const STORAGE_KEY = 'r102-design-assistant-v2';
const RULE_SOURCE = { manual: 'ANSUL R-102 Restaurant Fire Suppression Manual', part: '418087', revision: '13', date: '2022-NOV-14' };

const NOZZLE_RULES = [
  // Fryer dimensions are maximum internal frypot depth x length; no dripboard.
  {id:'fr-230-14x15',types:['fryer-full','fryer-split'],nozzle:'230',points:2,maxDepth:355,maxWidth:381,minHeight:686,maxHeight:1193,page:'4-8',figure:'4-15 / 4-16',note:'Nozzle anywhere along or within frypot perimeter; aim at cooking-area center.'},
  {id:'fr-245-14x15',types:['fryer-full','fryer-split'],nozzle:'245',points:2,maxDepth:355,maxWidth:381,minHeight:508,maxHeight:685,page:'4-8',figure:'4-15 / 4-16',note:'Nozzle anywhere along or within frypot perimeter; aim at cooking-area center.'},
  {id:'fr-290-14x15-low',types:['fryer-full','fryer-split'],nozzle:'290',points:2,maxDepth:355,maxWidth:381,minHeight:330,maxHeight:406,page:'4-8',figure:'4-17',note:'Observe the midpoint placement tolerances in Figure 4-17.'},
  {id:'fr-290-14.5x14',types:['fryer-full','fryer-split'],nozzle:'290',points:2,maxDepth:368,maxWidth:355,minHeight:406,maxHeight:685,page:'4-8',figure:'4-17',note:'Observe the midpoint placement tolerances in Figure 4-17.'},
  {id:'fr-290-full-14.5x16.5',types:['fryer-full'],nozzle:'290',points:2,maxDepth:368,maxWidth:419,minHeight:406,maxHeight:533,page:'4-9',figure:'4-17',note:'Full vat only. Observe the midpoint placement tolerances.'},
  {id:'fr-290-full-19.5x19',types:['fryer-full'],nozzle:'290',points:2,maxDepth:495,maxWidth:482,minHeight:330,maxHeight:406,page:'4-9',figure:'4-17',note:'Full vat only. Observe the midpoint placement tolerances.'},
  {id:'fr-3n-full-18x18',types:['fryer-full'],nozzle:'3N',points:3,maxDepth:457,maxWidth:457,minHeight:635,maxHeight:889,page:'4-9',figure:'4-19',note:'Full vat only. Nozzle must be within the front half of the frypot perimeter.'},

  {id:'range-1n-high',types:['range'],nozzle:'1N',points:1,maxArea:247000,maxSide:812,minHeight:762,maxHeight:1016,page:'4-14',figure:'4-29 / 4-30',note:'No obstructions. Locate within 254 mm of each hazard centerline; aim at cooking-surface center.'},
  {id:'range-245-high',types:['range'],nozzle:'245',points:2,maxArea:433000,maxSide:711,minHeight:1016,maxHeight:1270,page:'4-15',figure:'4-31 / 4-32',note:'No obstructions. Point vertically down; observe burner-grate offset limits.'},
  {id:'range-260-medium',types:['range'],nozzle:'260',points:2,maxArea:495000,maxSide:812,minHeight:762,maxHeight:1016,page:'4-16',figure:'4-33 / 4-34',note:'No obstructions. Point vertically down; observe burner-grate offset limits.'},
  {id:'range-1n-low',types:['range'],nozzle:'1N',points:1,maxWidth:609,maxDepth:457,minHeight:381,maxHeight:508,rotatable:true,page:'4-17',figure:'4-35 / 4-36',note:'With or without obstruction. Position above the edge and aim along the centerline.'},
  {id:'range-two-290-low',types:['range'],nozzle:'2 × 290',points:4,maxArea:650000,maxSide:914,minHeight:381,maxHeight:508,page:'4-17',figure:'4-37 / 4-38',note:'Requires two 290 nozzles, positioned at opposite ends as shown.'},

  {id:'griddle-1n-high',types:['griddle'],nozzle:'1N',points:1,maxArea:696000,maxSide:914,minHeight:889,maxHeight:1016,page:'4-19',figure:'4-41 / 4-42',note:'Position along perimeter to 51 mm inside; aim at midpoint.'},
  {id:'griddle-290-high',types:['griddle'],nozzle:'290',points:2,maxArea:464000,maxSide:762,minHeight:762,maxHeight:1270,page:'4-19',figure:'4-43 / 4-44',note:'Position within 25 mm of cooking-surface center; point vertically down.'},
  {id:'griddle-260-high',types:['griddle'],nozzle:'260',points:2,maxArea:929000,maxSide:1219,minHeight:762,maxHeight:1270,page:'4-20',figure:'4-45 / 4-46',note:'Position along perimeter to 51 mm inside; aim at center.'},
  {id:'griddle-290-medium',types:['griddle'],nozzle:'290',points:2,maxArea:929000,maxSide:1219,minHeight:508,maxHeight:762,page:'4-20',figure:'4-47 / 4-48',note:'Position along perimeter to 51 mm inside; aim at center.'},
  {id:'griddle-2120-low',types:['griddle'],nozzle:'2120',points:2,maxArea:929000,maxSide:1219,minHeight:254,maxHeight:508,page:'4-21',figure:'4-49 / 4-50',note:'Position along perimeter to 51 mm inside; aim at center.'},
  {id:'griddle-2w-low',types:['griddle'],nozzle:'2W',points:2,maxWidth:914,maxDepth:762,minHeight:254,maxHeight:508,rotatable:true,page:'4-21',figure:'4-51 / 4-52',note:'Maximum cooking surface 762 × 914 mm; observe offset and aim-point limits.'},
  {id:'griddle-1w-low',types:['griddle'],nozzle:'1W',points:1,maxWidth:660,maxDepth:520,minHeight:381,maxHeight:508,rotatable:true,page:'4-22',figure:'4-53 / 4-54',note:'Position at one end and aim 508 mm along the centerline.'},

  {id:'char-ge-1n',types:['char-gas-electric'],nozzle:'1N',points:1,maxArea:557000,maxSide:914,minHeight:381,maxHeight:1016,page:'4-25',figure:'4-64',note:'Position along or within perimeter; aim at cooking-surface center.'},
  {id:'char-e-1n',types:['char-electric'],nozzle:'1N',points:1,maxArea:438000,maxSide:863,minHeight:508,maxHeight:1270,page:'4-25',figure:'4-65',note:'Optional electric char-broiler coverage. Position along or within perimeter; aim at center.'},
  {id:'char-lava-1n',types:['char-lava'],nozzle:'1N',points:1,maxArea:201000,maxSide:609,minHeight:457,maxHeight:889,page:'4-26',figure:'4-66',note:'Position along or within perimeter and angle to center.'},
  {id:'char-lava-3n',types:['char-lava'],nozzle:'3N',points:3,maxArea:464000,maxSide:762,minHeight:355,maxHeight:1016,page:'4-27',figure:'4-68',note:'Alternate ceramic coverage. Position along or within perimeter and angle to center.'},
  {id:'char-charcoal-1n',types:['char-charcoal'],nozzle:'1N',points:1,maxArea:185000,maxSide:609,minHeight:457,maxHeight:1016,page:'4-26',figure:'4-67',note:'Charcoal depth must not exceed 101 mm.'},
  {id:'char-charcoal-3n',types:['char-charcoal'],nozzle:'3N',points:3,maxArea:464000,maxSide:762,minHeight:355,maxHeight:1016,page:'4-27',figure:'4-68',note:'Alternate coverage. Charcoal depth must not exceed 101 mm.'},
  {id:'char-wood-3n',types:['char-wood'],nozzle:'3N',points:3,maxArea:464000,maxSide:762,minHeight:355,maxHeight:1016,page:'4-27',figure:'4-69',note:'Wood depth max 152 mm; pieces max 102 mm diameter.'},

  {id:'wok-260',types:['wok'],nozzle:'260',points:2,minDiameter:355,maxDiameter:762,minDepth:95,maxDepth:203,minHeight:889,maxHeight:1143,page:'4-28',figure:'4-70',note:'Position within 25 mm radius of center; point vertically down.'},
  {id:'wok-1n',types:['wok'],nozzle:'1N',points:1,minDiameter:279,maxDiameter:609,minDepth:76,maxDepth:152,minHeight:762,maxHeight:1016,page:'4-28',figure:'4-71',note:'Position along or within perimeter; aim at center.'}
];

const escapeHtml = s => String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const n = value => Number.parseFloat(value) || 0;
const ruleById = id => NOZZLE_RULES.find(rule=>rule.id===id);

function matches(rule,h) {
  if(!rule.types.includes(h.type)||!h.width||!h.depth) return false;
  if(h.type==='wok') return h.width>=rule.minDiameter&&h.width<=rule.maxDiameter&&h.depth>=rule.minDepth&&h.depth<=rule.maxDepth;
  if(rule.maxArea&&h.width*h.depth>rule.maxArea) return false;
  if(rule.maxSide&&Math.max(h.width,h.depth)>rule.maxSide) return false;
  if(rule.maxWidth&&rule.maxDepth) {
    const direct=h.width<=rule.maxWidth&&h.depth<=rule.maxDepth;
    const rotated=rule.rotatable&&h.width<=rule.maxDepth&&h.depth<=rule.maxWidth;
    if(!direct&&!rotated) return false;
  }
  return true;
}

function candidates(h) {
  return NOZZLE_RULES.filter(rule=>matches(rule,h)).sort((a,b)=>a.points-b.points||(a.maxArea||a.maxWidth*a.maxDepth)-(b.maxArea||b.maxWidth*b.maxDepth));
}

function rowValues(row,index=0) {
  const value=field=>row.querySelector(`[data-field="${field}"]`).value.trim();
  const type=value('type');
  const rule=ruleById(value('ruleId'));
  return {index:index+1,type,type,typeLabel:row.querySelector('[data-field="type"] option:checked').textContent,id:value('id'),width:n(value('width')),depth:n(value('depth')),ruleId:rule?.id||'',nozzle:rule?.nozzle||'',points:rule?.points||0,allowableHeight:{minMm:rule?.minHeight||0,maxMm:rule?.maxHeight||0},maxWidth:rule?.maxWidth||rule?.maxSide||rule?.maxDiameter||0,maxDepth:rule?.maxDepth||0,manualSection:rule?`Rev. 13 p. ${rule.page}, Fig. ${rule.figure}`:'',rule:rule||null};
}

function updateRow(row,preserve=true) {
  const h=rowValues(row); const select=row.querySelector('[data-field="ruleId"]'); const previous=preserve?select.value:''; const found=candidates(h);
  select.innerHTML=`<option value="">${h.width&&h.depth?(found.length?'Select a compatible nozzle':'No compatible single-nozzle rule'):'Enter dimensions first'}</option>`+found.map(rule=>`<option value="${rule.id}">${escapeHtml(rule.nozzle)} — ${rule.points} flow point${rule.points===1?'':'s'} — ${rule.minHeight}–${rule.maxHeight} mm high</option>`).join('');
  if(found.some(rule=>rule.id===previous)) select.value=previous;
  const status=row.querySelector('.suggestion-status');
  status.className=`suggestion-status ${found.length?'good':'bad'}`;
  status.textContent=h.width&&h.depth?(found.length?`${found.length} dimension-compatible option${found.length===1?'':'s'} — lowest flow first`:'No match. Check dimensions, hazard type, or multiple-nozzle requirements.'):'Width and depth required.';
  const help=row.querySelector('.dimension-help');
  help.textContent=h.type==='wok'?'Width = wok diameter; depth = pan depth.':h.type.startsWith('fryer')?'Width = frypot length; depth = internal front-to-back depth.':'Cooking-surface width × depth.';
  updateRuleSummary(row);
}

function updateRuleSummary(row) {
  const rule=ruleById(row.querySelector('[data-field="ruleId"]').value); const box=row.querySelector('.rule-summary');
  box.innerHTML=rule?`<strong>${escapeHtml(rule.nozzle)} · ${rule.points} flow point${rule.points===1?'':'s'}</strong><b>Allowable height:</b> ${rule.minHeight}–${rule.maxHeight} mm<br>Rev. 13 p. ${rule.page}, Fig. ${rule.figure}<br>${escapeHtml(rule.note)}`:'No nozzle selected.';
}

function addHazard(data={}) {
  const row=template.content.firstElementChild.cloneNode(true); rows.append(row);
  const legacyType={'Fryer':'fryer-full','Range':'range','Griddle':'griddle','Wok':'wok','Charbroiler':'char-gas-electric'}[data.type]; if(legacyType)data.type=legacyType;
  row.querySelectorAll('[data-field]').forEach(el=>{if(data[el.dataset.field]!==undefined)el.value=data[el.dataset.field];});
  updateRow(row,false); if(data.ruleId&&ruleById(data.ruleId)){row.querySelector('[data-field="ruleId"]').value=data.ruleId;updateRuleSummary(row);}
  row.querySelector('.remove').addEventListener('click',()=>{row.remove();refresh();saveDraft();});
  row.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',()=>{if(['type','width','depth'].includes(el.dataset.field))updateRow(row);else updateRuleSummary(row);refresh();saveDraft();}));
  refresh();
}

function hazards(){return [...rows.children].map((row,index)=>rowValues(row,index));}
function projectData(){const fd=new FormData(form),data=Object.fromEntries(fd.entries());data.capacity=n(data.capacity);data.reserve=n(data.reserve);data.pipeLength=n(data.pipeLength);data.fittings=n(data.fittings);data.elevation=n(data.elevation);for(const key of ['manualConfirmed','ductCovered','plenumCovered','fuelInterlock','manualPull','detection','alarmInterface'])data[key]=fd.has(key);return data;}

function calculate(){
  const hs=hazards(),d=projectData(),required=hs.reduce((sum,h)=>sum+h.points,0),available=Math.max(0,d.capacity-d.reserve),margin=available-required,checks=[];
  checks.push({level:hs.length?'pass':'error',text:hs.length?`${hs.length} hazard${hs.length===1?'':'s'} recorded.`:'Add at least one protected hazard.'});
  hs.forEach(h=>{const name=h.id||`${h.typeLabel} ${h.index}`;if(!h.width||!h.depth)checks.push({level:'error',text:`${name}: enter width and depth.`});else if(!h.rule)checks.push({level:'error',text:`${name}: select a compatible nozzle; no selection is currently recorded.`});else if(!matches(h.rule,h))checks.push({level:'error',text:`${name}: selected nozzle no longer matches the entered dimensions.`});else checks.push({level:'pass',text:`${name}: ${h.nozzle} matches the encoded dimensional limits; allowable nozzle height is ${h.rule.minHeight}–${h.rule.maxHeight} mm (p. ${h.rule.page}).`});});
  checks.push({level:d.manualConfirmed?'pass':'error',text:d.manualConfirmed?'Current manual access confirmed.':'Confirm access to the current jurisdiction-appropriate manual.'});
  checks.push({level:d.capacity>0?(margin>=0?'pass':'error'):'error',text:d.capacity>0?(margin>=0?`Agent capacity margin is ${margin.toFixed(1)} flow points.`:`Required allocation exceeds available capacity by ${Math.abs(margin).toFixed(1)} flow points.`):'Enter the selected system capacity from the current manual.'});
  if(!d.ductCovered)checks.push({level:'warn',text:'Duct protection has not been confirmed.'});if(!d.plenumCovered)checks.push({level:'warn',text:'Plenum protection has not been confirmed.'});
  for(const [key,label] of [['fuelInterlock','Fuel/electric shutoff'],['manualPull','Manual pull station'],['detection','Detection coverage'],['alarmInterface','Alarm/building interface']])if(!d[key])checks.push({level:'warn',text:`${label} review is incomplete.`});
  checks.push({level:'warn',text:'Suggestions cover encoded appliance-specific single-nozzle rules only. Confirm placement, aiming, obstructions, special notices, piping, multiple-nozzle rules and current listings in the manual.'});
  return {required,available,margin,checks,project:d,hazards:hs.map(({rule,...h})=>({...h,rule:rule?{...rule}:null}))};
}

function refresh(showDetails=false){empty.hidden=rows.children.length>0;const result=calculate(),passes=result.checks.filter(x=>x.level==='pass').length;document.querySelector('#required-points').textContent=result.required.toFixed(1);document.querySelector('#available-points').textContent=result.project.capacity?result.available.toFixed(1):'—';document.querySelector('#margin-points').textContent=result.project.capacity?result.margin.toFixed(1):'—';document.querySelector('#check-score').textContent=`${passes} / ${result.checks.length}`;if(showDetails)document.querySelector('#results').innerHTML=`<ul>${result.checks.map(x=>`<li class="${x.level}">${x.level==='pass'?'✓':x.level==='error'?'✕':'!'} ${escapeHtml(x.text)}</li>`).join('')}</ul>`;}
function auditExport(){const result=calculate();return {schemaVersion:'2.0',tool:'R-102 Design Assistant',generatedAt:new Date().toISOString(),status:document.querySelector('#approval').checked?'qualified-person review recorded':'DRAFT — NOT APPROVED',ruleSource:RULE_SOURCE,disclaimer:'Design assistance only. Suggestions are not approval. Verify every selection, placement and limitation against the controlled manual, listings, applicable codes, AHJ requirements, and an authorised qualified person.',calculation:{formula:'required = sum(selected rule flow points); available = tank capacity - reserve; margin = available - required',requiredFlowPoints:result.required,availableFlowPoints:result.available,marginFlowPoints:result.margin},...result};}
function saveDraft(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({project:projectData(),hazards:hazards().map(({rule,...h})=>h),approval:document.querySelector('#approval').checked}));}catch{}}
function loadDraft(){try{const draft=JSON.parse(localStorage.getItem(STORAGE_KEY));if(!draft)return;Object.entries(draft.project||{}).forEach(([key,val])=>{const el=form.elements[key];if(!el)return;if(el.type==='checkbox')el.checked=Boolean(val);else el.value=val;});(draft.hazards||[]).forEach(addHazard);document.querySelector('#approval').checked=Boolean(draft.approval);}catch{}}

document.querySelector('#add-hazard').addEventListener('click',()=>{addHazard();saveDraft();});form.addEventListener('input',()=>{refresh();saveDraft();});form.addEventListener('submit',e=>{e.preventDefault();refresh(true);document.querySelector('#results').scrollIntoView({behavior:'smooth',block:'center'});});
document.querySelector('#save-json').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(auditExport(),null,2)],{type:'application/json'}));a.download=`r102-audit-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);});document.querySelector('#print-report').addEventListener('click',()=>{refresh(true);window.print();});document.querySelector('#reset-form').addEventListener('click',()=>{if(!confirm('Clear this local draft? Export it first if you need an audit record.'))return;localStorage.removeItem(STORAGE_KEY);form.reset();rows.innerHTML='';addHazard();refresh(true);});
loadDraft();if(!rows.children.length)addHazard();refresh();
