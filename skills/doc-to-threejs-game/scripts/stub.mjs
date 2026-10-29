function mkAny(){const f=function(){};return new Proxy(f,{get(t,k){if(k===Symbol.toPrimitive)return()=>0;if(typeof k==='symbol')return undefined;if(k==='then')return undefined;if(!(k in t)||k==='name'||k==='length')t[k]=mkAny();return t[k];},set(t,k,v){t[k]=v;return true},apply(){return mkAny()},construct(){return mkAny()}});}
function gen(o){return new Proxy(o,{get(t,k){if(typeof k==='symbol'||k==='then')return t[k];if(!(k in t))t[k]=mkAny();return t[k];}});}
const fin=(v,n)=>{if(!Number.isFinite(v))throw new Error('NaN '+n)};
class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){fin(x,'x');fin(y,'y');fin(z,'z');this.x=x;this.y=y;this.z=z;return this}copy(v){return this.set(v.x,v.y,v.z)}clone(){return new V3(this.x,this.y,this.z)}add(v){return this.set(this.x+v.x,this.y+v.y,this.z+v.z)}sub(v){return this.set(this.x-v.x,this.y-v.y,this.z-v.z)}
addScaledVector(v,s){return this.set(this.x+v.x*s,this.y+v.y*s,this.z+v.z*s)}multiplyScalar(s){return this.set(this.x*s,this.y*s,this.z*s)}setScalar(s){return this.set(s,s,s)}length(){return Math.hypot(this.x,this.y,this.z)}normalize(){const l=this.length()||1;return this.multiplyScalar(1/l)}
distanceTo(v){return Math.hypot(this.x-v.x,this.y-v.y,this.z-v.z)}lerp(v,t){return this.set(this.x+(v.x-this.x)*t,this.y+(v.y-this.y)*t,this.z+(v.z-this.z)*t)}}
class V2{constructor(x=0,y=0){this.x=x;this.y=y}set(x,y){this.x=x;this.y=y;return this}}
class Color{constructor(c){this.r=1;this.g=1;this.b=1;if(c!==undefined)this.set(c)}set(c){if(typeof c==='string'){const h=parseInt(c.slice(1),16);if(!(c.length===7||c.length===4)||isNaN(h))throw new Error('bad color '+c);this.r=(h>>16&255)/255;this.g=(h>>8&255)/255;this.b=(h&255)/255}else if(typeof c==='number'){this.r=(c>>16&255)/255;this.g=(c>>8&255)/255;this.b=(c&255)/255}else if(c&&c.r!==undefined)this.copy(c);return this}
copy(c){this.r=c.r;this.g=c.g;this.b=c.b;return this}clone(){return new Color().copy(this)}lerp(c,t){this.r+=(c.r-this.r)*t;this.g+=(c.g-this.g)*t;this.b+=(c.b-this.b)*t;return this}lerpColors(a,b,t){return this.copy(a).lerp(b,t)}multiplyScalar(s){this.r*=s;this.g*=s;this.b*=s;return this}setHSL(h,s,l){fin(h,'h');this.r=l;this.g=l;this.b=l;return this}offsetHSL(){return this}}
class O3{constructor(){this.position=new V3();this.rotation=gen({x:0,y:0,z:0,set(a,b,c){this.x=a;this.y=b;this.z=c;return this}});this.scale=new V3(1,1,1);this.children=[];this.visible=true;this.userData={};this.center=new V2()}
add(c){this.children.push(c);c.parent=this;return this}remove(c){this.children=this.children.filter(x=>x!==c)}traverse(f){f(this);this.children.forEach(c=>c.traverse(f))}lookAt(){}getWorldPosition(v){let o=this,x=0,y=0,z=0;while(o){x+=o.position.x;y+=o.position.y;z+=o.position.z;o=o.parent}return v.set(x,y,z)}}
class Mesh extends O3{constructor(g,m){super();this.isMesh=true;this.geometry=g||new Geo();this.material=m||new Mat()}}
class Geo{constructor(){this.attributes={position:{count:0,array:new Float32Array(3)}};return gen(this)}setAttribute(k,v){this.attributes[k]=v;if(v.array)v.count=v.array.length/(v.itemSize||3);return this}setIndex(){return this}computeVertexNormals(){}translate(){return this}scale(){return this}dispose(){}}
class BA{constructor(a,n){this.array=a;this.itemSize=n;this.count=a.length/n}}
class Mat{constructor(o={}){Object.assign(this,o);for(const k of['color','emissive'])this[k]=new Color(typeof o[k]==='string'||typeof o[k]==='number'?o[k]:0xffffff);this.uniforms=o.uniforms||{};return gen(this)}clone(){return new Mat()}}
class Tex{constructor(img){this.image=img||{};this.repeat=new V2();return gen(this)}clone(){return new Tex()}}
class Inst extends Mesh{constructor(g,m,n){super(g,m);this.count=n}setMatrixAt(){}setColorAt(){}}
class Curve{constructor(p){this.p=p}getPointAt(t){const i=Math.min(this.p.length-1,Math.round(t*(this.p.length-1)));return this.p[i].clone()}}
let renders=0;
const T={Vector3:V3,Vector2:V2,Color,Object3D:O3,Group:O3,Scene:O3,Mesh,InstancedMesh:Inst,Points:class extends Mesh{},LineSegments:class extends Mesh{},Sprite:class extends Mesh{},
PerspectiveCamera:class extends O3{constructor(f,a){super();this.fov=f;this.aspect=a}updateProjectionMatrix(){}},
WebGLRenderer:class{constructor(){this.shadowMap={};this.domElement=globalThis.mkEl()}setPixelRatio(){}setSize(){}compile(){}render(s,c){renders++;fin(c.position.x,'cam');walk(s)}},
HemisphereLight:class extends O3{constructor(){super();this.color=new Color();this.groundColor=new Color()}},DirectionalLight:class extends O3{constructor(){super();this.color=new Color();this.target=new O3();this.shadow=gen({mapSize:{set(){}},camera:{}})}},PointLight:class extends O3{},
FogExp2:class{constructor(){this.color=new Color()}},CanvasTexture:Tex,Clock:class{getDelta(){return 1/60}},Raycaster:class{setFromCamera(){}intersectObjects(){return[]}intersectObject(){return[]}},
Matrix4:class{makeTranslation(){return this}compose(){return this}},Quaternion:class{setFromEuler(){return this}},Euler:class{set(a,b,c){fin(a,'e');return this}},
Shape:class{moveTo(){}lineTo(){}absarc(){}},CatmullRomCurve3:Curve,BufferAttribute:BA,Float32BufferAttribute:class extends BA{constructor(a,n){super(new Float32Array(a),n)}},
MeshStandardMaterial:Mat,MeshBasicMaterial:Mat,ShaderMaterial:Mat,SpriteMaterial:Mat,PointsMaterial:Mat,LineBasicMaterial:Mat,BufferGeometry:Geo,EdgesGeometry:Geo};
for(const g of['PlaneGeometry','BoxGeometry','CylinderGeometry','SphereGeometry','RingGeometry','CircleGeometry','ExtrudeGeometry','ConeGeometry','TorusGeometry','OctahedronGeometry','IcosahedronGeometry','DodecahedronGeometry','TubeGeometry'])T[g]=class extends Geo{constructor(...a){super();for(const v of a)if(typeof v==='number')fin(v,g)}};
Object.assign(T,{ACESFilmicToneMapping:4,SRGBColorSpace:'srgb',PCFSoftShadowMap:2,RepeatWrapping:1,BackSide:1,DoubleSide:2,AdditiveBlending:2});
function walk(o){fin(o.position.x,'px');fin(o.position.y,'py');fin(o.position.z,'pz');for(const c of o.children)walk(c)}
export default T; export const stats=()=>({renders});
