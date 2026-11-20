/* ====== PERSONALIZA AQUÍ ====== */
const LETTER = "No necesitas una fecha especial para recordarte lo importante que eres para mí.\nPorque hay personas que llegan a nuestra vida y hacen que hasta los días más simples se conviertan en momentos especiales.\nY tú eres una de esas personas.\nNunca olvides lo maravilloso que es tenerte en este mundo. ❤";
/* ================================ */

window.addEventListener('error',e=>{const d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;right:0;padding:8px;background:#900;color:#fff;font:12px monospace;z-index:99';d.textContent='Error: '+e.message;document.body.appendChild(d);});
const W = () => innerWidth, H = () => innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, W()/H(), .1, 100);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(W(), H());
document.body.appendChild(renderer.domElement);

/* Luces */
scene.add(new THREE.AmbientLight(0xffd6e0, .75));
const dl = new THREE.DirectionalLight(0xffffff, .9); dl.position.set(4,8,6); scene.add(dl);
const pl = new THREE.PointLight(0xff3d7f, 1.4, 14); pl.position.set(0,.6,0); scene.add(pl);
const backL = new THREE.PointLight(0xffb3c6, .6, 20); backL.position.set(-5,4,-5); scene.add(backL);

const root = new THREE.Group(); scene.add(root);

/* Materiales */
const M = {
  red: new THREE.MeshStandardMaterial({color:0xe0063f, roughness:.55}),
  inner: new THREE.MeshStandardMaterial({color:0xff7aa8, roughness:.6, side:THREE.DoubleSide}),
  rib: new THREE.MeshStandardMaterial({color:0x6b4a10, roughness:.45, metalness:.35}),
  gold: new THREE.MeshStandardMaterial({color:0xd4af37, roughness:.25, metalness:.9}),
  ped: new THREE.MeshStandardMaterial({color:0xff2f6e, roughness:.25, metalness:.3, emissive:0x5a0a25}),
  pedDark: new THREE.MeshStandardMaterial({color:0x7a1236, roughness:.3, metalness:.6}),
  green: new THREE.MeshStandardMaterial({color:0x4fa56a, roughness:.7, side:THREE.DoubleSide}),
  leaf: new THREE.MeshStandardMaterial({color:0xc9e8c4, roughness:.7, side:THREE.DoubleSide}),
};

/* Corazón extruido */
function heartGeo(depth=.16){
  const s = new THREE.Shape();
  s.moveTo(0,-.5);
  s.bezierCurveTo(-.1,-.35,-.5,-.1,-.5,.15);
  s.bezierCurveTo(-.5,.4,-.2,.5,0,.3);
  s.bezierCurveTo(.2,.5,.5,.4,.5,.15);
  s.bezierCurveTo(.5,-.1,.1,-.35,0,-.5);
  const g = new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:2,curveSegments:16});
  g.center(); return g;
}
const HG = heartGeo();
const heartCols = [0xff1f4b,0xffffff,0xffc2d1,0xff4d6d,0xf5f5f5];

/* Pedestal */
const ped = new THREE.Group(); root.add(ped);
const pedTop = new THREE.Mesh(new THREE.CylinderGeometry(3.3,3.3,.5,64), M.ped); pedTop.position.y=-.25; ped.add(pedTop);
const base = new THREE.Mesh(new THREE.CylinderGeometry(3.45,3.7,.5,64), M.pedDark); base.position.y=-.75; ped.add(base);
const ring = new THREE.Mesh(new THREE.TorusGeometry(3.3,.07,12,96), M.gold); ring.rotation.x=Math.PI/2; ring.position.y=0; ped.add(ring);

/* Caja */
const box = new THREE.Group(); box.position.y = 0; root.add(box);
const bw = 2, bh = 1.6, t = .08;
function addBox(w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);box.add(m);return m;}
addBox(bw,t,bw,0,t/2,0,M.inner);
addBox(bw,bh,t,0,bh/2,bw/2-t/2,M.red);
addBox(bw,bh,t,0,bh/2,-bw/2+t/2,M.red);
addBox(t,bh,bw,bw/2-t/2,bh/2,0,M.red);
addBox(t,bh,bw,-bw/2+t/2,bh/2,0,M.red);
/* interior rosado */
const inside = new THREE.Mesh(new THREE.BoxGeometry(bw-.2,bh-.1,bw-.2), new THREE.MeshStandardMaterial({color:0xff6f9c,side:THREE.BackSide,emissive:0x661a38}));
inside.position.y=bh/2; box.add(inside);
/* cintas verticales + corazones por cada cara */
for(let k=0;k<4;k++){
  const f = new THREE.Group(); f.rotation.y = k*Math.PI/2; box.add(f);
  const r = new THREE.Mesh(new THREE.BoxGeometry(.32,bh,.03), M.rib); r.position.set(0,bh/2,bw/2+.015); f.add(r);
  [[-.58,.5],[.58,.5],[-.58,1.05],[.58,1.05]].forEach(([x,y],i)=>{
    const h = new THREE.Mesh(HG, new THREE.MeshStandardMaterial({color:[0xe814c8,0xffc7da,0xffc7da,0xe814c8][i],roughness:.35}));
    h.scale.set(.32,.32,.35); h.position.set(x,y,bw/2+.04); f.add(h);
  });
}

