/* Gut Gyaan — site behaviour (rendering, search, routing, language toggle, breathing guide).
   Content is in content.js; you normally do not need to edit this file. */
(function(){
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function bi(en,hi){return '<span class="en">'+esc(en)+'</span><span class="hi" lang="hi">'+esc(hi)+'</span>'}
  var byId={};DATA.conditions.forEach(function(c){byId[c.id]=c});

  // home: groups
  var groups=document.getElementById('groups');
  groups.innerHTML=DATA.organs.map(function(o){
    var cs=DATA.conditions.filter(function(c){return c.organ===o[0]});
    return '<div class="organ" data-organ="'+o[0]+'"><h3><span class="en">'+esc(o[1])+'</span><span class="hi" lang="hi">'+esc(o[2])+'</span></h3><div class="grid">'+
      cs.map(function(c){return '<a class="card" href="#'+c.id+'" data-s="'+esc((c.en+' '+c.hi+' '+c.tag[0]+' '+c.tag[1]).toLowerCase())+'"><span class="card-k">'+bi(c.en,c.hi)+'</span><span class="card-t en">'+esc(c.tag[0])+'</span><span class="card-t hi" lang="hi">'+esc(c.tag[1])+'</span></a>'}).join('')+
      '</div></div>'}).join('');
  var q=document.getElementById('q');
  q.addEventListener('input',function(){
    var v=q.value.trim().toLowerCase(),any=false;
    groups.querySelectorAll('.organ').forEach(function(g){
      var n=0;g.querySelectorAll('.card').forEach(function(c){var m=!v||c.dataset.s.indexOf(v)>-1;c.hidden=!m;if(m)n++});
      g.hidden=n===0;if(n)any=true});
    document.getElementById('empty').hidden=any;
  });

  // medicines
  document.getElementById('faq').innerHTML=DATA.meds.map(function(m){
    return '<div class="qa"><div class="q">'+bi(m[0],m[1])+'</div><div class="a">'+bi(m[2],m[3])+'</div></div>'}).join('');


  // diets
  var dById={};DATA.diets.forEach(function(d){dById[d.id]=d});
  document.getElementById('dgroups').innerHTML=DATA.dgroups.map(function(g){
    var ds=DATA.diets.filter(function(d){return d.group===g[0]});
    return '<div class="organ"><h3><span class="en">'+esc(g[1])+'</span><span class="hi" lang="hi">'+esc(g[2])+'</span></h3><div class="grid">'+
      ds.map(function(d){return '<a class="card diet-card" href="#'+d.id+'"><span class="card-k">'+bi(d.en,d.hi)+'</span><span class="card-t en">'+esc(d.tag[0])+'</span><span class="card-t hi" lang="hi">'+esc(d.tag[1])+'</span></a>'}).join('')+'</div></div>'}).join('');
  function item(x){return Array.isArray(x)?bi(x[0],x[1]):esc(x)}
  function renderBlock(b){
    var t=b[0];
    if(t==='rules') return '<div class="block dur full"><h3>'+bi('Key rules','मुख्य नियम')+'</h3><ul>'+b[1].map(function(p){return '<li>'+item(p)+'</li>'}).join('')+'</ul></div>';
    if(t==='caution') return '<div class="block warn full"><h3>'+bi('Caution','सावधानी')+'</h3><ul>'+b[1].map(function(p){return '<li>'+item(p)+'</li>'}).join('')+'</ul></div>';
    if(t==='list') return '<div class="block full"><h3>'+bi(b[1],b[2])+'</h3><ul>'+b[3].map(function(p){return '<li>'+item(p)+'</li>'}).join('')+'</ul></div>';
    if(t==='foods'){var col=function(cls,en,hi,arr){return '<div class="fcol '+cls+'"><h4>'+bi(en,hi)+'</h4><ul>'+arr.map(function(p){return '<li>'+item(p)+'</li>'}).join('')+'</ul></div>'};
      return '<div class="block full"><h3>'+bi(b[1],b[2])+'</h3><div class="fcols">'+col('eat','Eat','खाएं',b[3])+(b[4].length?col('lim','Limit','कम करें',b[4]):'')+col('avo','Avoid','न खाएं',b[5])+'</div></div>';}
    if(t==='table') return '<div class="block full"><h3>'+bi(b[1],b[2])+'</h3><div class="tw"><table><thead><tr>'+b[3].map(function(h){return '<th>'+esc(h)+'</th>'}).join('')+'</tr></thead><tbody>'+
      b[4].map(function(r,i){return '<tr'+(r[0]==='Total'?' class="tot"':'')+'>'+r.map(function(c){return '<td>'+esc(c)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'+(b[5]?'<p class="tfoot">'+esc(b[5])+'</p>':'')+'</div>';
    return '';
  }
  function renderDiet(d){
    var g=DATA.dgroups.filter(function(x){return x[0]===d.group})[0];
    document.getElementById('detail-body').innerHTML='<div class="crumbs"><a href="#diets">&larr; All diets</a><a href="#topics">Conditions</a></div>'+
      '<div class="topic-head"><p class="kicker">Diet · '+esc(g[1])+'</p><h2><span class="hi" lang="hi">'+esc(d.hi)+'</span><span class="en">'+esc(d.en)+'</span></h2><p class="sub">'+bi(d.tag[0],d.tag[1])+'</p></div>'+
      '<div class="blocks">'+d.blocks.map(renderBlock).join('')+'</div>'+
      '<p class="note" style="margin-top:28px">'+bi('General guidance. Your needs may differ, especially with diabetes, kidney disease or pregnancy. Check with your doctor or dietitian.','सामान्य जानकारी — डायबिटीज़, किडनी रोग या गर्भावस्था में अपने डॉक्टर / डाइटीशियन से पूछें।')+'</p>'+
      '<p class="noprint" style="margin-top:16px;font-size:16px">'+bi('Tip: use Print → Save as PDF in your browser to keep this chart.','सुझाव: ब्राउज़र में Print → Save as PDF से चार्ट सेव करें।')+'</p>';
    document.title=d.en+' · Gut Gyaan';
  }

  // detail
  function renderDetail(c){
    var o=DATA.organs.filter(function(x){return x[0]===c.organ})[0];
    var list=DATA.conditions, i=list.indexOf(c), prev=list[i-1], next=list[i+1];
    var html='<div class="crumbs"><a href="#topics">&larr; All conditions</a><a href="#medicines">Medicines: how long?</a></div>'+
      '<div class="topic-head"><p class="kicker">'+esc(o[1])+'</p><h2><span class="hi" lang="hi">'+esc(c.hi)+'</span><span class="en">'+esc(c.en)+'</span></h2>'+
      '<p class="sub">'+bi(c.tag[0],c.tag[1])+'</p></div><div class="blocks">'+
      c.sections.map(function(s){
        var cls=s[2]==='warn'?' warn':(s[2]==='dur'?' dur':'');
        return '<div class="block'+cls+'"><h3>'+bi(s[0],s[1])+'</h3><ul>'+s[3].map(function(p){return '<li>'+bi(p[0],p[1])+'</li>'}).join('')+'</ul></div>'}).join('')+
      '</div>'+((DATA.cdiets[c.id]||[]).length?'<div class="dietlinks"><h3>'+bi('Diet for this condition','इस बीमारी की डाइट')+'</h3><div class="chips">'+DATA.cdiets[c.id].map(function(id){var d=dById[id];return '<a class="chip" href="#'+id+'">'+esc(d.en)+'</a>'}).join('')+'</div></div>':'')+'<p class="note" style="margin-top:28px">'+bi('This page is general education. Your own treatment plan may differ, so follow your doctor\'s advice.','यह सामान्य जानकारी है। आपका इलाज अलग हो सकता है — अपने डॉक्टर की सलाह मानें।')+'</p>'+
      '<div class="pager">'+(prev?'<a href="#'+prev.id+'">&larr; '+esc(prev.en)+'</a>':'<span></span>')+(next?'<a href="#'+next.id+'">'+esc(next.en)+' &rarr;</a>':'')+'</div>';
    document.getElementById('detail-body').innerHTML=html;
    document.title=c.en+' · Gut Gyaan';
  }
  function route(){
    var h=(location.hash||'').slice(1),c=byId[h],dd=dById[h];
    var home=document.getElementById('home'),det=document.getElementById('detail');
    if(c||dd){if(c)renderDetail(c);else renderDiet(dd);home.hidden=true;det.hidden=false;window.scrollTo(0,0)}
    else{document.title='Gut Gyaan with Dr Ravi';det.hidden=true;home.hidden=false;
      if(h){var el=document.getElementById(h);if(el)el.scrollIntoView()}}
  }
  window.addEventListener('hashchange',route);route();

  // language toggle
  var btns=document.querySelectorAll('.lang button');
  function setLang(l){document.body.setAttribute('data-lang',l);btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===l?'true':'false')});try{localStorage.setItem('gg-lang',l)}catch(e){}}
  btns.forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l)})});
  try{var s=localStorage.getItem('gg-lang');if(s)setLang(s)}catch(e){}

  // breathing guide
  var MODES={
    box:{phases:[["Inhale","साँस लें",4],["Hold","रोकें",4],["Exhale","साँस छोड़ें",4],["Hold","रोकें",4]],
      howto:'<ol><li>Sit upright and relax your shoulders.</li><li>Follow the dot around the square: in 4, hold 4, out 4, hold 4.</li><li>Do 4–5 rounds, whenever stress upsets your stomach.</li></ol>'},
    dia:{phases:[["Breathe in","नाक से साँस लें",4],["Breathe out","होंठ सिकोड़कर छोड़ें",6]],
      howto:'<ol><li>One hand on your chest, one on your belly.</li><li>Breathe in through the nose for 4 seconds. The belly rises, the chest stays still.</li><li>Breathe out slowly through pursed lips for 6 seconds.</li><li>5–10 minutes, 2–3 times a day. Helpful in IBS, bloating, belching and reflux.</li></ol>'}
  };
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mode='box',running=false,raf=null,t0=0,rounds=0,lastCycle=0;
  var $=function(id){return document.getElementById(id)};
  var dot=$('dot'),sq=$('sq'),ring=$('ring');
  var corners=[[40,260],[40,40],[260,40],[260,260]]; // inhale goes up the left side
  function cycleLen(){return MODES[mode].phases.reduce(function(a,p){return a+p[2]},0)}
  function show(){var m=MODES[mode];$('howto').innerHTML=m.howto;var isBox=mode==='box';sq.style.display=isBox?'':'none';dot.style.display=isBox?'':'none';ring.style.display=isBox?'none':'';ring.setAttribute('r',70);dot.setAttribute('cx',40);dot.setAttribute('cy',260);
    $('count').textContent=m.phases[0][2];$('p-en').textContent='Press Start';$('p-hi').textContent='शुरू करें दबाएं';}
  function frame(now){
    var el=(now-t0)/1000,L=cycleLen(),c=Math.floor(el/L);
    if(c>lastCycle){lastCycle=c;rounds++;$('rounds').textContent='Rounds completed: '+rounds}
    var inC=el%L,ph=MODES[mode].phases,i=0,acc=0;
    while(inC>=acc+ph[i][2]){acc+=ph[i][2];i++}
    var f=(inC-acc)/ph[i][2];
    $('p-en').textContent=ph[i][0];$('p-hi').textContent=ph[i][1];$('count').textContent=Math.ceil(ph[i][2]-(inC-acc));
    if(mode==='box'){var a=corners[i],b=corners[(i+1)%4],g=reduce?0:f;dot.setAttribute('cx',a[0]+(b[0]-a[0])*g);dot.setAttribute('cy',a[1]+(b[1]-a[1])*g)}
    else{var r=i===0?70+60*(reduce?1:f):130-60*(reduce?1:f);ring.setAttribute('r',r)}
    raf=requestAnimationFrame(frame);
  }
  function start(){running=true;$('go').textContent='Stop';t0=performance.now();lastCycle=0;raf=requestAnimationFrame(frame)}
  function stop(){running=false;$('go').textContent='Start';if(raf)cancelAnimationFrame(raf);show()}
  $('go').addEventListener('click',function(){running?stop():start()});
  function setMode(m){mode=m;$('mode-box').setAttribute('aria-pressed',m==='box');$('mode-dia').setAttribute('aria-pressed',m==='dia');rounds=0;$('rounds').textContent='Rounds completed: 0';if(running)stop();else show()}
  $('mode-box').addEventListener('click',function(){setMode('box')});
  $('mode-dia').addEventListener('click',function(){setMode('dia')});
  show();
})();
