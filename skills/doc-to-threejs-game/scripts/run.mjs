// Usage: node run.mjs <all.js> <test.mjs>
// all.js = every game JS part concatenated (the contents of the <script type=module>, minus nothing).
// Edit the `G={...}` export list below to expose YOUR game's internals to tests.
import fs from 'fs';
const els={};
globalThis.mkEl=function(){const cl=new Set();const ls={};const e={style:{setProperty(){}},classList:{add:(...c)=>c.forEach(x=>cl.add(x)),remove:(...c)=>c.forEach(x=>cl.delete(x)),toggle(c,v){(v===undefined?!cl.has(c):v)?cl.add(c):cl.delete(c)},contains:c=>cl.has(c)},
 innerHTML:'',textContent:'',disabled:true,click(){this.onclick&&this.onclick()},addEventListener(t,f){ls[t]=f},ls,appendChild(){},querySelector(){return mkEl()},setPointerCapture(){},releasePointerCapture(){},getBoundingClientRect(){return{left:0,top:0,width:300,height:96}},width:600,height:192,
 getContext(){return new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:100}):(k==='createLinearGradient'||k==='createRadialGradient')?()=>({addColorStop(){}}):k==='fillRect'?()=>{}:()=>{},set:()=>true})}};return e};
const winL={};
Object.assign(globalThis,{window:globalThis,innerWidth:1400,innerHeight:900,devicePixelRatio:2,addEventListener:(t,f)=>{(winL[t]=winL[t]||[]).push(f)},
 document:{getElementById:id=>els[id]||(els[id]=mkEl()),createElement:()=>mkEl(),documentElement:mkEl()},performance:{now:()=>Date.now()}});
let rafs=[];globalThis.requestAnimationFrame=f=>rafs.push(f);
globalThis.__winL=winL;globalThis.__els=els;globalThis.__step=(n)=>{for(let i=0;i<n;i++){const r=rafs;rafs=[];r.forEach(f=>f())}};
import path from 'path';import os from 'os';import {fileURLToPath,pathToFileURL} from 'url';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const T=(await import(pathToFileURL(path.join(HERE,'stub.mjs')).href)).default;globalThis.__T=T;
let src=fs.readFileSync(process.argv[2],'utf8');
src=src.replace("THREE = await import('three');","THREE = globalThis.__T;");
src=src.replace(/\[\{ EffectComposer \}[\s\S]*?\]\);/,"throw new Error('nobloom');");
src+="\n;globalThis.G={STOPS,P,UI,CAM,colliders,roadAt,nearestRoad,ROAD_LEN,ground,travelTo,openCard,keys,ORDERED,regionOf,planRoute,landmarkSpots,zoneFor,VC,CC};";
const out=path.join(os.tmpdir(),'ztg_game.mjs');fs.writeFileSync(out,src);
await import(pathToFileURL(out).href);
await (await import(pathToFileURL(path.resolve(process.argv[3])).href)).default();
