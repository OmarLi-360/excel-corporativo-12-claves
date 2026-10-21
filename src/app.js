/* ======================================================================
   APLICACIÓN · vistas generales, módulo de clave y enrutador
   ====================================================================== */
const app = $("#app");
let DIAGR = {};
const MOD_ARCHIVO = {1:"Distribuidora_Andina_practica.xlsx", 2:"Distribuidora_Andina_practica.xlsx", 3:"Distribuidora_Andina_practica.xlsx", 4:"Distribuidora_Andina_practica.xlsx", 5:"Distribuidora_Andina_practica.xlsx", 7:"Andina_listo_para_dinamicas.xlsx"};

/* ---------- INICIO ---------- */
function viewInicio(){
  app.innerHTML = `
  <div class="wrap">
    <div class="hero">
      <div class="stack" style="gap:18px">
        ${fxbar("A1", `=<span class="fn">APRENDER</span>(<span class="str">"Excel"</span>; 12 claves; <span class="fn">VERIFICAR</span>())`)}
        <h1>Excel que se puede filtrar, cruzar, resumir y explicar.</h1>
        <p class="lead">Una guía de estudio para aprendices SENA y estudiantes que llegan a equipos de análisis de datos e informes. Corrige primero las brechas de lo básico y sube al nivel intermedio con datos de una empresa ficticia que funciona como una real. No necesitas saber programar.</p>
        <div class="row"><a class="btn primary" href="#empresa">Empezar por la empresa</a><a class="btn" href="#diagnostico" data-go-diag>Hacer el diagnóstico</a></div>
      </div>
      <div class="stats" aria-label="Por qué importa">
        <div class="stat"><b>94&nbsp;%</b><span>de las hojas de cálculo revisadas en auditorías de campo tenían errores.</span><small>Panko, síntesis de auditorías (2008)</small></div>
        <div class="stat"><b>5,2&nbsp;%</b><span>de las celdas con fórmula tenían error: en una hoja de 2.000 fórmulas son unas 100.</span><small>Panko (1998), citado en EuSpRIG</small></div>
        <div class="stat"><b>71&nbsp;%</b><span>de los usuarios aprendió Excel por su cuenta, sin formación en verificación.</span><small>EuSpRIG 2016</small></div>
        <a class="muted small" href="${GH}/blob/main/docs/BRECHAS.md">Fuentes y método de selección de las 12 claves →</a>
      </div>
    </div>

    <section class="block"><div class="sechead"><span class="eyebrow">Empieza aquí</span><h2>Cuatro pasos, en este orden</h2></div>
      <div class="path">
        <a href="#empresa"><span class="n">1</span><b>Conoce la empresa</b><span>Qué hace Distribuidora Andina, qué áreas producen los datos y cómo están organizados.</span></a>
        <a href="#diagnostico" data-go-diag><span class="n">2</span><b>Haz el diagnóstico</b><span>Ocho preguntas para saber por qué clave empezar.</span></a>
        <a href="#ruta"><span class="n">3</span><b>Estudia las claves</b><span>Cada una con su para qué, un caso real, práctica, Excel, Colab e IA.</span></a>
        <a href="#laboratorio"><span class="n">4</span><b>Construye en el laboratorio</b><span>Talleres guiados para unir Excel y Colab en un tablero real.</span></a>
      </div>
      <p class="muted small" style="margin-top:10px">¿Vas a hacer informes? La <a href="#graficos">capacitación rápida en gráficos</a> te sirve en cualquier momento.</p>
    </section>

    <section class="block" id="diagnostico"><div class="sechead"><span class="eyebrow">Diagnóstico</span><h2>¿Por dónde empiezo?</h2><p class="muted read">Responde con sinceridad: nadie más ve tus respuestas. El resultado ordena las claves que te conviene estudiar primero.</p></div>
      <div class="diag">${DIAG.map((d,i)=>`
        <div class="q"><p>${d.q}</p>
          <div class="seg" role="group" aria-label="Respuesta">
            <button type="button" data-d="${i}" data-v="1" aria-pressed="${DIAGR[i]===1}">Sí</button>
            <button type="button" data-d="${i}" data-v="0" aria-pressed="${DIAGR[i]===0}">No</button>
          </div></div>`).join("")}</div>
      <div class="result" id="diagres"></div>
    </section>

    <section class="block" style="padding-bottom:40px"><div class="sechead"><span class="eyebrow">Cómo funciona cada clave</span><h2>Ocho pasos, del para qué al informe</h2></div>
      <div class="objs" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        ${STEPS.map((s,i)=>`<div><b>${i+1}. ${s[1]}</b><br><span class="muted">${s[2]}</span></div>`).join("")}
      </div>
    </section>
  </div>`;
  app.querySelectorAll("[data-go-diag]").forEach(a=>a.onclick=e=>{ e.preventDefault(); $("#diagnostico").scrollIntoView() });
  app.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{
    DIAGR[b.dataset.d] = +b.dataset.v;
    b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed", x===b));
    paintDiag();
  });
  paintDiag();
}
function paintDiag(){
  const el = $("#diagres"); if(!el) return;
  const answered = Object.keys(DIAGR).length;
  if(answered < DIAG.length){ el.innerHTML = `<span class="muted">Llevas ${answered} de ${DIAG.length} respuestas.</span>`; return }
  const set = [...new Set(DIAG.filter((d,i)=>DIAGR[i]===1).map(d=>d.si))].sort((a,b)=>a-b);
  if(!set.length){ el.innerHTML = `<h3>Tienes bases sólidas.</h3><p class="muted">Empieza por la clave 7 y usa las claves 1 y 5 como repaso rápido. Luego ve directo al laboratorio.</p><div class="row" style="margin-top:10px"><a class="btn primary" href="#clave-07">Ir a la clave 7</a><a class="btn" href="#laboratorio">Ir al laboratorio</a></div>`; return }
  const first = set.find(n=>MOD[n]) || set[0];
  el.innerHTML = `<h3>Tu ruta sugerida: ${set.map(n=>`clave ${n}`).join(" → ")}</h3>
    <p class="muted" style="margin-top:4px">Empieza por la primera disponible. Las que aún no están completas aparecen como «en preparación», con su orientación y un ejemplo.</p>
    <div class="chips" style="margin-top:10px">${set.map(n=>{const k=CLAVES[n-1]; return `<a class="chip" href="#clave-${pad2(n)}">${n} · ${k.t}${MOD[n]?"":" (en preparación)"}</a>`}).join("")}</div>
    <div class="row" style="margin-top:12px"><a class="btn primary" href="#clave-${pad2(first)}">Empezar por la clave ${first}</a></div>`;
}