/* Tapa (pivote en borde trasero) */
const lidPivot = new THREE.Group(); lidPivot.position.set(0,bh,-bw/2); box.add(lidPivot);
const lid = new THREE.Group(); lid.position.set(0,0,(bw+.2)/2); lidPivot.add(lid);
const lidTop = new THREE.Mesh(new THREE.BoxGeometry(bw+.2,.3,bw+.2), M.red); lidTop.position.y=.15; lid.add(lidTop);
const rA = new THREE.Mesh(new THREE.BoxGeometry(.32,.32,bw+.22), M.rib); rA.position.y=.15; lid.add(rA);
const rB = new THREE.Mesh(new THREE.BoxGeometry(bw+.22,.32,.32), M.rib); rB.position.y=.15; lid.add(rB);
/* moño de corazones */
function heartTube(){
  const pts=[]; for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;
    pts.push(new THREE.Vector3(16*Math.pow(Math.sin(a),3)/34, (13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/34, 0));}
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),80,.035,8,true);
}
const bowG = heartTube();
[[-.38,.05],[.38,-.05],[0,.12]].forEach(([x,rz],i)=>{
  const h=new THREE.Mesh(bowG,M.gold); h.position.set(x,.62,0); h.rotation.z=rz*3 + (i==2?0:(x<0?.4:-.4)); h.scale.setScalar(i==2?.7:1.05); lid.add(h);
});
const knot = new THREE.Mesh(new THREE.SphereGeometry(.12,16,12), new THREE.MeshStandardMaterial({color:0xff4d2e,roughness:.4}));
knot.position.set(0,.45,0); lid.add(knot);
/* candado */
const lock = new THREE.Group(); lock.position.set(0,1.15,bw/2+.12); box.add(lock);
const lb = new THREE.Mesh(new THREE.BoxGeometry(.32,.3,.1), new THREE.MeshStandardMaterial({color:0xdcdcdc,metalness:.7,roughness:.3})); lock.add(lb);
const sh = new THREE.Mesh(new THREE.TorusGeometry(.1,.025,8,20,Math.PI), new THREE.MeshStandardMaterial({color:0xbdbdbd,metalness:.9,roughness:.25})); sh.position.y=.15; lock.add(sh);
const lh = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.04,16), new THREE.MeshStandardMaterial({color:0xffe14d,emissive:0x664400})); lh.rotation.x=Math.PI/2; lh.position.z=.06; lock.add(lh);
lock.userData.hit = true;
const lockHit = new THREE.Mesh(new THREE.SphereGeometry(.6,8,8), new THREE.MeshBasicMaterial({visible:false})); lock.add(lockHit);

