import { useState, useEffect, useRef } from “react”;
import * as THREE from “three”;

/* ═══════════════════════════════════════════════════════════
REGERENT PRO — PLAYER COMMAND CENTER v6 FINAL
Pape Matar Sarr · #29

- Instagram Share · Biometric Passport · Alerts · Transitions
  ═══════════════════════════════════════════════════════════ */

const C = {
bg: “#04080F”, s1: “#0A1520”, card: “#121F33”,
b: “rgba(255,255,255,0.05)”, bl: “rgba(255,255,255,0.1)”,
w: “#EEF1F6”, d: “rgba(255,255,255,0.5)”, m: “rgba(255,255,255,0.22)”,
blue: “#3B82F6”, bD: “rgba(59,130,246,0.12)”, bG: “rgba(59,130,246,0.25)”,
green: “#22C55E”, gD: “rgba(34,197,94,0.1)”,
amber: “#F59E0B”, aD: “rgba(245,158,11,0.1)”,
red: “#EF4444”, rD: “rgba(239,68,68,0.1)”,
purple: “#A855F7”, cyan: “#06B6D4”,
};
const F = { h: “‘Outfit’,sans-serif”, b: “‘Plus Jakarta Sans’,sans-serif” };

const S = {
name: “Pape Matar”, last: “Sarr”, club: “Tottenham Hotspur”, num: “29”, pos: “CM”, age: 22,
readiness: 82, acwr: 1.12, risk: 14, matchReadiness: 88,
sleep: { total: 7.8, deep: 1.9, rem: 1.7, light: 3.6, awake: 0.6, hrv: 72, rhr: 51, spo2: 98, eff: 91, bed: “23:15”, wake: “07:05”,
stages: [2,2,1,1,1,2,2,3,3,2,2,1,1,2,2,2,3,3,3,2,2,1,1,1,2,2,3,3,2,2,2,4,2,2,1,1,2,2,3,3,3,2,2,2,2,4,2,2,3,3,2,2,1,1,2,2,3,3,2,2,4,2,2,2,3,3,2,2,2,2,4,4,2,2,3,3,2,2,1,2,2,3,3,2,2,2,2,2,4,4],
hrvT: [68,71,74,78,82,79,75,72,69,73,76,80,77,74,71,68,72,75,78,73,70,67,71,74] },
train: { dur: 88, avg: 142, max: 186, trimp: 312,
zones: [{n:“Récup”,c:”#60A5FA”,p:14,min:12},{n:“Endurance”,c:”#22C55E”,p:25,min:22},{n:“Tempo”,c:”#F59E0B”,p:32,min:28},{n:“Seuil”,c:”#F97316”,p:20,min:18},{n:“VO2 Max”,c:”#EF4444”,p:9,min:8}],
hr: [85,92,108,122,138,155,162,171,168,152,141,135,148,159,172,180,186,178,165,152,138,142,155,168,175,172,158,145,132,128,135,148,162,175,182,178,168,155,142,138,145,158,168,172,165,152,138,125,118,108,95] },
trends: { r:[78,74,81,85,79,72,68,75,80,84,88,83,79,82], s:[7.2,6.8,7.5,8.1,7.4,6.9,7.0,7.6,8.0,7.8,8.2,7.5,7.3,7.8], h:[65,62,68,74,70,64,61,67,72,76,80,74,70,72], l:[380,420,0,350,410,380,0,320,400,450,0,380,420,312] },
nextMatch: { opponent:“Arsenal”, home:false, date:“05 Mar”, kickoff:“21:00”, comp:“Premier League”, daysUntil:2, venue:“Emirates Stadium” },
season: { apps:28, starts:24, mins:2160, goals:3, assists:5, avgRating:7.2, avgReadiness:79, bestMatchReadiness:92, injuryDays:0 },
recentMatches: [
{ opp:“Man United”,h:true,res:“2-1”,r:85,mins:90,rating:7.8 },
{ opp:“Wolves”,h:false,res:“1-0”,r:79,mins:90,rating:7.4 },
{ opp:“Brighton”,h:true,res:“3-2”,r:88,mins:90,rating:8.2 },
{ opp:“Aston Villa”,h:false,res:“0-0”,r:72,mins:78,rating:6.8 },
{ opp:“Newcastle”,h:true,res:“2-2”,r:82,mins:90,rating:7.1 },
],
recovery: { pct:68, fullTime:“Mar 5, 14:00”, muscular:72, neural:65, metabolic:78 },
jDays: [
{ day:“J-3”,date:“02 Mar”,label:“Charge réduite”,desc:“Séance technique légère.”,done:true,readiness:79 },
{ day:“J-2”,date:“03 Mar”,label:“Activation”,desc:“Activation courte. Vivacité.”,done:false,readiness:82,current:true },
{ day:“J-1”,date:“04 Mar”,label:“Mise au vert”,desc:“Décrassage léger. Hydratation max.”,done:false },
{ day:“MATCH”,date:“05 Mar”,label:“Arsenal (A)”,desc:“21:00 — Emirates Stadium.”,done:false,isMatch:true },
{ day:“J+1”,date:“06 Mar”,label:“Recovery”,desc:“Bain froid + compression.”,done:false },
{ day:“J+2”,date:“07 Mar”,label:“Retour léger”,desc:“Séance régénérative.”,done:false },
],
// Passport data
passport: {
clubs: [{ name: “FC Metz”, period: “2019-2021”, apps: 42 }, { name: “Tottenham”, period: “2021-now”, apps: 98 }],
totalApps: 140, totalMins: 10850, totalGoals: 8, totalAssists: 16,
avgHrv: 71, avgSleep: 7.5, avgReadiness: 77,
injuryHistory: [{ type: “Cuisse D”, date: “Mars 2023”, days: 21 }, { type: “Cheville G”, date: “Nov 2023”, days: 14 }],
peakReadiness: 94, streakClean: 142,
},
// Alerts
alerts: [
{ type: “warning”, icon: “⚠”, msg: “HRV en baisse de 12% sur 3 jours”, time: “Il y a 2h”, color: C.amber },
{ type: “good”, icon: “✓”, msg: “Sommeil profond > 1h45 — 3ème nuit consécutive”, time: “Ce matin”, color: C.green },
],
};

const rCol = v => v >= 75 ? C.green : v >= 50 ? C.amber : C.red;
const rLab = v => v >= 85 ? “Optimal” : v >= 70 ? “Bon” : v >= 50 ? “Modéré” : “Faible”;

// ═══ UI COMPONENTS ═══
const Cd = ({ children, style, glow }) => <div style={{ background: C.card, borderRadius: 16, padding: 16, border: `1px solid ${glow || C.b}`, …style }}>{children}</div>;
const Ring = ({ value, size = 140, sw = 8, color }) => {
const r = (size - sw) / 2, ci = 2 * Math.PI * r, o = ci - (value / 100) * ci;
return <svg width={size} height={size} style={{ transform: “rotate(-90deg)” }}>
<circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.b} strokeWidth={sw} />
<circle cx={size/2} cy={size/2} r={r} fill=“none” stroke={color} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={o} strokeLinecap=“round” style={{ transition: “stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)”, filter: `drop-shadow(0 0 8px ${color}50)` }} />
</svg>;
};
const St = ({ label, val, unit, color = C.w, sm }) => <div style={{ textAlign: “center” }}>

  <p style={{ fontSize: 7, letterSpacing: 2, color: C.m, textTransform: "uppercase", marginBottom: 3, fontFamily: F.b }}>{label}</p>
  <span style={{ fontSize: sm ? 18 : 24, fontWeight: 800, color, fontFamily: F.h }}>{val}</span>
  {unit && <span style={{ fontSize: 9, color: C.d, marginLeft: 2, fontFamily: F.b }}>{unit}</span>}
