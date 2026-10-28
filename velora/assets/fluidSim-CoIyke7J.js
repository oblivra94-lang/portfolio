import{n as e,t}from"./index-Crz1hNv-.js";import{A as n,E as r,F as i,I as a,L as o,P as s,a as ee,g as te,i as c,k as ne,l,m as u,w as re,x as ie}from"./three.module-CHLyLHpo.js";var ae=128,oe=320,se=18,d=22,ce=.35,le=.9,ue=.22,f=5200,de=3.2;function p(n){let r=t.find(e=>e.key===n)??t[0];return{stops:[...r.fluid.colors,r.fluid.glow].map(t=>new i(...e(t))),dye:r.fluid.dye.map(e)}}var fe=`
  uniform vec2 texelSize;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  void main() {
    vUv = uv;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,m=`
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
`,pe={splat:`${m}
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main() {
      vec2 p = vUv - point;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
    }`,advection:`${m}
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 velocityTexelSize;
    uniform float dt;
    uniform float dissipation;
    void main() {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * velocityTexelSize;
      gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
    }`,curl:`${m}
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }`,vorticity:`${m}
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main() {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
      gl_FragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
    }`,divergence:`${m}
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) L = -C.x;
      if (vR.x > 1.0) R = -C.x;
      if (vT.y > 1.0) T = -C.y;
      if (vB.y < 0.0) B = -C.y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`,fade:`${m}
    uniform sampler2D uTexture;
    uniform float value;
    void main() {
      gl_FragColor = value * texture2D(uTexture, vUv);
    }`,pressure:`${m}
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float divergence = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
    }`,gradient:`${m}
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }`,display:`${m}
    uniform sampler2D uDye;
    uniform sampler2D uVelocity;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uC0; // darkest, bottom of the window
    uniform vec3 uC1;
    uniform vec3 uC2;
    uniform vec3 uC3;
    uniform vec3 uC4; // lightest, the glow at the top
    uniform vec3 uGlow; // second colour caught in the lower left

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      vec2 o = i.xy + i.z * vec2(37.0, 17.0);
      float a = hash(o);
      float b = hash(o + vec2(1.0, 0.0));
      float c = hash(o + vec2(0.0, 1.0));
      float d = hash(o + vec2(1.0, 1.0));
      vec2 o2 = o + vec2(37.0, 17.0);
      float a2 = hash(o2);
      float b2 = hash(o2 + vec2(1.0, 0.0));
      float c2 = hash(o2 + vec2(0.0, 1.0));
      float d2 = hash(o2 + vec2(1.0, 1.0));
      float z0 = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      float z1 = mix(mix(a2, b2, f.x), mix(c2, d2, f.x), f.y);
      return mix(z0, z1, f.z);
    }
    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.02 + vec3(3.1, 1.7, 0.0);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      // The fluid smears the gradient: sample it upstream of the flow.
      vec2 uv = vUv - velocity * 0.0001;
      float aspect = uResolution.x / uResolution.y;
      vec2 p = vec2(uv.x * aspect, uv.y);
      float t = uTime * 0.035;

      vec2 warp = vec2(fbm(vec3(p * 0.8, t)), fbm(vec3(p * 0.8 + 5.2, t + 3.0)));
      float field = fbm(vec3(p * 0.9 + warp * 1.4, t * 1.3));

      // Light settles toward the top of the window like steam over the cup, dark below.
      float height = uv.y + (field - 0.5) * 0.7;
      vec3 col = mix(uC0, uC1, smoothstep(0.05, 0.4, height));
      col = mix(col, uC2, smoothstep(0.35, 0.62, height));
      col = mix(col, uC3, smoothstep(0.55, 0.8, height + warp.x * 0.15));
      col = mix(col, uC4, smoothstep(0.78, 1.05, height + warp.y * 0.2) * 0.85);

      // Faint second colour in the lower left, the way the reference catches a different hue.
      float glow = smoothstep(0.55, 0.0, length(vec2((uv.x - 0.02) * aspect * 0.6, uv.y - 0.05)));
      col = mix(col, uGlow, glow * 0.24);

      // Stirred dye.
      vec3 dye = texture2D(uDye, uv).rgb;
      float amount = clamp(max(dye.r, max(dye.g, dye.b)), 0.0, 1.0);
      col = mix(col, dye / max(amount, 0.0001), smoothstep(0.0, 1.0, amount) * 0.72);

      // Soft horizontal light streaks, bent by the flow.
      float streakNoise = fbm(vec3(uv.x * 3.0, 0.0, t * 2.0));
      float y1 = (uv.y - 0.21 + velocity.y * 0.00008) * uResolution.y;
      float y2 = (uv.y - 0.135 + velocity.y * 0.00006) * uResolution.y;
      float streaks = exp(-y1 * y1 * 0.35) * smoothstep(0.35, 0.75, streakNoise) * 0.55;
      streaks += exp(-y2 * y2 * 0.9) * smoothstep(0.45, 0.8, 1.0 - streakNoise) * 0.35;
      col += mix(uC4, vec3(1.0), 0.3) * streaks;

      // Vignette and grain keep it from looking like a flat gradient.
      vec2 v = vUv - 0.5;
      col *= 1.0 - dot(v, v) * 0.35;
      col += (hash(vUv * uResolution + fract(uTime) * 100.0) - 0.5) * 0.035;

      gl_FragColor = vec4(col, 1.0);
    }`};function me(e){let{extensions:t,capabilities:n}=e;return n.isWebGL2?t.has(`EXT_color_buffer_float`)||t.has(`EXT_color_buffer_half_float`):t.has(`OES_texture_half_float`)&&t.has(`OES_texture_half_float_linear`)}function h(e,t){return new a(e,t,{type:l,format:r,minFilter:u,magFilter:u,wrapS:c,wrapT:c,depthBuffer:!1,stencilBuffer:!1})}function g(e,t){let n=h(e,t),r=h(e,t);return{get read(){return n},get write(){return r},swap(){[n,r]=[r,n]},dispose(){n.dispose(),r.dispose()}}}function _(e,t){let n=Math.round(e),r=Math.round(e*Math.max(t,1/t));return t>=1?[r,n]:[n,r]}function v(e,{reducedMotion:r=!1,palette:a=t[0].key,onReady:c,onError:l}={}){let u=p(a),m=u.stops.map(e=>e.clone()),v=!1,y=new o({antialias:!1,alpha:!1,depth:!1,powerPreference:`high-performance`});if(!me(y))throw y.dispose(),Error(`Float render targets are not supported`);y.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),y.autoClear=!1;let b=y.domElement;b.style.display=`block`,b.style.width=`100%`,b.style.height=`100%`,e.appendChild(b);let he=new ie(-1,1,1,-1,0,1),x=new te(new re(2,2));x.frustumCulled=!1;let S=new ne;S.add(x);let C=Object.fromEntries(Object.entries(pe).map(([e,t])=>[e,new n({vertexShader:fe,fragmentShader:t,uniforms:{texelSize:{value:new s},velocityTexelSize:{value:new s},uTarget:{value:null},uVelocity:{value:null},uSource:{value:null},uCurl:{value:null},uPressure:{value:null},uDivergence:{value:null},uTexture:{value:null},uDye:{value:null},aspectRatio:{value:1},color:{value:new i},point:{value:new s},radius:{value:.001},dt:{value:.016},dissipation:{value:0},curl:{value:d},value:{value:.8},uTime:{value:0},uResolution:{value:new s(1,1)},uC0:{value:m[0]},uC1:{value:m[1]},uC2:{value:m[2]},uC3:{value:m[3]},uC4:{value:m[4]},uGlow:{value:m[5]}},depthTest:!1,depthWrite:!1})])),w,T,E,D,O,k=new s,A=new s,j=1;function M(){w?.dispose(),T?.dispose(),E?.dispose(),D?.dispose(),O?.dispose()}function N(){M();let[e,t]=_(ae,j),[n,r]=_(oe,j);w=g(e,t),E=g(e,t),T=g(n,r),D=h(e,t),O=h(e,t),k=new s(1/e,1/t),A=new s(1/n,1/r);for(let e of[w.read,w.write,E.read,E.write,T.read,T.write,D,O])y.setRenderTarget(e),y.setClearColor(0,0),y.clear();y.setRenderTarget(null)}function P(e,t,n,r=k){let i=C[e];i.uniforms.texelSize.value.copy(r);for(let[e,t]of Object.entries(n))i.uniforms[e].value=t;x.material=i,y.setRenderTarget(t),y.render(S,he)}function F(e,t,n,r,a){let o=ue/100*(j>1?j:1);P(`splat`,w.write,{uTarget:w.read.texture,aspectRatio:j,point:new s(e,t),color:new i(n,r,0),radius:o}),w.swap(),P(`splat`,T.write,{uTarget:T.read.texture,aspectRatio:j,point:new s(e,t),color:new i(...a),radius:o},A),T.swap()}function ge(e){P(`curl`,O,{uVelocity:w.read.texture}),P(`vorticity`,w.write,{uVelocity:w.read.texture,uCurl:O.texture,curl:d,dt:e}),w.swap(),P(`divergence`,D,{uVelocity:w.read.texture}),P(`fade`,E.write,{uTexture:E.read.texture,value:.8}),E.swap();for(let e=0;e<se;e+=1)P(`pressure`,E.write,{uPressure:E.read.texture,uDivergence:D.texture}),E.swap();P(`gradient`,w.write,{uPressure:E.read.texture,uVelocity:w.read.texture}),w.swap(),P(`advection`,w.write,{uVelocity:w.read.texture,uSource:w.read.texture,velocityTexelSize:k,dt:e,dissipation:ce}),w.swap(),P(`advection`,T.write,{uVelocity:w.read.texture,uSource:T.read.texture,velocityTexelSize:k,dt:e,dissipation:le},A),T.swap()}let I=new s(1,1);function _e(e){I.set(b.width,b.height),P(`display`,null,{uDye:T.read.texture,uVelocity:w.read.texture,uTime:e,uResolution:I})}function L(){let t=e.clientWidth,n=e.clientHeight;if(!t||!n)return;y.setSize(t,n,!1);let r=t/n;(!w||Math.abs(r-j)>.05)&&(j=r,N())}let ve=new ResizeObserver(L);ve.observe(e),j=e.clientWidth/Math.max(e.clientHeight,1),L(),w||N();let R={x:0,y:0,inside:!1,primed:!1},z=0;function B(e){let t=b.getBoundingClientRect(),n=(e.clientX-t.left)/t.width,r=1-(e.clientY-t.top)/t.height,i=n>=0&&n<=1&&r>=0&&r<=1;if(i&&R.primed&&R.inside){let e=(n-R.x)*f*j,t=(r-R.y)*f;if(Math.abs(e)+Math.abs(t)>.5){let i=u.dye[z%u.dye.length],a=Math.min(.22,.04+Math.hypot(n-R.x,r-R.y)*4);F(n,r,e,t,i.map(e=>e*a)),Se()}}R.x=n,R.y=r,R.inside=i,R.primed=!0}function V(){z+=1}window.addEventListener(`pointermove`,B,{passive:!0}),window.addEventListener(`pointerdown`,V,{passive:!0});let H=.4;function ye(e){if(r||e<H)return;H=e+1.1+Math.random()*1.2;let t=.1+Math.random()*.8,n=.35+Math.random()*.5,i=(Math.random()<.5?0:Math.PI)+(Math.random()-.5)*.9,a=420+Math.random()*420,o=u.dye[Math.floor(Math.random()*u.dye.length)];F(t,n,Math.cos(i)*a,Math.sin(i)*a,o.map(e=>e*.11))}let U=new ee,W=0,G=!1,K=!0,q=!1,J=!1,Y=0,X=!1;function Z(){W=requestAnimationFrame(Z);let e=Math.min(U.getDelta(),1/30),t=U.elapsedTime;if(v){let t=1-Math.exp(-e*de),n=0;m.forEach((e,r)=>{e.lerp(u.stops[r],t),n+=e.distanceToSquared(u.stops[r])}),n<1e-6&&(v=!1)}ye(t),ge(e),_e(r?0:t),J||(J=!0,c?.()),r&&++Y>240&&xe()}function be(){G||q||!K||X||(G=!0,U.getDelta(),W=requestAnimationFrame(Z))}function Q(){G=!1,cancelAnimationFrame(W)}function xe(){X=!0,Q()}function Se(){Y=0,X&&(X=!1,be())}let Ce=new IntersectionObserver(([e])=>{K=e.isIntersecting,K?be():Q()});Ce.observe(e);function $(e){e.preventDefault(),Q(),l?.(Error(`WebGL context lost`))}return b.addEventListener(`webglcontextlost`,$),{setPalette(e){if(u=p(e),v=!0,!q){for(let e=0;e<4;e+=1){let t=.5+(e-1.5)*.12+(Math.random()-.5)*.05,n=u.dye[e%u.dye.length];F(t,.08,(Math.random()-.5)*300,900+Math.random()*500,n.map(e=>e*.22))}Se()}},dispose(){q=!0,Q(),Ce.disconnect(),ve.disconnect(),window.removeEventListener(`pointermove`,B),window.removeEventListener(`pointerdown`,V),b.removeEventListener(`webglcontextlost`,$),M();for(let e of Object.values(C))e.dispose();x.geometry.dispose(),y.dispose(),y.forceContextLoss(),b.remove()}}}export{v as createFluid};