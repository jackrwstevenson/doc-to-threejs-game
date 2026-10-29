export default async()=>{
 const {STOPS,P,UI,colliders,ORDERED,ground,nearestRoad,landmarkSpots}=G; __step(2); __els.begin.onclick(); __step(5);
 // beacon placement checks
 for(const s of STOPS){
   const inC=colliders.filter(c=>Math.hypot(c.x-s.pos.x,c.z-s.pos.z)<c.r+0.45);
   const h=ground(s.pos.x,s.pos.z);
   if(inC.length||h>9||h<-0.9) console.log('BAD beacon',s.id,'h',h.toFixed(2),'cols',inC.map(c=>c.r.toFixed(1)+'@'+c.x.toFixed(1)+','+c.z.toFixed(1)));
 }
 for(let i=0;i<STOPS.length;i++)for(let j=i+1;j<STOPS.length;j++){const d=STOPS[i].pos.distanceTo(STOPS[j].pos); if(d<6) console.log('close beacons',STOPS[i].id,STOPS[j].id,d.toFixed(1));}
 // walk the journey
 let fails=0, total=0;
 for(let i=0;i<ORDERED.length;i++){
   const s=ORDERED[i]; const start=P.pos.clone();
   G.travelTo(s); await new Promise(r=>setTimeout(r,450)); 
   let f=0; while(UI.card!==s && f<6000){__step(1);f++;}
   total+=f;
   if(UI.card!==s){fails++;console.log('FAILED reach',s.id,'from',start.x.toFixed(1),start.z.toFixed(1),'now',P.pos.x.toFixed(1),P.pos.z.toFixed(1),'dist',P.pos.distanceTo(s.pos).toFixed(1));}
   else if(f>1500) console.log('slow',s.id,(f/60).toFixed(0)+'s');
 }
 console.log('fails',fails,'total sec',(total/60).toFixed(0),'visited',STOPS.filter(s=>s.visited).length);
};