/* ---------- RUTA ---------- */
function viewRuta(){
  app.innerHTML = `<div class="wrap">
    <div class="mhead"><span class="eyebrow">Ruta de aprendizaje</span><h1>12 claves de Excel corporativo</h1>
      <p class="muted read">Cada clave nace de una brecha documentada en usuarios de Excel. El orden importa: cada tramo se apoya en el anterior. Las claves 1 a 5 y la 7 están completas; las demás ya tienen su orientación y un ejemplo de aplicación.</p></div>
    ${TRAMOS.map((t,ti)=>`<div class="tramo">
      <div class="stack" style="gap:6px"><span class="eyebrow">Tramo ${ti+1}</span><h2>${t.t}</h2><p class="muted small">${t.d}</p></div>
      <div class="cards">${CLAVES.filter(k=>k.tramo===ti).map(card).join("")}</div></div>`).join("")}
    <div style="height:40px"></div>
  </div>`;
}
function card(k){
  const on = !!MOD[k.n], done = PROG.done[k.n];
  return `<a class="kcard ${on?"on":""}" href="#clave-${pad2(k.n)}">
    <div class="cell">${pad2(k.n)}</div>
    <h3>${k.t}</h3>
    <p>${k.brecha}</p>
    <div class="tags"><span class="tag">${k.nivel}</span>${on?`<span class="tag av">Disponible</span>`:`<span class="tag">En preparación</span>`}${k.nueva?`<span class="tag new">Clave nueva</span>`:""}${done?`<span class="tag ok">✓ Completada</span>`:""}</div>
  </a>`;
}

/* Orientación teórica y caso de aplicación (todas las claves) */
function orientacion(k){
  return `<div class="stack">
    <div class="prose"><p>${k.orient}</p></div>
    <div class="caso"><div class="rol" aria-hidden="true">${k.ej.rol}</div>
      <div class="stack" style="gap:8px"><span class="eyebrow">Ejemplo de aplicación · ${k.ej.cargo} en Distribuidora Andina</span>
      <dl><dt>Situación</dt><dd>${k.ej.sit}</dd><dt>Qué hace</dt><dd>${k.ej.ap}</dd><dt>Resultado</dt><dd>${k.ej.res}</dd></dl></div></div>
  </div>`;
}

