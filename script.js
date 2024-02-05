/*
MIT License
Copyright (c) 2023 Georgia Rachel and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initials = value => value.trim().split(/\s+/).map(word=>word[0]).join('').slice(0,2).toUpperCase();
  const stages = ['Planned','In progress','Completed'];
  const platforms = ['LinkedIn','Instagram','Facebook','X'];
  const dateFormat = new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  const dateText = time => dateFormat.format(new Date(time));
  let filter = 'all';
  function example() {
    const members=['Alex Morgan','Sam Rivera','Jamie Chen'];
    const projects=['Spring campaign','Website refresh','Community launch'].map((title,index)=>({id:uid(),title,stage:index===2?'Planned':'In progress'}));
    const now=Date.now();
    return {version:1,generated:false,organization:'Northstar Studio',members,projects,paused:false,
      posts:[{id:uid(),title:'Meet the people behind our next chapter',platform:'LinkedIn',owner:members[0],project:projects[0].title,scheduledAt:now+30*60000,status:'scheduled'},{id:uid(),title:'A first look at something new',platform:'Instagram',owner:members[1],project:projects[1].title,scheduledAt:now+90*60000,status:'scheduled'}],
      tasks:['Daily team check-in','Review the content calendar','Share a project progress update'].map((title,index)=>({id:uid(),title,owner:members[index],project:projects[index].title,done:index===0})),
      activity:[{id:uid(),actor:'Relay',action:'Example workspace ready',project:'Team workspace',note:'Try the queue, update a project, or generate a hub for your own team.',time:now}]};
  }
  const text = (value,max=140) => typeof value==='string' && value.trim().length>0 && value.length<=max;
  const timestamp = value => Number.isSafeInteger(value) && value>0 && value<=8640000000000000;
  function valid(value) {
    const list=(array,max,check)=>Array.isArray(array)&&array.length<=max&&array.every(check);
    const uniqueIds=array=>new Set(array.map(item=>item.id)).size===array.length;
    return value && value.version===1 && text(value.organization,80) && typeof value.generated==='boolean' && typeof value.paused==='boolean'
      && list(value.members,20,n=>text(n,80)) && value.members.length>0 && new Set(value.members).size===value.members.length
      && list(value.projects,8,p=>text(p.id,100)&&text(p.title,100)&&stages.includes(p.stage)) && value.projects.length>0 && uniqueIds(value.projects)
      && list(value.posts,100,p=>text(p.id,100)&&text(p.title)&&platforms.includes(p.platform)&&text(p.owner,80)&&text(p.project,100)&&timestamp(p.scheduledAt)&&['scheduled','completed','cancelled'].includes(p.status)) && uniqueIds(value.posts)
      && list(value.tasks,100,t=>text(t.id,100)&&text(t.title)&&text(t.owner,80)&&text(t.project,100)&&typeof t.done==='boolean') && uniqueIds(value.tasks)
      && list(value.activity,100,a=>text(a.id,100)&&text(a.actor,80)&&text(a.action,180)&&text(a.project,100)&&typeof a.note==='string'&&a.note.length<=400&&timestamp(a.time)) && uniqueIds(value.activity);
  }
  let preset=null;
  try{preset=JSON.parse($('relay-preset')?.textContent||'null');}catch{/* Invalid downloads fall back to the example. */}
  const storageKey='relay-team-hub-v1:'+(text(preset?.copyId,100)?preset.copyId:'main');
  let state=valid(preset)?clone(preset):example();
  try{const saved=JSON.parse(localStorage.getItem(storageKey));if(valid(saved))state=saved;}catch{/* Storage restrictions do not prevent an in-memory hub. */}
  function announce(message){$('announcement').textContent=message;}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));$('storage-notice').hidden=true;}catch{$('storage-notice').hidden=false;}}
  function log(actor,action,project='Team workspace',note=''){
    state.activity.unshift({id:uid(),actor,action,project,note,time:Date.now()});
    state.activity=state.activity.slice(0,100);
  }
  function error(id,message){$(id).textContent=message;$(id).focus();}
  function options(id,values){$(id).replaceChildren();values.forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value;$(id).append(option);});}
  function populateOwnersAndProjects(prefix){options(prefix+'-owner',state.members);options(prefix+'-project',state.projects.map(p=>p.title));}
  function renderIdentity(){
    $('sidebar-organization').textContent=state.organization;
    $('org-initials').textContent=initials(state.organization);
    $('page-title').textContent=state.generated?state.organization+' · Team Automation Hub':'A little less busy. A lot more in sync.';
    $('page-subtitle').textContent=state.generated?`${state.members.length} team members. ${state.projects.length} projects. One place to move work forward.`:'Bring your people, projects, and daily workflows together.';
    $('about-copy').textContent=`${state.generated?state.organization+' uses this hub to bring':'Relay brings'} social media rollouts, project status updates, and daily checklists into one practical workspace. ${state.generated?'Your team can plan mock automations, record progress, and keep daily work organized.':'Generate a hub for your organization, try mock automations, and adapt the source to your team’s routine.'}`;
    document.title=state.generated?state.organization+' — Team Automation Hub':'Relay — Team Automation Hub';
  }
  function renderSummary(){
    $('scheduled-count').textContent=state.posts.filter(p=>p.status==='scheduled').length;
    $('project-count').textContent=state.projects.filter(p=>p.stage!=='Completed').length;
    $('workflow-count').textContent=state.tasks.filter(t=>t.done).length+' / '+state.tasks.length;
    $('member-count').textContent=state.members.length;
  }
  function renderPosts(){
    const posts=state.posts.filter(p=>filter==='all'||p.status===filter).slice().sort((a,b)=>a.scheduledAt-b.scheduledAt);
    $('post-list').innerHTML=posts.length?posts.map(post=>`<article class="post-row"><span class="platform-icon" aria-hidden="true">${escape(post.platform==='LinkedIn'?'in':post.platform==='Instagram'?'ig':post.platform==='Facebook'?'fb':'X')}</span><div><h3 class="post-title">${escape(post.title)}</h3><p class="post-meta">${escape(post.platform)} · ${escape(post.owner)} · ${escape(post.project)}</p><time class="post-time" datetime="${new Date(post.scheduledAt).toISOString()}">${post.status==='scheduled'?'Scheduled for':'Originally scheduled for'} ${escape(dateText(post.scheduledAt))}</time>${post.status==='scheduled'?`<div class="post-actions"><button type="button" data-run="${escape(post.id)}" aria-label="Run demo for ${escape(post.title)}">Run demo now</button><button type="button" data-cancel="${escape(post.id)}" aria-label="Cancel ${escape(post.title)}">Cancel</button></div>`:''}</div><span class="post-state ${post.status}">${post.status==='completed'?'Demo completed':post.status==='cancelled'?'Cancelled':'Scheduled'}</span></article>`).join(''):'<div class="empty-state"><strong>No '+(filter==='all'?'posts':filter+' posts')+' yet.</strong>Add a mock post to try your publishing workflow.</div>';
  }
  function renderTasks(){
    $('daily-list').innerHTML=state.tasks.length?state.tasks.map(task=>`<div class="daily-row"><label><input type="checkbox" data-task="${escape(task.id)}" ${task.done?'checked':''}><span><span class="task-title">${escape(task.title)}</span><small>${escape(task.owner)} · ${escape(task.project)}</small></span></label></div>`).join(''):'<p class="empty-state">Add a workflow to start your daily checklist.</p>';
  }
  function renderProjects(){
    $('project-list').innerHTML=state.projects.map((project,index)=>`<article class="project-card"><div class="project-card-top"><span class="project-symbol" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><span class="project-number">PROJECT / ${String(index+1).padStart(2,'0')}</span></div><h3>${escape(project.title)}</h3><p>${escape(state.organization)} · Team project</p><label class="project-stage">Project stage<select data-stage="${escape(project.id)}" aria-label="Stage for ${escape(project.title)}">${stages.map(stage=>`<option ${project.stage===stage?'selected':''}>${stage}</option>`).join('')}</select></label><div class="project-track" aria-hidden="true"><span style="width:${[8,50,100][stages.indexOf(project.stage)]}%"></span></div></article>`).join('');
  }
  function renderActivity(){
    $('activity-list').innerHTML=state.activity.length?state.activity.map(item=>`<li class="activity-item"><span class="activity-avatar" aria-hidden="true">${escape(initials(item.actor))}</span><div><p><strong>${escape(item.actor)}</strong> · ${escape(item.action)}</p><small>${escape(item.project)}</small>${item.note?'<p class="activity-note">'+escape(item.note)+'</p>':''}</div><time datetime="${new Date(item.time).toISOString()}">${escape(dateText(item.time))}</time></li>`).join(''):'<li class="empty-state">Your team’s activity will appear here as you use the hub.</li>';
  }
  function renderScheduler(){
    $('toggle-scheduler').textContent=state.paused?'Resume demo scheduler':'Pause demo scheduler';
    $('toggle-scheduler').setAttribute('aria-pressed',String(state.paused));
    $('scheduler-note').textContent=state.paused?'Demo scheduler paused. You can still run a demo manually.':document.hidden?'Demo scheduler waits until this tab is visible.':'Demo scheduler runs while this tab is visible. Nothing is published.';
  }
  function renderAll(){renderIdentity();renderSummary();renderPosts();renderTasks();renderProjects();renderActivity();renderScheduler();}
  function renderChanges(){renderSummary();renderPosts();renderActivity();save();}
  function completePost(post){post.status='completed';log('Demo scheduler','Completed mock post: '+post.title,post.project,'Simulation only — nothing was sent to '+post.platform+'.');}
  function syncSetup(){
    $('organization-input').value=state.organization;
    $('members-input').value=state.members.join('\n');
    $('projects-input').value=state.projects.map(p=>p.title).join('\n');
  }
  $('setup-form').addEventListener('submit',event=>{
    event.preventDefault();$('setup-error').textContent='';
    const names=id=>$(id).value.split(/\r?\n/).map(n=>n.trim()).filter(Boolean);
    const organization=$('organization-input').value.trim(),members=names('members-input'),titles=names('projects-input');
    if(!text(organization,80)||members.length<1||members.length>20||!members.every(n=>text(n,80))||new Set(members).size!==members.length||titles.length<1||titles.length>8||!titles.every(n=>text(n,100))||new Set(titles).size!==titles.length){error('setup-error','Enter an organization, 1–20 distinct member names (80 characters each), and 1–8 distinct project titles (100 characters each).');return;}
    const wasGenerated=state.generated;
    const previous=state.projects;
    state.organization=organization;state.members=members;state.projects=titles.map(title=>previous.find(p=>p.title===title)||{id:uid(),title,stage:'Planned'});
    if(!wasGenerated){state.posts=[];state.tasks=['Daily team check-in','Review scheduled posts','Update project progress'].map((title,index)=>({id:uid(),title,owner:members[index%members.length],project:titles[index%titles.length],done:false}));state.activity=[];state.projects.forEach(p=>{p.stage='Planned';});}
    state.generated=true;log(members[0],wasGenerated?'Updated workspace details':'Generated a personalized automation hub');save();renderAll();$('setup').open=false;$('page-title').setAttribute('tabindex','-1');$('page-title').focus();announce('Your hub for '+organization+' is ready. Changes are local to this browser.');
  });
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderPosts();announce('Showing '+filter+' posts.');
  }));
  $('post-list').addEventListener('click',event=>{
    const button=event.target.closest('button[data-run],button[data-cancel]');if(!button)return;
    const post=state.posts.find(p=>p.id===(button.dataset.run||button.dataset.cancel));if(!post||post.status!=='scheduled')return;
    if(button.dataset.run)completePost(post);else{post.status='cancelled';log(post.owner,'Cancelled mock post: '+post.title,post.project);}
    renderChanges();announce(button.dataset.run?'Mock post completed. Nothing was published.':'Mock post cancelled.');$('open-post').focus();
  });
  $('daily-list').addEventListener('change',event=>{
    const task=state.tasks.find(t=>t.id===event.target.dataset.task);if(!task)return;task.done=event.target.checked;
    log(task.owner,(task.done?'Completed workflow: ':'Reopened workflow: ')+task.title,task.project);renderSummary();renderActivity();save();announce('Workflow '+(task.done?'completed.':'reopened.'));
  });
  $('project-list').addEventListener('change',event=>{
    const project=state.projects.find(p=>p.id===event.target.dataset.stage);if(!project||!stages.includes(event.target.value))return;project.stage=event.target.value;
    log('Team','Set project stage to '+project.stage,project.title);renderSummary();renderActivity();save();
    const track=event.target.closest('.project-card').querySelector('.project-track span');track.style.width=[8,50,100][stages.indexOf(project.stage)]+'%';announce(project.title+' is '+project.stage+'.');
  });
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.close).close()));
  $('open-post').addEventListener('click',()=>{
    $('post-form').reset();$('post-error').textContent='';populateOwnersAndProjects('post');
    const date=new Date(Date.now()+5*60000);const local=new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);$('post-time').value=local;$('post-dialog').showModal();
  });
  $('post-form').addEventListener('submit',event=>{
    event.preventDefault();const title=$('post-title').value.trim(),scheduledAt=new Date($('post-time').value).getTime(),owner=$('post-owner').value,project=$('post-project').value,platform=$('post-platform').value;
    if(!text(title)||!Number.isSafeInteger(scheduledAt)||scheduledAt<Date.now()||scheduledAt>Date.now()+366*86400000||!state.members.includes(owner)||!state.projects.some(p=>p.title===project)||!platforms.includes(platform)||state.posts.length>=100){error('post-error','Use a title, an available owner/project, and a future time within one year. Each hub holds up to 100 posts.');return;}
    state.posts.push({id:uid(),title,platform,owner,project,scheduledAt,status:'scheduled'});log(owner,'Scheduled mock post: '+title,project,platform+' · '+dateText(scheduledAt));renderChanges();$('post-dialog').close();announce('Mock post scheduled in this browser. Nothing will be sent to '+platform+'.');
  });
  $('open-update').addEventListener('click',()=>{$('update-form').reset();$('update-error').textContent='';populateOwnersAndProjects('update');$('update-dialog').showModal();});
  $('update-form').addEventListener('submit',event=>{
    event.preventDefault();const note=$('update-note').value.trim(),owner=$('update-owner').value,project=$('update-project').value,status=$('update-status').value;
    if(!text(note,400)||!state.members.includes(owner)||!state.projects.some(p=>p.title===project)||!['On track','Needs help','Completed'].includes(status)){error('update-error','Enter an update and select a current team member and project.');return;}
    log(owner,'Shared status: '+status,project,note);renderActivity();save();$('update-dialog').close();announce('Status update added to this browser’s activity tracker.');
  });
  $('open-task').addEventListener('click',()=>{$('task-form').reset();$('task-error').textContent='';populateOwnersAndProjects('task');$('task-dialog').showModal();});
  $('task-form').addEventListener('submit',event=>{
    event.preventDefault();const title=$('task-title').value.trim(),owner=$('task-owner').value,project=$('task-project').value;
    if(!text(title)||!state.members.includes(owner)||!state.projects.some(p=>p.title===project)||state.tasks.length>=100){error('task-error','Enter a task title and choose a current owner/project. Each hub holds up to 100 tasks.');return;}
    state.tasks.push({id:uid(),title,owner,project,done:false});log(owner,'Added workflow: '+title,project);renderTasks();renderSummary();renderActivity();save();$('task-dialog').close();announce('Daily workflow added.');
  });
  $('toggle-scheduler').addEventListener('click',()=>{state.paused=!state.paused;renderScheduler();save();announce(state.paused?'Demo scheduler paused.':'Demo scheduler resumed.');});
  document.addEventListener('visibilitychange',renderScheduler);
  window.setInterval(()=>{
    if(state.paused||document.hidden||document.querySelector('dialog[open]'))return;
    const due=state.posts.filter(p=>p.status==='scheduled'&&p.scheduledAt<=Date.now());
    if(due.length){due.forEach(completePost);renderChanges();announce(due.length+' mock post(s) completed. No real posts were published.');}
  },1000);
  $('reset-example').addEventListener('click',()=>$('reset-dialog').showModal());
  $('confirm-reset').addEventListener('click',()=>{state=example();filter='all';document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));save();renderAll();syncSetup();$('setup').open=true;$('reset-dialog').close();announce('Example workspace restored.');});

  $('download-hub').addEventListener('click',async()=>{
    const button=$('download-hub');button.disabled=true;button.textContent='Preparing your hub…';
    try{
      const load=async url=>{const response=await fetch(url);if(!response.ok)throw Error('Could not load source');return response.text();};
      const css=document.querySelector('style[data-relay]')?.textContent||await load(document.querySelector('link[href^="./style.css"]').href);
      let code=document.querySelector('script[data-relay]')?.textContent||await load(document.querySelector('script[src^="./script.js"]').src);
      const prefix="document.addEventListener('DOMContentLoaded', function () {\n";
      if(code.startsWith(prefix))code=code.slice(prefix.length,-4);
      const page=document.documentElement.cloneNode(true);
      page.querySelectorAll('dialog').forEach(d=>d.removeAttribute('open'));
      page.querySelectorAll('form').forEach(form=>form.reset());
      page.querySelectorAll('.form-error').forEach(e=>{e.textContent='';});
      page.querySelectorAll('#relay-preset,style[data-relay],script[data-relay],link[href^="./style.css"],script[src^="./script.js"]').forEach(n=>n.remove());
      page.querySelector('#download-hub').disabled=false;page.querySelector('#download-hub').textContent='Download my hub ↓';
      page.querySelector('#announcement').textContent='';
      const style=document.createElement('style');style.dataset.relay='';style.textContent=css;page.querySelector('head').append(style);
      const presetNode=document.createElement('script');presetNode.id='relay-preset';presetNode.type='application/json';
      presetNode.textContent=JSON.stringify({...clone(state),generated:true,paused:true,copyId:uid()}).replaceAll('<','\\u003c');page.querySelector('body').append(presetNode);
      const script=document.createElement('script');script.dataset.relay='';script.textContent=prefix+code.replace(/<\/script/gi,'<\\/script')+'\n});';page.querySelector('body').append(script);
      const blob=new Blob(['<!DOCTYPE html>\n'+page.outerHTML],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download=(state.organization.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,60)||'my-team')+'-automation-hub.html';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Your standalone hub has been downloaded with your data. Its demo scheduler starts paused.');
    }catch{announce('Could not prepare your download. Use the hosted site or serve the source through a local static server, then try again.');}
    finally{button.disabled=false;button.textContent='Download my hub ↓';}
  });
  syncSetup();$('setup').open=!state.generated;renderAll();save();
})();
