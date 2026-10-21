const $ = (id) => document.getElementById(id);
let activities = [
 {id:1,name:"Jornada de cuidado del entorno",description:"Actividad de ejemplo para mejorar y cuidar los espacios comunes.",category:"Ambiental",owner:"Equipo PAEC",date:"2026-10-20",status:"En proceso",file:"jornada_entorno.jpg"},
 {id:2,name:"Organización de evidencias escolares",description:"Reunir y ordenar los archivos de las actividades del grupo.",category:"Escolar",owner:"Comité de trabajo",date:"2026-10-22",status:"Pendiente",file:""},
 {id:3,name:"Encuesta de convivencia",description:"Recopilar opiniones para conocer necesidades de la comunidad escolar.",category:"Socioemocional",owner:"Equipo PAEC",date:"2026-10-17",status:"Completada",file:"reporte_actividad.pdf"}
];
let nextId=4;
const dialog=$("activityDialog"), loginDialog=$("loginDialog");
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){
 const q=$("searchInput").value.toLowerCase(), st=$("statusFilter").value, cat=$("categoryFilter").value;
 const filtered=activities.filter(a=>(`${a.name} ${a.owner} ${a.description}`.toLowerCase().includes(q))&&(!st||a.status===st)&&(!cat||a.category===cat));
 $("activityRows").innerHTML=filtered.length?filtered.map(a=>`<tr><td>${escapeHtml(a.name)}<small>${escapeHtml(a.description)}</small></td><td><span class="category">${escapeHtml(a.category)}</span></td><td>${escapeHtml(a.owner)}</td><td>${new Date(a.date+"T12:00:00").toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}</td><td><span class="state ${a.status.replace(" ","-")}">${escapeHtml(a.status)}</span></td><td><button class="action-btn" data-edit="${a.id}">Editar</button><button class="action-btn" data-delete="${a.id}">Eliminar</button></td></tr>`).join(""):`<tr><td colspan="6" style="text-align:center;padding:35px;color:#87958d">No se encontraron actividades.</td></tr>`;
 $("totalStat").textContent=activities.length;
 $("pendingStat").textContent=activities.filter(a=>a.status!=="Completada").length;
 $("doneStat").textContent=activities.filter(a=>a.status==="Completada").length;
 const files=activities.filter(a=>a.file).length;
 $("evidenceStat").textContent=files;$("evidenceCount").textContent=files;
 $("evidenceGrid").innerHTML=activities.filter(a=>a.file).map(a=>`<article class="evidence-card"><div class="file-icon ${a.file.toLowerCase().endsWith(".pdf")?"doc-file":"image-file"}">${a.file.toLowerCase().endsWith(".pdf")?"▤":"▧"}</div><div><b>${escapeHtml(a.file)}</b><small>${escapeHtml(a.name)}</small></div><span class="file-type">${escapeHtml(a.file.split(".").pop().toUpperCase())}</span></article>`).join("")||'<p class="footnote">Todavía no hay evidencias adjuntas.</p>';
}
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function resetForm(){ $("activityForm").reset();$("editId").value="";$("dialogTitle").textContent="Nueva actividad"; }
function openNew(){resetForm();$("activityDate").value=new Date().toISOString().slice(0,10);dialog.showModal()}
$("newActivityBtn").addEventListener("click",openNew);$("closeDialog").addEventListener("click",()=>dialog.close());$("cancelDialog").addEventListener("click",()=>dialog.close());
$("activityForm").addEventListener("submit",e=>{
 e.preventDefault();const id=Number($("editId").value), file=$("activityFile").files[0]?.name||"";
 const data={name:$("activityName").value.trim(),description:$("activityDescription").value.trim(),date:$("activityDate").value,owner:$("activityOwner").value.trim(),category:$("activityCategory").value,status:$("activityStatus").value};
 if(id){const old=activities.find(a=>a.id===id);Object.assign(old,data);if(file)old.file=file;toast("Actividad actualizada en esta demostración.");}
 else{activities.unshift({id:nextId++,...data,file});toast("Actividad agregada en esta demostración.");}
 dialog.close();render();
});
$("activityRows").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit]"), del=e.target.closest("[data-delete]");
 if(edit){const a=activities.find(x=>x.id===Number(edit.dataset.edit));if(!a)return;resetForm();$("editId").value=a.id;$("dialogTitle").textContent="Editar actividad";$("activityName").value=a.name;$("activityDescription").value=a.description;$("activityDate").value=a.date;$("activityOwner").value=a.owner;$("activityCategory").value=a.category;$("activityStatus").value=a.status;dialog.showModal();}
 if(del){const a=activities.find(x=>x.id===Number(del.dataset.delete));if(a&&confirm(`¿Eliminar la actividad "${a.name}" de esta demostración?`)){activities=activities.filter(x=>x.id!==a.id);render();toast("Registro eliminado de esta demostración.");}}
});
$("searchInput").addEventListener("input",render);$("statusFilter").addEventListener("change",render);$("categoryFilter").addEventListener("change",render);
$("loginBtn").addEventListener("click",()=>loginDialog.showModal());$("closeLogin").addEventListener("click",()=>loginDialog.close());$("cancelLogin").addEventListener("click",()=>loginDialog.close());
$("loginForm").addEventListener("submit",e=>{e.preventDefault();loginDialog.close();toast("Esta vista es una demostración; aún no hay autenticación conectada.");});
$("menuToggle").addEventListener("click",()=>$("nav").classList.toggle("open"));$("nav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
render();