function viewProximo(n){
  const k = CLAVES[n-1]; if(!k){ location.hash="#ruta"; return }
  app.innerHTML = `<div class="wrap read"><div class="mhead">
    <a href="#ruta" class="muted small">← Ruta de 12 claves</a>
    <span class="eyebrow">Clave ${n} · ${TRAMOS[k.tramo].t} · ${k.nivel}</span><h1>${k.t}</h1><p class="muted">${k.s}</p></div>
    <div class="stack" style="padding-bottom:40px">
      <div class="callout gap"><span class="k">La brecha que corrige</span><p>${k.brecha}</p></div>
      <h2>Para qué sirve</h2>
      ${orientacion(k)}
      <div class="callout"><span class="k">Estado</span><p>Esta clave está en preparación. Tendrá los mismos ocho pasos que las claves disponibles, con su cuaderno de Colab y los mismos datos.</p></div>
      <div class="row"><a class="btn primary" href="#clave-01">Ir a una clave disponible</a></div>
    </div></div>`;
}

/* ---------- MÓDULO ---------- */
const STEPS = [
 ["para","Para qué sirve","Cuándo se usa en el trabajo y un caso real."],
 ["entender","Entender","El concepto, explicado sin atajos."],
 ["error","Ver el error","La versión que circula en las empresas frente a la correcta."],
 ["practicar","Practicar","Un simulador con los datos de la Distribuidora Andina."],
 ["excel","Hacerlo en Excel","Pasos con los menús y funciones de Excel 365 en español."],
 ["colab","Visualizar en Colab","Gráficos interactivos y retos de interpretación, sin programar."],
 ["ia","Apoyarse en IA","Instrucciones listas para copiar, y cómo verificar lo que responde."],
 ["quiz","Autoevaluación","Preguntas con explicación; 3 de 4 correctas completan la clave."],
];
function viewModulo(n){
  const k = CLAVES[n-1], m = MOD[n], sec = id => `<section class="step" id="s-${id}"><div class="sh"><span class="n">${STEPS.findIndex(s=>s[0]===id)+1}</span><h2>${STEPS.find(s=>s[0]===id)[1]}</h2></div>`;
  app.innerHTML = `<div class="wrap">
    <div class="mhead">
      <a href="#ruta" class="muted small">← Ruta de 12 claves</a>
      <span class="eyebrow">Clave ${n} de 12 · ${TRAMOS[k.tramo].t} · ${k.nivel} · ${m.minutos} min</span>
      <h1>${k.t}</h1><p class="muted" style="font-size:1.1rem">${k.s}</p>
      <div class="objs">${m.objetivos.map(o=>`<div>${o}</div>`).join("")}</div>
      ${docenteBox(m.docente)}
    </div>
    <div class="mlayout">
      <nav class="toc" aria-label="Pasos del módulo">${STEPS.map((s,i)=>`<a href="#clave-${pad2(n)}" data-go="${s[0]}"><span>${i+1}</span>${s[1]}</a>`).join("")}</nav>
      <div>
        ${sec("para")}${orientacion(k)}</section>
        ${sec("entender")}<div class="prose">${m.entender}</div></section>
        ${sec("error")}<div class="stack"><div class="callout gap"><span class="k">La brecha</span><p>${k.brecha}</p><p class="muted small">${m.brechaTxt}</p></div>${ERRORES[n]()}</div></section>
        ${sec("practicar")}<div id="sim"></div></section>
        ${sec("excel")}<div class="stack">
            <ol class="steps">${m.excel.map(([t,d])=>`<li><div><b>${t}</b><span>${d}</span></div></li>`).join("")}</ol>
            <div class="callout tip"><span class="k">Separador de argumentos</span><p>Con la configuración regional de Colombia, Excel separa los argumentos con punto y coma (<code>;</code>). Si tu equipo está en inglés o con otra región, usa coma y los nombres en inglés (ver Glosario).</p></div>
            <p class="muted small">Practica con <a href="${RAW}/data/${MOD_ARCHIVO[n]}">${MOD_ARCHIVO[n]}</a>.</p>
          </div></section>
        ${sec("colab")}<div class="colab"><div class="stack" style="gap:8px"><span class="eyebrow">Cuaderno ${m.notebook}</span><p>${m.colabQue}</p><p class="muted small">Ábrelo, usa <b>Archivo › Guardar una copia en Drive</b> y luego <b>Entorno de ejecución › Ejecutar todas</b>. El código está oculto: solo eliges opciones en las listas desplegables. ¿Primera vez? Haz el <a href="#taller-0">Taller 0</a>.</p></div>
            <div class="stack" style="gap:8px"><a class="btn primary" href="${colabURL(m.notebook)}" target="_blank" rel="noopener">Abrir en Colab</a></div></div></section>
        ${sec("ia")}<div class="stack">
            <p class="read">Úsalas con Claude, Gemini, ChatGPT o Copilot. Reemplaza lo que está entre corchetes. La regla: <b>la IA propone, tú verificas</b> con casos cuyo resultado ya conoces.</p>
            ${promptsHTML(m.ia)}
            <div class="callout warn"><span class="k">Antes de pegar datos</span><p>${m.iaCuidado}</p></div>
          </div></section>
        ${sec("quiz")}<div class="quiz" id="quiz"></div></section>
      </div>
    </div></div>`;
  app.querySelectorAll("[data-go]").forEach(a=>a.onclick=e=>{ e.preventDefault(); $("#s-"+a.dataset.go).scrollIntoView() });
  wireCopy(app);
  SIMS[n]($("#sim"));
  renderQuiz($("#quiz"), m.quiz, (ok, res, retry)=>{
    const need=Math.ceil(m.quiz.length*.75); PROG.quiz[n]=ok; if(ok>=need) PROG.done[n]=true; saveProg();
    res.innerHTML = ok>=need
      ? `<h3>${ok} de ${m.quiz.length}: clave ${n} completada.</h3><p class="muted">Tu progreso se guarda en este navegador.</p><div class="row" style="margin-top:10px">${nextLink(n)}</div>`
      : `<h3>${ok} de ${m.quiz.length}.</h3><p class="muted">Repasa las explicaciones y vuelve a intentarlo.</p><div class="row" style="margin-top:10px"><button class="btn" data-retry>Intentar de nuevo</button></div>`;
    const r=res.querySelector("[data-retry]"); if(r) r.onclick=retry;
  });
}
function nextLink(n){ const i=PILOTO.indexOf(n); const nx=PILOTO[i+1]; return nx?`<a class="btn primary" href="#clave-${pad2(nx)}">Siguiente: clave ${nx}</a>`:`<a class="btn primary" href="#laboratorio">Ir al laboratorio</a>` }