/* ====== Ramo de flores ====== */
const bouquet = new THREE.Group(); bouquet.position.set(0,.9,0); bouquet.scale.setScalar(.01); bouquet.visible=false; box.add(bouquet);
const petalGeo = new THREE.SphereGeometry(1,10,6); petalGeo.scale(.27,.035,.1); petalGeo.translate(.27,0,0);
function flower(color){
  const g=new THREE.Group();
  const mat=new THREE.MeshStandardMaterial({color,roughness:.45,side:THREE.DoubleSide,emissive:0x330008});
  [[10,.25,1],[9,.6,.82],[7,1.0,.62]].forEach(([n,tilt,sc],L)=>{
    for(let i=0;i<n;i++){
      const pv=new THREE.Group(); pv.rotation.y=i/n*Math.PI*2+L*.35;
      const p=new THREE.Mesh(petalGeo,mat); p.rotation.z=tilt; p.scale.setScalar(sc); pv.add(p); g.add(pv);
    }
  });
  const c=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),new THREE.MeshStandardMaterial({color:0xffd24d,emissive:0x664400})); c.position.y=.05; g.add(c);
  return g;
}
function stem(a,b,r,mat){
  const d=b.clone().sub(a),len=d.length();
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,6),mat);
  m.position.copy(a).addScaledVector(d,.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
  return m;
}
const flowers=[]; const NF=17;
for(let i=0;i<NF;i++){
  const phi=i*2.4, rr=Math.sqrt(i/NF)*.95;
  const tp=new THREE.Vector3(Math.cos(phi)*rr,1.55+(1-(rr/.95)*(rr/.95))*.4,Math.sin(phi)*rr);
  bouquet.add(stem(new THREE.Vector3(0,0,0),tp,.03,M.green));
  const f=flower(i%5==0?0xff5a6e:0xff2d3f);
  f.position.copy(tp);
  f.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(tp.x,1.1,tp.z).normalize());
  f.scale.setScalar(.85+Math.random()*.3);
  bouquet.add(f); flowers.push(f);
}
/* hojas */
const leafGeo=new THREE.SphereGeometry(1,8,6); leafGeo.scale(.32,.03,.1); leafGeo.translate(.32,0,0);
for(let i=0;i<9;i++){
  const pv=new THREE.Group(); pv.position.set(0,.5+Math.random()*.55,0); pv.rotation.y=i/9*Math.PI*2;
  const l=new THREE.Mesh(leafGeo,i%2?M.leaf:M.green); l.rotation.z=.5+Math.random()*.5; pv.add(l); bouquet.add(pv);
}
/* tarjetita */
function cardTexture(){
  const c=document.createElement('canvas'); c.width=256;c.height=128; const x=c.getContext('2d');
  x.fillStyle='#fff3e0'; x.strokeStyle='#d4af37'; x.lineWidth=5;
  x.beginPath(); x.roundRect?x.roundRect(6,6,244,116,22):x.rect(6,6,244,116); x.fill(); x.stroke();
  x.fillStyle='#d41c3a'; x.beginPath(); x.arc(64,64,30,0,7); x.fill();
  x.fillStyle='#fff'; x.beginPath(); x.moveTo(64,78);x.bezierCurveTo(44,64,50,50,64,56);x.bezierCurveTo(78,50,84,64,64,78); x.fill();
  x.fillStyle='#c9a77c'; x.fillRect(112,50,100,9); x.fillRect(112,72,70,9);
  return new THREE.CanvasTexture(c);
}
const card=new THREE.Sprite(new THREE.SpriteMaterial({map:cardTexture(),transparent:true}));
card.scale.set(.95,.48,1); card.position.set(.75,1.25,.55); bouquet.add(card);

/* ====== Corazones que salen ====== */
const hearts=[];
for(let i=0;i<34;i++){
  const m=new THREE.Mesh(HG,new THREE.MeshStandardMaterial({color:heartCols[i%heartCols.length],roughness:.35,metalness:.05}));
  m.visible=false; root.add(m);
  hearts.push({m,v:new THREE.Vector3(),life:0,max:3+Math.random()*2.5,s:.25+Math.random()*.3,spin:new THREE.Vector3(Math.random()*2,Math.random()*2.5,Math.random()*2),delay:Math.random()*2});
}
function respawn(h){
  h.m.position.set((Math.random()-.5)*1.1,1.6,(Math.random()-.5)*1.1);
  h.v.set((Math.random()-.5)*1.6,2.6+Math.random()*1.8,(Math.random()-.5)*1.6);
  h.life=0; h.max=3+Math.random()*2.5; h.m.visible=true;
}

/* ====== Texturas redondas para partículas ====== */
function dotTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
const DOT=dotTex();
/* estrellitas de fondo */
const SN=420, sp=new Float32Array(SN*3);
for(let i=0;i<SN;i++){sp[i*3]=(Math.random()-.5)*28;sp[i*3+1]=Math.random()*14-3;sp[i*3+2]=(Math.random()-.5)*20-2;}
const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
const stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.1,map:DOT,transparent:true,opacity:.75,depthWrite:false,blending:THREE.AdditiveBlending,color:0xffe3ec}));
scene.add(stars);
/* destellos de la caja */
const KN=110, kp=new Float32Array(KN*3), kv=new Float32Array(KN);
function resetSpark(i){kp[i*3]=(Math.random()-.5)*1.6;kp[i*3+1]=1.2+Math.random()*.4;kp[i*3+2]=(Math.random()-.5)*1.6;kv[i]=.6+Math.random()*1.4;}
for(let i=0;i<KN;i++){resetSpark(i);}
const kg=new THREE.BufferGeometry(); kg.setAttribute('position',new THREE.BufferAttribute(kp,3));
const sparks=new THREE.Points(kg,new THREE.PointsMaterial({size:.12,map:DOT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0xffffff}));
sparks.visible=false; root.add(sparks);
/* pétalos cayendo */
const petalMat=new THREE.MeshStandardMaterial({color:0xd10f2f,side:THREE.DoubleSide,roughness:.5});
const petals=[];
for(let i=0;i<30;i++){
  const g=new THREE.PlaneGeometry(.14,.2,2,2);
  const p=new THREE.Mesh(g,petalMat);
  p.position.set((Math.random()-.5)*12,Math.random()*9-1,(Math.random()-.5)*8);
  scene.add(p); petals.push({p,sp:.25+Math.random()*.4,ph:Math.random()*6,rs:1+Math.random()*2});
}