</div>;
const Chart = ({ data, color = C.blue, h = 60 }) => {
  if (!data || data.length < 2) return null;
  const mx = Math.max(...data) * 1.05, mn = Math.min(...data) * 0.95, rg = mx - mn || 1, w = 300;
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - ((v - mn) / rg) * (h - 8) - 4 }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: h }}>
    <defs><linearGradient id={`f${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
    <path d={path + ` L${w},${h} L0,${h} Z`} fill={`url(#f${color.slice(1)})`} />
    <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r={3.5} fill={color} />
  </svg>;
};
const Bar = ({ v, max = 100, color = C.blue, h = 5 }) => <div style={{ height: h, borderRadius: h, background: C.b, flex: 1 }}><div style={{ height: "100%", width: (v / max * 100) + "%", borderRadius: h, background: color, transition: "width .8s ease" }} /></div>;
const Badge = ({ text, color, bg }) => <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 5, color, background: bg, fontFamily: F.b }}>{text}</span>;

// ═══ INSTAGRAM SHARE BUTTON ═══
function IGShare({ screen }) {
const [show, setShow] = useState(false);
const labels = { home: “Mon readiness du jour”, jday: “Mon countdown match”, career: “Mes stats saison”, passport: “Mon passeport biométrique” };
if (!labels[screen]) return null;
return <>
<button onClick={() => setShow(true)} style={{ position: “fixed”, bottom: 80, right: 16, width: 44, height: 44, borderRadius: 12, background: “linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)”, border: “none”, cursor: “pointer”, zIndex: 50, display: “flex”, alignItems: “center”, justifyContent: “center”, boxShadow: “0 4px 20px rgba(131,58,180,0.4)” }}>
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff" stroke="none"/></svg>
</button>
{show && <div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.85)”, zIndex: 200, display: “flex”, alignItems: “center”, justifyContent: “center”, padding: 20 }} onClick={() => setShow(false)}>
<div onClick={e => e.stopPropagation()} style={{ width: “100%”, maxWidth: 360, borderRadius: 20, overflow: “hidden” }}>
{/* Story preview */}
<div style={{ background: `linear-gradient(180deg, ${C.s1}, ${C.bg})`, padding: 24, textAlign: “center” }}>
<div style={{ display: “flex”, alignItems: “center”, justifyContent: “center”, gap: 5, marginBottom: 16 }}>
<span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, color: C.w, fontFamily: F.h }}>REGERENT</span>
<span style={{ fontSize: 7, fontWeight: 700, color: C.blue, padding: “2px 5px”, border: `1px solid ${C.bD}`, borderRadius: 3, fontFamily: F.b }}>PRO</span>
</div>
<Ring value={S.readiness} size={120} sw={8} color={rCol(S.readiness)} />
<div style={{ marginTop: -90, position: “relative” }}>
<span style={{ fontSize: 44, fontWeight: 800, color: rCol(S.readiness), fontFamily: F.h }}>{S.readiness}</span>
<p style={{ fontSize: 8, color: C.d, fontFamily: F.b, letterSpacing: 1 }}>READINESS</p>
</div>
<div style={{ marginTop: 30 }}>
<p style={{ fontSize: 14, fontWeight: 800, color: C.w, fontFamily: F.h }}>{S.name} {S.last}</p>
<p style={{ fontSize: 9, color: C.d, fontFamily: F.b, marginTop: 4 }}>Arsenal (A) · J-{S.nextMatch.daysUntil} · Match Readiness {S.matchReadiness}</p>
</div>
<div style={{ display: “flex”, justifyContent: “center”, gap: 16, marginTop: 16 }}>
{[[“Sommeil”, S.sleep.total + “h”], [“HRV”, S.sleep.hrv + “ms”], [“ACWR”, S.acwr]].map(([l, v], i) => <div key={i} style={{ textAlign: “center” }}>
<p style={{ fontSize: 16, fontWeight: 800, color: C.blue, fontFamily: F.h }}>{v}</p>
<p style={{ fontSize: 7, color: C.m, fontFamily: F.b }}>{l}</p>
</div>)}
</div>
<p style={{ fontSize: 8, color: C.m, marginTop: 16, fontFamily: F.b }}>regerent.com</p>
</div>
<button onClick={() => setShow(false)} style={{ width: “100%”, padding: 16, background: “linear-gradient(135deg, #833AB4, #FD1D1D)”, border: “none”, color: “#fff”, fontSize: 13, fontWeight: 700, cursor: “pointer”, fontFamily: F.b }}>
Partager en Story
</button>
<button onClick={() => setShow(false)} style={{ width: “100%”, padding: 12, background: C.card, border: “none”, color: C.d, fontSize: 11, cursor: “pointer”, fontFamily: F.b }}>
Annuler
</button>
</div>
</div>}
</>;
}

// ═══ ALERTS BANNER ═══
function AlertsBanner() {
const [dismissed, setDismissed] = useState([]);
const visible = S.alerts.filter((_, i) => !dismissed.includes(i));
if (visible.length === 0) return null;
return <div style={{ padding: “0 16px”, marginBottom: 8 }}>
{S.alerts.map((a, i) => {
if (dismissed.includes(i)) return null;
return <div key={i} style={{ display: “flex”, alignItems: “center”, gap: 8, padding: “10px 12px”, marginBottom: 6, borderRadius: 12, background: a.color === C.amber ? C.aD : C.gD, border: `1px solid ${a.color}20` }}>
<span style={{ fontSize: 14 }}>{a.icon}</span>
<div style={{ flex: 1 }}>
<p style={{ fontSize: 10, fontWeight: 600, color: a.color, fontFamily: F.b }}>{a.msg}</p>
<p style={{ fontSize: 8, color: C.m, fontFamily: F.b, marginTop: 1 }}>{a.time}</p>
</div>
<button onClick={() => setDismissed(p => […p, i])} style={{ background: “none”, border: “none”, color: C.m, cursor: “pointer”, fontSize: 14, padding: 4 }}>×</button>
</div>;
})}

  </div>;
}

// ═══ RECOVERY HORIZON ═══
const RecovHorizon = ({ v }) => {
const col = rCol(v), ref = useRef(null);
useEffect(() => {
const cvs = ref.current; if (!cvs) return;
const ctx = cvs.getContext(“2d”), W = cvs.width, H = cvs.height;
let t = 0, af;
const pts = Array.from({ length: 35 }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.5 + 0.5, s: Math.random() * 0.3 + 0.1, o: Math.random() * 0.4 + 0.1 }));
const rc = parseInt(col.slice(1, 3), 16), gc = parseInt(col.slice(3, 5), 16), bc = parseInt(col.slice(5, 7), 16);
const draw = () => {
t += 0.008; ctx.clearRect(0, 0, W, H);
for (let L = 0; L < 3; L++) {
const amp = (15 + v * 0.2) * (1 - L * 0.3), freq = 0.008 + L * 0.003, ph = t * (1 + L * 0.5) + L * 1.5, by = H * (0.35 + L * 0.12);
ctx.beginPath(); ctx.moveTo(0, H);
for (let x = 0; x <= W; x += 2) ctx.lineTo(x, by + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.3 + ph * 1.7) * amp * 0.3);
ctx.lineTo(W, H); ctx.closePath();
const gd = ctx.createLinearGradient(0, by - amp, 0, H);
gd.addColorStop(0, `rgba(${rc},${gc},${bc},${(0.12 - L * 0.03).toFixed(2)})`); gd.addColorStop(1, `rgba(${rc},${gc},${bc},0)`);
ctx.fillStyle = gd; ctx.fill();
ctx.beginPath();
for (let x = 0; x <= W; x += 2) { const y = by + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.3 + ph * 1.7) * amp * 0.3; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
ctx.strokeStyle = `rgba(${rc},${gc},${bc},${(0.3 - L * 0.08).toFixed(2)})`; ctx.lineWidth = 1.5 - L * 0.4; ctx.stroke();
}
pts.forEach(p => { p.x += p.s; p.y += Math.sin(t * 2 + p.x * 0.01) * 0.15; if (p.x > W + 5) { p.x = -5; p.y = Math.random() * H * 0.7; } ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${rc},${gc},${bc},${p.o * (0.5 + Math.sin(t * 3 + p.x) * 0.3)})`; ctx.fill(); });
af = requestAnimationFrame(draw);
};
draw(); return () => cancelAnimationFrame(af);
}, [v]);
return <canvas ref={ref} width={480} height={120} style={{ width: “100%”, height: 120, display: “block” }} />;
};

// ═══ 3D BG MANNEQUIN ═══
function ThreeBG({ containerRef }) {
useEffect(() => {
const el = containerRef.current; if (!el) return;
const W = el.clientWidth || 300, H = el.clientHeight || 460;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 100);
camera.position.set(0, 0.9, 3.5); camera.lookAt(0, 0.85, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setClearColor(0x000000, 0);
el.innerHTML = “”; el.appendChild(renderer.domElement);
renderer.domElement.style.pointerEvents = “none”;
scene.add(new THREE.AmbientLight(0x3B82F6, 0.4));
const d1 = new THREE.DirectionalLight(0x3B82F6, 0.7); d1.position.set(2, 3, 2); scene.add(d1);
const d2 = new THREE.DirectionalLight(0x06B6D4, 0.5); d2.position.set(-2, 1, -2); scene.add(d2);
const body = new THREE.Group();
const skin = new THREE.MeshPhongMaterial({ color: 0x2D1810, transparent: true, opacity: 0.3, emissive: 0x1a0e08, emissiveIntensity: 0.2 });
const wire = new THREE.MeshBasicMaterial({ color: 0x3B82F6, wireframe: true, transparent: true, opacity: 0.1 });
const add = (geo, pos) => { [skin, wire].forEach(m => { const ms = new THREE.Mesh(geo, m.clone()); ms.position.set(…pos); body.add(ms); }); };
add(new THREE.SphereGeometry(0.115, 20, 16), [0, 1.72, 0]);
add(new THREE.CylinderGeometry(0.055, 0.065, 0.1, 10), [0, 1.57, 0]);
add(new THREE.CylinderGeometry(0.2, 0.22, 0.2, 10), [0, 1.38, 0]);
add(new THREE.CylinderGeometry(0.22, 0.19, 0.18, 10), [0, 1.2, 0]);
add(new THREE.CylinderGeometry(0.19, 0.16, 0.18, 10), [0, 1.03, 0]);
add(new THREE.CylinderGeometry(0.16, 0.15, 0.12, 8), [0, 0.88, 0]);
add(new THREE.SphereGeometry(0.07, 10, 8), [-0.27, 1.42, 0]);
add(new THREE.SphereGeometry(0.07, 10, 8), [0.27, 1.42, 0]);
add(new THREE.CylinderGeometry(0.046, 0.04, 0.26, 8), [-0.3, 1.26, 0]);
add(new THREE.CylinderGeometry(0.046, 0.04, 0.26, 8), [0.3, 1.26, 0]);
add(new THREE.CylinderGeometry(0.036, 0.026, 0.24, 6), [-0.32, 1.02, 0]);
add(new THREE.CylinderGeometry(0.036, 0.026, 0.24, 6), [0.32, 1.02, 0]);
add(new THREE.CylinderGeometry(0.082, 0.062, 0.36, 10), [-0.11, 0.62, 0]);
add(new THREE.CylinderGeometry(0.082, 0.062, 0.36, 10), [0.11, 0.62, 0]);
add(new THREE.SphereGeometry(0.052, 8, 6), [-0.11, 0.4, 0]);
add(new THREE.SphereGeometry(0.052, 8, 6), [0.11, 0.4, 0]);
add(new THREE.CylinderGeometry(0.052, 0.036, 0.3, 8), [-0.1, 0.2, 0]);
add(new THREE.CylinderGeometry(0.052, 0.036, 0.3, 8), [0.1, 0.2, 0]);
const nc = document.createElement(“canvas”); nc.width = 128; nc.height = 64;
const nctx = nc.getContext(“2d”); nctx.font = “bold 48px sans-serif”; nctx.fillStyle = “#3B82F6”; nctx.textAlign = “center”; nctx.textBaseline = “middle”; nctx.fillText(“29”, 64, 32);
const nP = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.06), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(nc), transparent: true, side: THREE.DoubleSide }));
nP.position.set(0, 1.32, 0.22); body.add(nP);
for (let i = 0; i < 8; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.002, 4, 32), new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.06 })); r.position.y = 0.2 + i * 0.2; r.rotation.x = Math.PI / 2; body.add(r); }
const scan = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.003), new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
body.add(scan);
const grid = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5, 15, 15), new THREE.MeshBasicMaterial({ color: 0x3B82F6, wireframe: true, transparent: true, opacity: 0.04 }));
grid.rotation.x = -Math.PI / 2; grid.position.y = -0.05; body.add(grid);
scene.add(body);
let af; const clock = new THREE.Clock();
const animate = () => { af = requestAnimationFrame(animate); const t = clock.getElapsedTime(); body.rotation.y = t * 0.3; body.position.y = Math.sin(t * 0.8) * 0.005; scan.position.y = ((t * 0.5) % 2.2) - 0.1; scan.material.opacity = 0.25 + Math.sin(t * 4) * 0.15; renderer.render(scene, camera); };
animate();
return () => { cancelAnimationFrame(af); renderer.dispose(); };
}, []);
return null;
}

// ═══ 2D BODY ZONES ═══
const ZONES = [
{id:“head”,l:“Tête”,x:50,y:5},{id:“neck”,l:“Cou”,x:50,y:10.5},{id:“shoulder_l”,l:“Ép. G”,x:32,y:15},{id:“shoulder_r”,l:“Ép. D”,x:68,y:15},
{id:“chest”,l:“Poitrine”,x:50,y:19},{id:“back”,l:“Dos”,x:50,y:26},{id:“hip_l”,l:“Han. G”,x:38,y:36},{id:“hip_r”,l:“Han. D”,x:62,y:36},
{id:“groin”,l:“Adducteur”,x:50,y:41},{id:“quad_l”,l:“Quad G”,x:40,y:49},{id:“quad_r”,l:“Quad D”,x:60,y:49},{id:“ham_l”,l:“Ischio G”,x:40,y:56},{id:“ham_r”,l:“Ischio D”,x:60,y:56},
{id:“knee_l”,l:“Genou G”,x:41,y:64},{id:“knee_r”,l:“Genou D”,x:59,y:64},{id:“calf_l”,l:“Mollet G”,x:41,y:74},{id:“calf_r”,l:“Mollet D”,x:59,y:74},
{id:“ankle_l”,l:“Chev. G”,x:41,y:84},{id:“ankle_r”,l:“Chev. D”,x:59,y:84},
];

function BodyScan({ painZones, onToggle }) {
const bgRef = useRef(null);
const [flash, setFlash] = useState(null);
const click = id => { onToggle(id); setFlash(id); setTimeout(() => setFlash(null), 400); };
return <div style={{ position: “relative”, height: 480, borderRadius: 16, overflow: “hidden”, background: `radial-gradient(ellipse at 50% 35%, rgba(59,130,246,0.08), transparent 70%)` }}>
<div ref={bgRef} style={{ position: “absolute”, inset: 0, opacity: 0.6 }}><ThreeBG containerRef={bgRef} /></div>
<div style={{ position: “absolute”, inset: 0, zIndex: 2 }}>
<svg viewBox=“0 0 100 100” style={{ position: “absolute”, width: “60%”, height: “90%”, top: “5%”, left: “20%”, opacity: 0.08 }}>
<ellipse cx="50" cy="6" rx="7" ry="5.5" fill="none" stroke={C.w} strokeWidth="0.4"/>
<path d="M50,11.5 L50,40 M50,16 L30,28 M50,16 L70,28 M50,40 L38,65 M50,40 L62,65 M38,65 L40,92 M62,65 L60,92" fill="none" stroke={C.w} strokeWidth="0.4"/>
</svg>
{ZONES.map(z => {
const a = painZones.includes(z.id), fl = flash === z.id;
return <button key={z.id} onClick={() => click(z.id)} style={{ position: “absolute”, left: `${z.x}%`, top: `${z.y}%`, transform: “translate(-50%,-50%)”, width: 36, height: 36, borderRadius: “50%”, border: `2px solid ${a ? C.red : "rgba(59,130,246,0.35)"}`, background: a ? “rgba(239,68,68,0.2)” : fl ? “rgba(59,130,246,0.3)” : “rgba(59,130,246,0.05)”, cursor: “pointer”, display: “flex”, alignItems: “center”, justifyContent: “center”, transition: “all 0.25s”, boxShadow: a ? “0 0 18px rgba(239,68,68,0.4)” : “none”, zIndex: a ? 10 : 3, WebkitTapHighlightColor: “transparent”, outline: “none”, padding: 0 }}>
{a && <div style={{ width: 10, height: 10, borderRadius: “50%”, background: C.red, boxShadow: “0 0 8px rgba(239,68,68,0.6)” }} />}
</button>;
})}
{ZONES.filter(z => painZones.includes(z.id)).map(z => <div key={z.id + “_l”} style={{ position: “absolute”, left: `${z.x}%`, top: `${z.y}%`, transform: `translate(${z.x > 55 ? "20px" : "-100%"}, -140%)`, background: “rgba(239,68,68,0.9)”, padding: “2px 7px”, borderRadius: 4, fontSize: 8, fontWeight: 700, color: “#fff”, fontFamily: F.b, whiteSpace: “nowrap”, pointerEvents: “none”, zIndex: 20 }}>{z.l}</div>)}
</div>
<div style={{ position: “absolute”, top: 10, left: 12, display: “flex”, alignItems: “center”, gap: 4, zIndex: 5 }}>
<div className=“bk” style={{ width: 5, height: 5, borderRadius: “50%”, background: C.cyan }} />
<span style={{ fontSize: 8, color: C.cyan, fontFamily: F.b, letterSpacing: 1 }}>BODY SCAN 3D</span>
</div>
<div style={{ position: “absolute”, top: 10, right: 12, zIndex: 5 }}><span style={{ fontSize: 20, fontWeight: 800, color: C.blue, fontFamily: F.h, opacity: 0.4 }}>#29</span></div>

  </div>;
}

// ═══════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════
function HomeScreen() {
const coach = “Readiness 82 — bon état. Sommeil profond 1h54. HRV stable à 72ms. ACWR zone optimale. Arsenal dans 2 jours — activation OK demain. Hydratation renforcée ce soir.”;
return <div>
<div style={{ position: “relative” }}>
<RecovHorizon v={S.readiness} />
<div style={{ position: “absolute”, top: 12, left: 16, right: 16, display: “flex”, justifyContent: “space-between” }}>
<div><div style={{ display: “flex”, alignItems: “center”, gap: 5 }}><span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 5, color: C.w, fontFamily: F.h }}>REGERENT</span><span style={{ fontSize: 7, fontWeight: 700, letterSpacing: 2, color: C.blue, padding: “2px 5px”, border: `1px solid ${C.bD}`, borderRadius: 3, fontFamily: F.b }}>PRO</span></div><p style={{ fontSize: 8, color: C.m, letterSpacing: 1, marginTop: 2, fontFamily: F.b }}>PLAYER COMMAND CENTER</p></div>
<div style={{ width: 30, height: 30, borderRadius: 8, background: C.bD, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 14, fontWeight: 800, color: C.blue, fontFamily: F.h }}>29</div>
</div>
</div>
<div style={{ padding: “0 16px” }}>
<p style={{ fontSize: 12, color: C.d, fontFamily: F.b }}>Bonjour</p>
<h1 style={{ fontSize: 26, fontWeight: 800, color: C.w, fontFamily: F.h, margin: “2px 0” }}>{S.name}</h1>
<p style={{ fontSize: 9, color: C.m, fontFamily: F.b, marginBottom: 8 }}>3 Mars 2026 · {S.club}</p>
</div>
<AlertsBanner />
<div style={{ padding: “0 16px” }}>
<Cd style={{ padding: 14, background: `linear-gradient(135deg, ${C.card}, ${C.bD})` }} glow={C.bD}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<div><p style={{ fontSize: 8, color: C.blue, letterSpacing: 2, fontWeight: 700, fontFamily: F.b }}>PROCHAIN MATCH — J-{S.nextMatch.daysUntil}</p><p style={{ fontSize: 20, fontWeight: 800, color: C.w, fontFamily: F.h, marginTop: 2 }}>{S.nextMatch.opponent} <span style={{ fontSize: 12, color: C.d }}>(A)</span></p><p style={{ fontSize: 9, color: C.d, marginTop: 2, fontFamily: F.b }}>{S.nextMatch.date} · {S.nextMatch.kickoff}</p></div>
<div style={{ textAlign: “center”, position: “relative” }}><Ring value={S.matchReadiness} size={64} sw={5} color={rCol(S.matchReadiness)} /><div style={{ position: “absolute”, inset: 0, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center” }}><span style={{ fontSize: 22, fontWeight: 800, color: rCol(S.matchReadiness), fontFamily: F.h }}>{S.matchReadiness}</span><p style={{ fontSize: 7, color: C.d, fontFamily: F.b }}>MATCH</p></div></div>
</div>
</Cd>
<div style={{ display: “flex”, justifyContent: “center”, margin: “18px 0 6px”, position: “relative” }}><Ring value={S.readiness} size={148} sw={9} color={rCol(S.readiness)} /><div style={{ position: “absolute”, inset: 0, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center” }}><span style={{ fontSize: 52, fontWeight: 800, color: rCol(S.readiness), fontFamily: F.h, lineHeight: 1 }}>{S.readiness}</span><span style={{ fontSize: 9, color: C.d, fontWeight: 600, letterSpacing: 2, fontFamily: F.b }}>{rLab(S.readiness)}</span></div></div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr 1fr 1fr”, gap: 6, marginBottom: 12 }}>{[[“Sommeil”,S.sleep.total+“h”,C.blue],[“HRV”,S.sleep.hrv,C.purple,“ms”],[“FC repos”,S.sleep.rhr,C.cyan,“bpm”],[“SpO2”,S.sleep.spo2+”%”,C.green]].map(([l,v,c,u],i) => <Cd key={i} style={{padding:10}}><St label={l} val={v} color={c} unit={u} sm/></Cd>)}</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 8, marginBottom: 12 }}>
<Cd style={{padding:14}}><p style={{fontSize:7,letterSpacing:2,color:C.m,fontFamily:F.b}}>ACWR</p><div style={{display:“flex”,alignItems:“baseline”,gap:4,marginTop:4}}><span style={{fontSize:30,fontWeight:800,color:C.green,fontFamily:F.h}}>{S.acwr}</span><Badge text="Optimal" color={C.green} bg={C.gD}/></div><div style={{height:5,borderRadius:3,marginTop:8,background:`linear-gradient(to right,${C.blue},${C.green} 40%,${C.green} 55%,${C.amber} 70%,${C.red})`,position:“relative”}}><div style={{position:“absolute”,top:-3,left:`${(S.acwr/2)*100}%`,width:11,height:11,borderRadius:“50%”,background:”#fff”,border:`2px solid ${C.bg}`,transform:“translateX(-50%)”}}/></div></Cd>
<Cd style={{padding:14}}><p style={{fontSize:7,letterSpacing:2,color:C.m,fontFamily:F.b}}>RISQUE BLESSURE</p><div style={{display:“flex”,alignItems:“baseline”,gap:4,marginTop:4}}><span style={{fontSize:30,fontWeight:800,color:C.green,fontFamily:F.h}}>{S.risk}%</span><Badge text="Faible" color={C.green} bg={C.gD}/></div><div style={{marginTop:8}}><Bar v={S.risk} color={C.green}/></div></Cd>
</div>
<Cd style={{background:`linear-gradient(135deg,${C.card},rgba(59,130,246,0.05))`,marginBottom:12}} glow=“rgba(59,130,246,0.1)”>
<div style={{display:“flex”,alignItems:“center”,gap:7,marginBottom:8}}><div style={{width:24,height:24,borderRadius:7,background:C.bD,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:12}}>🤖</div><span style={{fontSize:9,fontWeight:700,color:C.blue,letterSpacing:1,fontFamily:F.b}}>COACH IA</span></div>
<p style={{fontSize:11,color:“rgba(255,255,255,0.7)”,lineHeight:1.8,fontFamily:F.b}}>{coach}</p>
</Cd>
</div>

  </div>;
}

function JDayScreen() {
return <div style={{padding:16}}>
<div style={{textAlign:“center”,marginBottom:20}}>
<p style={{fontSize:8,letterSpacing:3,color:C.m,fontFamily:F.b}}>PROCHAIN MATCH</p>
<h1 style={{fontSize:28,fontWeight:800,color:C.w,fontFamily:F.h,margin:“6px 0”}}><span style={{color:C.d}}>Spurs</span> vs {S.nextMatch.opponent}</h1>
<p style={{fontSize:10,color:C.d,fontFamily:F.b}}>{S.nextMatch.date} · {S.nextMatch.kickoff} · {S.nextMatch.venue}</p>
<div style={{display:“inline-flex”,marginTop:12,padding:“8px 24px”,background:C.bD,borderRadius:20,border:“1px solid rgba(59,130,246,0.2)”}}><span style={{fontSize:38,fontWeight:800,color:C.blue,fontFamily:F.h,letterSpacing:2}}>J-{S.nextMatch.daysUntil}</span></div>
</div>
<Cd style={{textAlign:“center”,marginBottom:12,padding:20,background:`linear-gradient(180deg,${C.card},${C.s1})`}}>
<p style={{fontSize:8,letterSpacing:3,color:C.m,marginBottom:10,fontFamily:F.b}}>MATCH READINESS</p>
<div style={{position:“relative”,display:“inline-block”}}><Ring value={S.matchReadiness} size={130} sw={9} color={rCol(S.matchReadiness)}/><div style={{position:“absolute”,inset:0,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”}}><span style={{fontSize:46,fontWeight:800,color:rCol(S.matchReadiness),fontFamily:F.h,lineHeight:1}}>{S.matchReadiness}</span><span style={{fontSize:8,color:C.d,fontFamily:F.b}}>{rLab(S.matchReadiness)}</span></div></div>
<p style={{fontSize:11,color:C.d,marginTop:10,fontFamily:F.b}}>Top <span style={{color:C.green,fontWeight:700}}>15%</span> de tes readiness cette saison.</p>
</Cd>
<p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:10,fontFamily:F.b}}>PROTOCOLE PRÉ-MATCH</p>
{S.jDays.map((j,i)=><div key={i} style={{display:“flex”,gap:12,marginBottom:2,position:“relative”}}>
{i<S.jDays.length-1&&<div style={{position:“absolute”,left:15,top:28,width:2,height:“calc(100% - 8px)”,background:j.done?C.green:C.b}}/>}
<div style={{width:32,display:“flex”,flexDirection:“column”,alignItems:“center”,paddingTop:4,flexShrink:0}}><div style={{width:j.isMatch?20:j.current?16:12,height:j.isMatch?20:j.current?16:12,borderRadius:“50%”,background:j.isMatch?C.blue:j.done?C.green:j.current?C.amber:C.b,border:j.current?`2px solid ${C.amber}`:“none”,boxShadow:j.current?`0 0 12px ${C.aD}`:j.isMatch?`0 0 12px ${C.bG}`:“none”}}/></div>
<Cd style={{flex:1,marginBottom:8,padding:14,background:j.current?`linear-gradient(135deg,${C.card},${C.aD})`:j.isMatch?`linear-gradient(135deg,${C.card},${C.bD})`:C.card}} glow={j.current?“rgba(245,158,11,0.15)”:j.isMatch?C.bD:C.b}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:4}}><div style={{display:“flex”,alignItems:“center”,gap:6}}><span style={{fontSize:16,fontWeight:800,color:j.isMatch?C.blue:j.current?C.amber:j.done?C.green:C.d,fontFamily:F.h}}>{j.day}</span><span style={{fontSize:9,color:C.m,fontFamily:F.b}}>{j.date}</span></div>{j.readiness&&<Badge text={`${j.readiness}`} color={rCol(j.readiness)} bg={j.readiness>=75?C.gD:C.aD}/>}{j.done&&<span style={{color:C.green}}>✓</span>}</div>
<p style={{fontSize:12,fontWeight:700,color:C.w,marginBottom:2,fontFamily:F.h}}>{j.label}</p><p style={{fontSize:10,color:C.d,lineHeight:1.6,fontFamily:F.b}}>{j.desc}</p>
</Cd>
</div>)}
<Cd style={{marginTop:8}}>
<p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:10,fontFamily:F.b}}>RECOVERY POST SÉANCE</p>
<div style={{display:“flex”,alignItems:“center”,gap:12,marginBottom:12}}><span style={{fontSize:36,fontWeight:800,color:S.recovery.pct>=75?C.green:C.amber,fontFamily:F.h}}>{S.recovery.pct}%</span><div style={{flex:1}}><Bar v={S.recovery.pct} color={S.recovery.pct>=75?C.green:C.amber} h={8}/><p style={{fontSize:9,color:C.d,marginTop:4,fontFamily:F.b}}>Full recovery : <span style={{color:C.w,fontWeight:600}}>{S.recovery.fullTime}</span></p></div></div>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:6}}>{[[“Musculaire”,S.recovery.muscular],[“Neural”,S.recovery.neural],[“Métabolique”,S.recovery.metabolic]].map(([l,v],i)=><div key={i} style={{textAlign:“center”,padding:8,background:C.s1,borderRadius:8}}><p style={{fontSize:7,color:C.m,fontFamily:F.b}}>{l}</p><p style={{fontSize:18,fontWeight:800,color:v>=75?C.green:v>=50?C.amber:C.red,fontFamily:F.h,marginTop:2}}>{v}%</p></div>)}</div>
</Cd>

  </div>;
}

function DataScreen() {
const [tab,setTab]=useState(“sleep”);
return <div style={{padding:16}}>
<div style={{display:“flex”,gap:4,marginBottom:16,background:C.s1,borderRadius:10,padding:3}}>{[[“sleep”,“Sommeil”],[“train”,“Training”],[“trends”,“Tendances”]].map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:“8px 0”,borderRadius:8,border:“none”,cursor:“pointer”,background:tab===id?C.card:“transparent”,color:tab===id?C.w:C.m,fontSize:10,fontWeight:700,fontFamily:F.b,transition:“all .3s”}}>{l}</button>)}</div>
{tab===“sleep”&&<>
<h2 style={{fontSize:18,fontWeight:800,color:C.w,fontFamily:F.h,marginBottom:4}}>Analyse du sommeil</h2>
<p style={{fontSize:10,color:C.d,marginBottom:14,fontFamily:F.b}}>{S.sleep.bed} → {S.sleep.wake} · Efficacité {S.sleep.eff}%</p>
<Cd style={{textAlign:“center”,marginBottom:10}}><span style={{fontSize:46,fontWeight:800,color:C.blue,fontFamily:F.h}}>{S.sleep.total}h</span><div style={{display:“flex”,justifyContent:“center”,gap:14,marginTop:10}}>{[[“Profond”,S.sleep.deep,C.cyan],[“REM”,S.sleep.rem,C.purple],[“Léger”,S.sleep.light,C.blue],[“Éveillé”,S.sleep.awake,C.amber]].map(([l,v,c])=><div key={l} style={{textAlign:“center”}}><div style={{width:6,height:6,borderRadius:2,background:c,margin:“0 auto 3px”}}/><p style={{fontSize:16,fontWeight:800,color:c,fontFamily:F.h}}>{v}h</p><p style={{fontSize:7,color:C.m,fontFamily:F.b}}>{l}</p></div>)}</div></Cd>
<Cd style={{marginBottom:10}}><p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>HYPNOGRAMME</p><svg viewBox={`0 0 ${S.sleep.stages.length} 80`} preserveAspectRatio=“none” style={{width:“100%”,height:70,borderRadius:6}}>{S.sleep.stages.map((s,i)=><rect key={i} x={i} y={{4:0,3:20,2:40,1:60}[s]} width={1.1} height={20} fill={{4:C.amber,3:C.purple,2:C.blue,1:C.cyan}[s]} opacity={0.8}/>)}</svg></Cd>
<Cd><p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>HRV NOCTURNE</p><Chart data={S.sleep.hrvT} color={C.purple} h={50}/></Cd>
</>}
{tab===“train”&&<>
<h2 style={{fontSize:18,fontWeight:800,color:C.w,fontFamily:F.h,marginBottom:4}}>Dernière séance</h2>
<p style={{fontSize:10,color:C.d,marginBottom:14,fontFamily:F.b}}>{S.train.dur} min · Polar H10</p>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:6,marginBottom:10}}>{[[“FC moy”,S.train.avg,C.amber,“bpm”],[“FC max”,S.train.max,C.red,“bpm”],[“TRIMP”,S.train.trimp,C.blue]].map(([l,v,c,u],i)=><Cd key={i} style={{padding:10}}><St label={l} val={v} color={c} unit={u} sm/></Cd>)}</div>
<Cd style={{marginBottom:10}}><p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>FC CONTINUE</p><Chart data={S.train.hr} color={C.red} h={55}/></Cd>
<Cd><p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:10,fontFamily:F.b}}>ZONES CARDIAQUES</p>{S.train.zones.map((z,i)=><div key={i} style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:7}}><span style={{fontSize:9,color:C.d,width:65,fontFamily:F.b}}>{z.n}</span><div style={{flex:1,height:14,borderRadius:4,background:C.s1,overflow:“hidden”}}><div style={{height:“100%”,width:z.p+”%”,borderRadius:4,background:z.c,opacity:.8}}/></div><span style={{fontSize:10,fontWeight:800,color:z.c,width:30,textAlign:“right”,fontFamily:F.h}}>{z.min}m</span></div>)}</Cd>
</>}
{tab===“trends”&&<>
<h2 style={{fontSize:18,fontWeight:800,color:C.w,fontFamily:F.h,marginBottom:14}}>Tendances 14 jours</h2>
{[[“Readiness”,S.trends.r,C.green],[“Sommeil (h)”,S.trends.s,C.blue],[“HRV (ms)”,S.trends.h,C.purple]].map(([l,d,c])=><Cd key={l} style={{marginBottom:10}}><div style={{display:“flex”,justifyContent:“space-between”,marginBottom:8}}><p style={{fontSize:8,letterSpacing:2,color:C.m,fontFamily:F.b}}>{l}</p><span style={{fontSize:11,color:c,fontWeight:700,fontFamily:F.h}}>{d[d.length-1]}</span></div><Chart data={d} color={c} h={55}/></Cd>)}
<Cd><p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>CHARGE (TRIMP)</p><div style={{display:“flex”,alignItems:“flex-end”,gap:2,height:50}}>{S.trends.l.map((v,i)=>{const mx=Math.max(…S.trends.l);return<div key={i} style={{flex:1,height:mx?(v/mx)*45||2:2,borderRadius:3,background:v===0?C.b:C.blue,opacity:v===0?.3:.7}}/>;})}</div></Cd>
</>}

  </div>;
}

function BodyScreen({pz,onToggle}) {
return <div style={{padding:16}}>
<h2 style={{fontSize:18,fontWeight:800,color:C.w,fontFamily:F.h,marginBottom:4}}>Body Scan</h2>
<p style={{fontSize:10,color:C.d,marginBottom:14,fontFamily:F.b}}>Touche les zones pour signaler une douleur</p>
<BodyScan painZones={pz} onToggle={onToggle}/>
{pz.length>0?<Cd glow="rgba(239,68,68,0.1)" style={{marginTop:12}}><p style={{fontSize:8,letterSpacing:2,color:C.red,fontWeight:700,marginBottom:6,fontFamily:F.b}}>ZONES SIGNALÉES ({pz.length})</p><div style={{display:“flex”,flexWrap:“wrap”,gap:4}}>{pz.map(id=><Badge key={id} text={ZONES.find(z=>z.id===id)?.l||id} color={C.red} bg={C.rD}/>)}</div></Cd>:<Cd style={{textAlign:“center”,padding:20,marginTop:12}}><span style={{fontSize:20,color:C.green}}>✓</span><p style={{fontSize:12,color:C.green,fontWeight:700,marginTop:6,fontFamily:F.h}}>Aucune douleur</p></Cd>}

  </div>;
}

function CareerScreen() {
const s=S.season;
return <div style={{padding:16}}>
<h2 style={{fontSize:18,fontWeight:800,color:C.w,fontFamily:F.h,marginBottom:4}}>Saison 2025-26</h2>
<p style={{fontSize:10,color:C.d,marginBottom:14,fontFamily:F.b}}>{S.club} · {S.pos} · #{S.num}</p>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr 1fr”,gap:6,marginBottom:12}}>{[[“Matchs”,s.apps],[“Titu”,s.starts],[“Minutes”,s.mins],[“Buts”,s.goals]].map(([l,v],i)=><Cd key={i} style={{padding:10}}><St label={l} val={v} sm/></Cd>)}</div>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:6,marginBottom:12}}>{[[“Passes D.”,s.assists,C.blue],[“Note moy”,s.avgRating,C.amber],[“0 blessure”,s.injuryDays+“j”,C.green]].map(([l,v,c],i)=><Cd key={i} style={{padding:10}}><St label={l} val={v} color={c} sm/></Cd>)}</div>
<Cd style={{marginBottom:12,background:`linear-gradient(135deg,${C.card},${C.gD})`}} glow=“rgba(34,197,94,0.1)”>
<p style={{fontSize:8,letterSpacing:2,color:C.green,fontWeight:700,marginBottom:8,fontFamily:F.b}}>INSIGHT PERFORMANCE</p>
<p style={{fontSize:11,color:“rgba(255,255,255,0.75)”,lineHeight:1.7,fontFamily:F.b}}>Tes <span style={{color:C.w,fontWeight:700}}>3 meilleurs matchs</span> (Brighton 8.2, Man Utd 7.8, Wolves 7.4) : readiness moyen <span style={{color:C.green,fontWeight:700}}>84</span>, sommeil profond <span style={{color:C.cyan,fontWeight:700}}>> 1h45</span>.</p>
</Cd>
<p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>DERNIERS MATCHS</p>
{S.recentMatches.map((m,i)=><Cd key={i} style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,marginBottom:6,padding:12}}>
<div style={{display:“flex”,alignItems:“center”,gap:10}}><div style={{width:32,height:32,borderRadius:8,background:rCol(m.r)+“18”,display:“flex”,alignItems:“center”,justifyContent:“center”,border:`1px solid ${rCol(m.r)}30`}}><span style={{fontSize:14,fontWeight:800,color:rCol(m.r),fontFamily:F.h}}>{m.r}</span></div><div><p style={{fontSize:12,fontWeight:700,color:C.w,fontFamily:F.h}}>{m.opp} <span style={{fontSize:9,color:C.d,fontFamily:F.b}}>({m.h?“D”:“E”})</span></p><p style={{fontSize:9,color:C.d,fontFamily:F.b}}>{m.mins}’ · {m.rating}</p></div></div>
<span style={{fontSize:14,fontWeight:800,color:C.w,fontFamily:F.h}}>{m.res}</span>
</Cd>)}

  </div>;
}

// ═══ PASSEPORT BIOMÉTRIQUE ═══
function PassportScreen() {
const p = S.passport;
return <div style={{padding:16}}>
{/* Header card */}
<Cd style={{background:`linear-gradient(135deg, ${C.card}, rgba(59,130,246,0.08))`,marginBottom:14,textAlign:“center”,padding:24}} glow={C.bD}>
<p style={{fontSize:8,letterSpacing:3,color:C.blue,fontFamily:F.b,marginBottom:8}}>PASSEPORT BIOMÉTRIQUE</p>
<div style={{width:64,height:64,borderRadius:16,background:C.bD,margin:“0 auto 10px”,display:“flex”,alignItems:“center”,justifyContent:“center”}}>
<span style={{fontSize:28,fontWeight:800,color:C.blue,fontFamily:F.h}}>{S.num}</span>
</div>
<h2 style={{fontSize:22,fontWeight:800,color:C.w,fontFamily:F.h}}>{S.name} {S.last}</h2>
<p style={{fontSize:10,color:C.d,fontFamily:F.b,marginTop:2}}>{S.pos} · {S.age} ans · Sénégal 🇸🇳</p>
<div style={{width:40,height:3,background:C.blue,margin:“12px auto 0”,borderRadius:2,opacity:0.5}}/>
</Cd>

```
{/* Career timeline */}
<p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>PARCOURS</p>
{p.clubs.map((c,i)=><Cd key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,padding:12}}>
  <div><p style={{fontSize:13,fontWeight:700,color:C.w,fontFamily:F.h}}>{c.name}</p><p style={{fontSize:9,color:C.d,fontFamily:F.b}}>{c.period}</p></div>
  <div style={{textAlign:"right"}}><span style={{fontSize:18,fontWeight:800,color:C.blue,fontFamily:F.h}}>{c.apps}</span><p style={{fontSize:7,color:C.m,fontFamily:F.b}}>matchs</p></div>
</Cd>)}

{/* Career totals */}
<p style={{fontSize:8,letterSpacing:2,color:C.m,marginTop:12,marginBottom:8,fontFamily:F.b}}>CARRIÈRE TOTALE</p>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:12}}>
  {[["Matchs",p.totalApps,C.w],["Minutes",p.totalMins,C.w],["Buts",p.totalGoals,C.blue],["Passes D.",p.totalAssists,C.cyan]].map(([l,v,c],i)=><Cd key={i} style={{padding:10}}><St label={l} val={v} color={c} sm/></Cd>)}