/* ---------- GLOSARIO ---------- */
function viewGlosario(){
  app.innerHTML = `<div class="wrap read"><div class="mhead"><span class="eyebrow">Glosario</span><h1>Funciones y herramientas en español e inglés</h1>
    <p class="muted">Los tutoriales en internet suelen estar en inglés. Esta tabla te ayuda a traducir. Recuerda: en español los argumentos se separan con punto y coma.</p>
    <label for="gq" class="eyebrow" style="margin-top:6px">Buscar<input type="search" id="gq" placeholder="BUSCARX, SUMIFS, segmentación…" style="display:block; width:100%; margin-top:6px"></label></div>
    <div class="scroll" style="padding-bottom:40px"><table class="datatbl" id="gt"></table></div></div>`;
  const draw=q=>{ q=(q||"").toLowerCase(); $("#gt").innerHTML=`<tr><th>Español</th><th>Inglés</th><th>Para qué sirve</th><th>Clave</th></tr>`+
    GLOS.filter(g=>!q||g.join(" ").toLowerCase().includes(q)).map(g=>`<tr><td class="mono"><b>${g[0]}</b></td><td class="mono">${g[1]}</td><td>${g[2]}</td><td><a href="#clave-${pad2(g[3])}">${g[3]}</a></td></tr>`).join("") };
  $("#gq").oninput=e=>draw(e.target.value); draw();
}

/* ---------- enrutador ---------- */
function route(){
  const h = (location.hash||"#inicio").slice(1);
  const navKey = h.startsWith("clave-") ? "ruta" : h.startsWith("taller-") ? "laboratorio" : h==="datos" ? "empresa" : h;
  document.querySelectorAll("nav.main a").forEach(a=>a.toggleAttribute("aria-current", a.dataset.nav===navKey));
  document.querySelectorAll("nav.main a[aria-current]").forEach(a=>a.setAttribute("aria-current","page"));
  if(h==="ruta") viewRuta();
  else if(h==="empresa"||h==="datos") viewEmpresa();
  else if(h==="graficos") viewGraficos();
  else if(h==="laboratorio") viewLaboratorio();
  else if(h.startsWith("taller-")) viewTaller(+h.slice(7));
  else if(h==="glosario") viewGlosario();
  else if(h.startsWith("clave-")){ const n=+h.slice(6); MOD[n] ? viewModulo(n) : viewProximo(n) }
  else if(h==="diagnostico"){ viewInicio(); setTimeout(()=>$("#diagnostico").scrollIntoView(),0); return }
  else viewInicio();
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", route);
$("#modoDocente").onclick = ()=> setInstructor(!document.body.classList.contains("instructor"));
setInstructor(store.get("ec12-docente", false));
paintMeter(); route();
