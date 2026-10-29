export default async()=>{ const {STOPS,P,UI}=G; __step(2); __els.begin.onclick(); __step(5);
 let fails=0; const order=[30,2,20,0,34,12,27,5,25,33,8];
 for(const i of order){const s=STOPS[i]; G.travelTo(s,{teleport:true}); await new Promise(r=>setTimeout(r,450)); let f=0; while(UI.card!==s&&f<3000){__step(1);f++;} if(UI.card!==s){fails++;console.log('fail',s.id,P.pos.distanceTo(s.pos).toFixed(1));}}
 // WASD movement sanity
 G.keys.KeyW=true; const a=P.pos.clone(); __step(60); G.keys.KeyW=false; console.log('moved',a.distanceTo(P.pos).toFixed(2));
 __winL.keydown.forEach(f=>f({code:'KeyJ',preventDefault(){}})); __winL.keydown.forEach(f=>f({code:'Escape',preventDefault(){}}));
 __winL.keydown.forEach(f=>f({code:'KeyF',preventDefault(){}})); __step(10);
 console.log('teleport fails',fails);};