</div>

{/* Biometric averages */}
<p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>MOYENNES BIOMÉTRIQUES (CARRIÈRE)</p>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
  {[["HRV moy",p.avgHrv+"ms",C.purple],["Sommeil moy",p.avgSleep+"h",C.blue],["Readiness moy",p.avgReadiness,C.green]].map(([l,v,c],i)=><Cd key={i} style={{padding:12,textAlign:"center"}}>
    <p style={{fontSize:7,letterSpacing:1,color:C.m,fontFamily:F.b,marginBottom:4}}>{l}</p>
    <span style={{fontSize:20,fontWeight:800,color:c,fontFamily:F.h}}>{v}</span>
  </Cd>)}
</div>

{/* Records */}
<Cd style={{marginBottom:12,background:`linear-gradient(135deg,${C.card},rgba(59,130,246,0.06))`}} glow={C.bD}>
  <p style={{fontSize:8,letterSpacing:2,color:C.blue,fontWeight:700,marginBottom:10,fontFamily:F.b}}>RECORDS PERSONNELS</p>
  <div style={{display:"flex",justifyContent:"space-around"}}>
    <div style={{textAlign:"center"}}><span style={{fontSize:28,fontWeight:800,color:C.green,fontFamily:F.h}}>{p.peakReadiness}</span><p style={{fontSize:8,color:C.d,fontFamily:F.b}}>Peak readiness</p></div>
    <div style={{textAlign:"center"}}><span style={{fontSize:28,fontWeight:800,color:C.cyan,fontFamily:F.h}}>{p.streakClean}</span><p style={{fontSize:8,color:C.d,fontFamily:F.b}}>Jours sans blessure</p></div>
  </div>
