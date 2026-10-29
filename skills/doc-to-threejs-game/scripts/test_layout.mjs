export default async()=>{
 const {STOPS,colliders,nearestRoad,ground,ROAD_LEN,roadAt,landmarkSpots,VC,CC}=G;
 let n=0;
 for(const c of colliders){const r=nearestRoad(c.x,c.z); if(r.d < 2.6 + c.r - 0.3 && Math.hypot(c.x-CC.x,c.z-CC.z)>40 && Math.hypot(c.x,c.z)>17){n++; if(n<25) console.log('on road: col r',c.r.toFixed(2),'at',c.x.toFixed(1),c.z.toFixed(1),'d',r.d.toFixed(2),'u',r.u.toFixed(0));}}
 console.log('road-blocking colliders',n);
 // landmark overlaps between stops
 for(let i=0;i<landmarkSpots.length;i++)for(let j=i+1;j<landmarkSpots.length;j++){const a=landmarkSpots[i],b=landmarkSpots[j];const d=Math.hypot(a.x-b.x,a.z-b.z);if(d<(a.r+b.r)*0.7)console.log('landmark overlap',a.x.toFixed(0),a.z.toFixed(0),a.r,b.x.toFixed(0),b.z.toFixed(0),b.r,d.toFixed(1));}
 // road height range & self-crossing
 let mn=1e9,mx=-1e9; for(let u=0;u<ROAD_LEN;u+=2){const r=roadAt(u);const h=ground(r.x,r.z);mn=Math.min(mn,h);mx=Math.max(mx,h);} console.log('road len',ROAD_LEN.toFixed(0),'height',mn.toFixed(2),mx.toFixed(2));
 // village landmark groups vs road
 for(const s of STOPS.filter(s=>s.group)){const g=s.group.position;const r=nearestRoad(g.x,g.z);if(r.d<6 && s.kind!=='gate')console.log('group near road',s.id,r.d.toFixed(1));}
};