/* ====== Mariposas ====== */
function wingTexture(){
  const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,256,200);g.addColorStop(0,'#ffe3ee');g.addColorStop(1,'#ff8ab5');
  x.beginPath();x.moveTo(6,150);x.bezierCurveTo(10,30,90,0,200,20);x.bezierCurveTo(250,30,255,110,200,170);x.bezierCurveTo(240,200,190,250,120,225);x.bezierCurveTo(60,215,10,200,6,150);x.closePath();
  x.fillStyle=g;x.fill();x.lineWidth=5;x.strokeStyle='#2a0a14';x.stroke();
  x.lineWidth=2.5;
  for(let i=0;i<7;i++){x.beginPath();x.moveTo(6,150);x.quadraticCurveTo(70+i*20,40+i*28,215-i*8,25+i*28);x.stroke();}
  x.fillStyle='#fff';for(let i=0;i<7;i++){x.beginPath();x.arc(30+i*30,208-Math.abs(i-3)*8,5,0,7);x.fill();}
  return new THREE.CanvasTexture(c);
}
const WT=wingTexture();
function butterfly(scale,tint){
  const g=new THREE.Group();
  const wm=new THREE.MeshBasicMaterial({map:WT,transparent:true,side:THREE.DoubleSide,alphaTest:.05,color:tint});
  const mk=(sx)=>{const pv=new THREE.Group();const w=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),wm);w.position.set(.45,.1,0);pv.add(w);pv.scale.x=sx;return pv;};
  const R=mk(1),L=mk(-1);g.add(R,L);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.025,.02,.55,8),new THREE.MeshBasicMaterial({color:0x2a0a14}));g.add(body);
  g.scale.setScalar(scale); g.userData={R,L,ph:Math.random()*6};
  scene.add(g); return g;
}
const butterflies=[butterfly(.9,0xffffff),butterfly(.6,0xffd6e6),butterfly(.75,0xffffff)];

/* ====== Interacción ====== */
const state={open:false,zoom:1,ry:0,rv:.12,drag:false,sx:0,moved:0,openT:0};
const cam={d:10,ty:1.6,cy:3};
const ray=new THREE.Raycaster(), mouse=new THREE.Vector2();
function resize(){camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H());}
addEventListener('resize',resize);
function baseDist(){return Math.max(9,6.8/camera.aspect);}

const cv=renderer.domElement;
cv.addEventListener('pointerdown',e=>{state.drag=true;state.sx=e.clientX;state.moved=0;cv.setPointerCapture(e.pointerId);});
cv.addEventListener('pointermove',e=>{if(!state.drag)return;const dx=e.clientX-state.sx;state.sx=e.clientX;state.moved+=Math.abs(dx);state.ry+=dx*.008;});
cv.addEventListener('pointerup',e=>{
  state.drag=false;
  if(state.moved>6)return;
  mouse.set(e.clientX/W()*2-1,-(e.clientY/H())*2+1); ray.setFromCamera(mouse,camera);
  if(!state.open){ if(ray.intersectObject(lockHit).length) openBox(); }
  else if(ray.intersectObject(card).length) openLetter();
});

/* tweens */
const tweens=[];
const ease={out:t=>1-Math.pow(1-t,3),io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,back:t=>{const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);}};
function tween(dur,delay,fn,ez=ease.out,done){tweens.push({dur,delay,fn,ez,done,t:-delay});}