</Cd>

{/* Injury history */}
<p style={{fontSize:8,letterSpacing:2,color:C.m,marginBottom:8,fontFamily:F.b}}>HISTORIQUE BLESSURES</p>
{p.injuryHistory.map((inj,i)=><Cd key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,padding:12}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div style={{width:8,height:8,borderRadius:"50%",background:C.red}}/>
    <div><p style={{fontSize:11,fontWeight:600,color:C.w,fontFamily:F.h}}>{inj.type}</p><p style={{fontSize:9,color:C.d,fontFamily:F.b}}>{inj.date}</p></div>
  </div>
  <Badge text={`${inj.days}j`} color={C.red} bg={C.rD}/>
</Cd>)}

{/* Export */}
<Cd style={{textAlign:"center",padding:16,marginTop:8,cursor:"pointer",background:`linear-gradient(135deg,${C.card},${C.gD})`}} glow="rgba(34,197,94,0.1)">
  <p style={{fontSize:11,fontWeight:700,color:C.green,fontFamily:F.h}}>📄 Exporter le Passeport PDF</p>
  <p style={{fontSize:9,color:C.d,marginTop:4,fontFamily:F.b}}>Partage avec ton agent, ton club, ton médecin</p>
</Cd>
```

  </div>;
}

// ═══ APP ═══
export default function App() {
const [screen,setScreen]=useState(“home”);
const [prevScreen,setPrevScreen]=useState(“home”);
const [animating,setAnimating]=useState(false);
const [pz,setPz]=useState([]);
const [ready,setReady]=useState(false);
useEffect(()=>{setTimeout(()=>setReady(true),1800)},[]);
const toggle=id=>setPz(p=>p.includes(id)?p.filter(z=>z!==id):[…p,id]);

const navTo = (id) => {
if (id === screen) return;
setPrevScreen(screen);
setAnimating(true);
setTimeout(() => { setScreen(id); setTimeout(() => setAnimating(false), 50); }, 200);
};

const nav=[
{id:“home”,icon:“◉”,l:“Accueil”},
{id:“jday”,icon:“⚡”,l:“J-Day”},
{id:“data”,icon:“◑”,l:“Données”},
{id:“body”,icon:“⊕”,l:“Body”},
{id:“career”,icon:“★”,l:“Carrière”},
{id:“passport”,icon:“◈”,l:“Passeport”},
];

if(!ready) return <div style={{minHeight:“100vh”,background:C.bg,display:“flex”,alignItems:“center”,justifyContent:“center”}}>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<div style={{textAlign:“center”}}>
<div style={{fontSize:24,fontWeight:800,letterSpacing:8,color:C.w,fontFamily:F.h}}>REGERENT</div>
<div style={{fontSize:9,color:C.blue,letterSpacing:3,fontWeight:700,marginTop:4,fontFamily:F.b}}>PRO</div>
<p style={{fontSize:8,color:C.m,letterSpacing:2,marginTop:8,fontFamily:F.b}}>PLAYER COMMAND CENTER</p>
<div style={{width:30,height:2,background:C.blue,margin:“16px auto 0”,borderRadius:1,animation:“ld 1.2s infinite”}}/>
</div>
<style>{`@keyframes ld{0%,100%{opacity:.2;transform:scaleX(.5)}50%{opacity:1;transform:scaleX(1.5)}}`}</style>

  </div>;

return <div style={{fontFamily:F.b,background:C.bg,color:C.w,minHeight:“100vh”,maxWidth:480,margin:“0 auto”,WebkitFontSmoothing:“antialiased”,paddingBottom:80}}>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>{`*{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg}}::selection{background:rgba(59,130,246,.3)}::-webkit-scrollbar{width:0}.bk{animation:bk 2s infinite}@keyframes bk{0%,100%{opacity:1}50%{opacity:.2}}`}</style>

```
{/* Animated screen container */}
<div style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.2s ease, transform 0.2s ease" }}>
  {screen==="home"&&<HomeScreen/>}
  {screen==="jday"&&<JDayScreen/>}
  {screen==="data"&&<DataScreen/>}
  {screen==="body"&&<BodyScreen pz={pz} onToggle={toggle}/>}
  {screen==="career"&&<CareerScreen/>}
  {screen==="passport"&&<PassportScreen/>}
</div>

{/* Instagram share */}
<IGShare screen={screen} />

{/* Nav - 6 items */}
<div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,padding:"6px 4px 18px",background:`linear-gradient(180deg,transparent,${C.bg} 25%)`,display:"flex",justifyContent:"space-around",zIndex:100,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"}}>
  {nav.map(n=><button key={n.id} onClick={()=>navTo(n.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"5px 6px",color:screen===n.id?C.blue:C.m,transition:"color .3s",position:"relative"}}>
    <span style={{fontSize:16,lineHeight:1}}>{n.icon}</span>
    <span style={{fontSize:7,fontWeight:600,letterSpacing:.3,fontFamily:F.b}}>{n.l}</span>
    {screen===n.id&&<div style={{position:"absolute",top:-3,width:16,height:2,borderRadius:1,background:C.blue}}/>}
  </button>)}
</div>
```

  </div>;
}