function openBox(){
  state.open=true;
  document.getElementById('hint').style.opacity=0;
  tween(.6,0,k=>{lock.scale.setScalar(1-k);lock.position.y=1.15+k*.5;lock.rotation.z=k*1.5;},ease.out,()=>lock.visible=false);
  tween(1.6,.4,k=>{lidPivot.rotation.x=-1.95*k;},ease.back);
  sparks.visible=true; pl.intensity=2.6;
  hearts.forEach(h=>{setTimeout(()=>respawn(h),600+h.delay*700);});
  bouquet.visible=true;
  tween(2.4,1.1,k=>{bouquet.scale.setScalar(.01+k*.99);bouquet.position.y=.9+k*.9;},ease.back);
  tween(1.8,1.4,k=>{cam.d=baseDist()*(1-.12*k);cam.ty=1.6+k*1.0;cam.cy=3+k*.6;});
  setTimeout(()=>{document.getElementById('title').classList.add('on');document.getElementById('hint').textContent='Toca la tarjetita 💌';document.getElementById('hint').style.opacity=.9;},2800);
}
let typer=null;
function openLetter(){
  const L=document.getElementById('letter'),B=document.getElementById('body'),F=document.getElementById('foot');
  L.classList.add('on'); B.textContent=''; F.classList.remove('on'); B.classList.add('typing');
  clearInterval(typer); let i=0;
  typer=setInterval(()=>{B.textContent=LETTER.slice(0,++i);if(i>=LETTER.length){clearInterval(typer);B.classList.remove('typing');F.classList.add('on');}},38);
}
document.getElementById('close').onclick=()=>{clearInterval(typer);document.getElementById('letter').classList.remove('on');};

/* ====== Loop ====== */
cam.d=baseDist();
const clock=new THREE.Clock(); let T=0;
function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.05); T+=dt;

  for(let i=tweens.length-1;i>=0;i--){const w=tweens[i];w.t+=dt;if(w.t<0)continue;const k=Math.min(w.t/w.dur,1);w.fn(w.ez(k));if(k>=1){w.done&&w.done();tweens.splice(i,1);}}
  if(!state.open&&cam.d<baseDist()-.01||!state.open) cam.d+=(baseDist()-cam.d)*.05*(state.open?0:1);

  if(!state.drag) state.ry+=state.rv*dt*(state.open?.5:1);
  root.rotation.y+= (state.ry-root.rotation.y)*.12;
  camera.position.set(0,cam.cy+Math.sin(T*.4)*.1,cam.d); camera.lookAt(0,cam.ty,0);

  /* caja flotando */
  box.position.y=Math.sin(T*1.2)*.03;
  flowers.forEach((f,i)=>{f.rotation.y+=dt*.15*(i%2?1:-1);});
  card.position.y=1.25+Math.sin(T*2)*.05;

  /* corazones */
  hearts.forEach(h=>{
    if(!h.m.visible)return;
    h.life+=dt; h.v.y-=1.7*dt; h.v.multiplyScalar(.995);
    h.m.position.addScaledVector(h.v,dt);
    h.m.rotation.x+=h.spin.x*dt;h.m.rotation.y+=h.spin.y*dt;h.m.rotation.z+=h.spin.z*dt*.3;
    const k=h.life/h.max,s=h.s*(k<.1?k/.1:k>.8?Math.max(0,(1-k)/.2):1);
    h.m.scale.setScalar(Math.max(.001,s*1.1));
    if(h.life>h.max) respawn(h);
  });
  /* destellos */
  if(sparks.visible){for(let i=0;i<KN;i++){kp[i*3+1]+=kv[i]*dt;kp[i*3]+=Math.sin(T+i)*.003;if(kp[i*3+1]>3.2)resetSpark(i);}kg.attributes.position.needsUpdate=true;}
  /* estrellas */
  for(let i=0;i<SN;i++){sp[i*3+1]-=.12*dt;if(sp[i*3+1]<-3)sp[i*3+1]=11;}sg.attributes.position.needsUpdate=true;
  /* pétalos */
  petals.forEach(o=>{
    const p=o.p;p.position.y-=o.sp*dt;p.position.x+=Math.sin(T*.8+o.ph)*.004;
    p.rotation.x+=o.rs*dt;p.rotation.z+=o.rs*.6*dt;
    if(p.position.y<-2){p.position.y=8;p.position.x=(Math.random()-.5)*12;}
  });
  /* mariposas */
  butterflies.forEach((b,i)=>{
    const u=b.userData,t=T*(.45+i*.12)+u.ph,r=3.3+i*.5;
    b.position.set(Math.cos(t)*r*.9,2.6+Math.sin(t*1.7)*.9+i*.5,Math.sin(t)*r*.8+1);
    b.rotation.y=-Math.sin(t)*.7; b.rotation.z=Math.cos(t)*.25;
    const f=Math.sin(T*(11+i*2))*.9;
    u.R.rotation.y=-f-.15; u.L.rotation.y=f+.15;
  });
  renderer.render(scene,camera);
}
resize(); loop();