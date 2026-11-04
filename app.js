import * as THREE from './vendor/three.module.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => innerWidth < 720;
document.body.classList.add('loading');

// ---------- Interface ----------
let progress = 0;
const loadingTimer = setInterval(() => {
  progress = Math.min(100, progress + Math.ceil(Math.random() * 13));
  $('#load-progress').style.width = `${progress}%`;
  $('#load-value').textContent = `${String(progress).padStart(3, '0')}%`;
  if (progress === 100) {
    clearInterval(loadingTimer);
    setTimeout(() => {
      $('#loader').classList.add('hidden');
      document.body.classList.remove('loading');
      $$('.hero .reveal').forEach(el => el.classList.add('visible'));
    }, 350);
  }
}, 70);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: .12 });
$$('.reveal:not(.hero .reveal)').forEach(el => revealObserver.observe(el));

const sections = $$('.page-section');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) $$('.desktop-nav a').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));
addEventListener('scroll', () => $('.topbar').classList.toggle('scrolled', scrollY > 30), { passive: true });
$('#menu-toggle').addEventListener('click', () => {
  const open = $('.desktop-nav').classList.toggle('open');
  $('#menu-toggle').setAttribute('aria-expanded', open);
});
$$('.desktop-nav a').forEach(a => a.addEventListener('click', () => $('.desktop-nav').classList.remove('open')));

function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 3200);
}

const transmissions = {
  symbiose: {
    index: '01', meta: 'ARCHIVE 001 · ÉCOLOGIE · RÉCIPROCITÉ', title: 'SYMBIOSE',
    lead: 'En 2089, les villes ne sont plus construites sur la nature. Elles sont construites avec elle.',
    story: 'Les premières forêts urbaines comestibles sont apparues après les grandes canicules. Puis les habitants ont rendu aux rivières leur liberté. Les bâtiments sont devenus des organismes : ils filtrent l’eau, cultivent des matériaux et offrent un refuge à d’autres espèces. La technologie a changé de rôle. Elle ne domine plus le vivant ; elle apprend de lui.<br><br>Ce monde n’est pas venu d’une invention miraculeuse. Il a commencé quand une génération a décidé de mesurer la richesse autrement : à la qualité de l’air, à la diversité du vivant, au temps rendu aux humains.',
    quote: '« Nous avons cessé de sauver la nature quand nous avons compris que nous ne nous en sauvions pas. »',
    speech: 'Ici, en deux mille quatre-vingt-neuf, les villes respirent. Nous avons arrêté de demander à la Terre de suivre le rythme de nos machines. Nous avons appris à ralentir, à réparer, à laisser une place à ce que nous ne comprenons pas encore. Votre futur n’a pas besoin d’une invention miraculeuse. Il a besoin d’une décision. Prenez soin du vivant, et le vivant prendra soin de vous.'
  },
  memoire: {
    index: '02', meta: 'ARCHIVE 002 · TECHNOLOGIE · ÉTHIQUE', title: 'MÉMOIRE',
    lead: 'Les intelligences artificielles se souviennent de tout. Les humains leur ont appris l’art d’oublier.',
    story: 'Après l’ère de la capture permanente, le droit à l’oubli est devenu le fondement de toute intelligence. Les systèmes sont publics, auditables et limités. Chacun peut comprendre pourquoi une machine propose, refuse ou se souvient. Les données les plus précieuses ne sont plus celles que l’on accumule, mais celles que l’on choisit de protéger.<br><br>Les machines n’ont jamais remplacé notre jugement. Elles ont libéré du temps pour la conversation, le soin et la création. Leur plus grande prouesse n’est pas leur vitesse : c’est la confiance qu’elles ont su mériter.',
    quote: '« Une intelligence ne devient précieuse que lorsqu’elle nous aide à rester humains. »',
    speech: 'Nos machines se souviennent de presque tout. Mais nous leur avons appris quelque chose d’essentiel : le droit à l’oubli. Une intelligence n’est précieuse que si elle protège notre liberté. Ne demandez pas seulement ce qu’une technologie peut faire. Demandez qui elle sert, ce qu’elle préserve, et ce qu’elle accepte de ne jamais savoir.'
  },
  pluralite: {
    index: '03', meta: 'ARCHIVE 003 · SOCIÉTÉ · IMAGINATION', title: 'PLURALITÉ',
    lead: 'Il n’existe plus un futur officiel. Il existe des milliers de demains, négociés ensemble.',
    story: 'Les décisions autrefois réservées à quelques-uns sont devenues des espaces d’imagination collective. Dans chaque territoire, des assemblages citoyens explorent les conséquences de leurs choix avant d’agir. Les désaccords ne sont plus effacés : ils sont cartographiés, écoutés, parfois célébrés.<br><br>Ce monde n’est pas uniforme. Des langues, des rythmes et des manières d’habiter coexistent. La pluralité n’est plus un problème à résoudre, mais la condition de notre résilience. Personne ne possède le futur. C’est pourquoi il appartient à tout le monde.',
    quote: '« Le progrès n’était pas une route unique, mais un territoire assez vaste pour tous nos rêves. »',
    speech: 'Nous avons découvert qu’il n’existait pas un seul futur. Il y a des milliers de demains possibles. Notre force n’est pas de penser pareil, mais de pouvoir imaginer ensemble sans nous effacer. Ne laissez personne vous dire que le monde ne peut pas changer. Le futur n’est pas une route unique. C’est un territoire assez vaste pour tous vos rêves.'
  }
};

let currentTransmission = null;
function openTransmission(key) {
  const data = transmissions[key];
  if (!data) return;
  currentTransmission = key;
  speechSynthesis?.cancel();
  $('#listen-button span').textContent = 'ÉCOUTER LA VOIX';
  $('.modal-index').textContent = data.index;
  $('.modal-meta').textContent = data.meta;
  $('.artifact-modal h2').textContent = data.title;
  $('.modal-lead').textContent = data.lead;
  $('.modal-story').innerHTML = data.story;
  $('.artifact-modal blockquote').textContent = data.quote;
  $('#artifact-modal').showModal();
}
$$('.artifact').forEach(card => {
  card.addEventListener('click', () => openTransmission(card.dataset.artifact));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTransmission(card.dataset.artifact); } });
});
$('.modal-close').addEventListener('click', () => $('#artifact-modal').close());
$('#artifact-modal').addEventListener('click', e => { if (e.target === $('#artifact-modal')) $('#artifact-modal').close(); });
$('#listen-button').addEventListener('click', () => {
  if (!('speechSynthesis' in window)) return toast('La synthèse vocale n’est pas disponible ici.');
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    $('#listen-button span').textContent = 'ÉCOUTER LA VOIX';
    return;
  }
  const utterance = new SpeechSynthesisUtterance(transmissions[currentTransmission].speech);
  utterance.lang = 'fr-FR'; utterance.rate = .88; utterance.pitch = .82;
  const voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('fr'));
  if (voice) utterance.voice = voice;
  utterance.onend = () => $('#listen-button span').textContent = 'ÉCOUTER LA VOIX';
  $('#listen-button span').textContent = 'ARRÊTER LA VOIX';
  speechSynthesis.speak(utterance);
});
$('#share-button').addEventListener('click', async () => {
  const data = { title: 'NEXUS/09', text: 'J’ai reçu une transmission depuis 2089. À toi de choisir la suite.', url: location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(`${data.text} ${data.url}`); toast('SIGNAL COPIÉ. À VOUS DE LE TRANSMETTRE.'); }
  } catch (e) { if (e.name !== 'AbortError') toast('Copiez l’adresse du Nexus pour partager le signal.'); }
});

// ---------- Paysage sonore génératif ----------
let audioContext, masterGain, soundActive = false;
function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain(); masterGain.gain.value = 0;
  const filter = audioContext.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 480; filter.Q.value = 3;
  filter.connect(masterGain); masterGain.connect(audioContext.destination);
  [55, 82.5, 110.3, 164.8].forEach((frequency, i) => {
    const osc = audioContext.createOscillator(), gain = audioContext.createGain();
    osc.type = i % 2 ? 'sine' : 'triangle'; osc.frequency.value = frequency;
    gain.gain.value = .055 / (i + 1); osc.connect(gain); gain.connect(filter); osc.start();
  });
  const lfo = audioContext.createOscillator(), lfoGain = audioContext.createGain();
  lfo.frequency.value = .07; lfoGain.gain.value = 220; lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
}
$('#sound-toggle').addEventListener('click', async () => {
  if (!audioContext) initAudio();
  await audioContext.resume(); soundActive = !soundActive;
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.linearRampToValueAtTime(soundActive ? .7 : 0, audioContext.currentTime + 1);
  $('#sound-toggle').setAttribute('aria-pressed', soundActive);
  $('#sound-toggle').setAttribute('aria-label', soundActive ? 'Couper le son' : 'Activer le son');
});

// ---------- Univers WebGL / WebXR ----------
const canvas = $('#universe');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile(), powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile() ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local-floor');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06090b); scene.fog = new THREE.FogExp2(0x06090b, .038);
const rig = new THREE.Group(); scene.add(rig);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .05, 150);
camera.position.set(0, 0, 9); rig.add(camera);
const world = new THREE.Group(); scene.add(world);

scene.add(new THREE.AmbientLight(0x8ab9a5, .25));
const keyLight = new THREE.PointLight(0xb9ff38, 22, 20); keyLight.position.set(3, 2, 4); world.add(keyLight);
const rimLight = new THREE.PointLight(0x46b9ff, 14, 20); rimLight.position.set(-4, -2, 0); world.add(rimLight);

const coreGroup = new THREE.Group(); world.add(coreGroup);
const coreUniforms = { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xaaff55) } };
const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.48, 5),
  new THREE.ShaderMaterial({
    uniforms: coreUniforms,
    vertexShader: `varying vec3 vNormal; varying vec3 vPos; uniform float uTime;
      void main(){vNormal=normal;vPos=position;vec3 p=position;float n=sin(p.y*5.+uTime*.45)*sin(p.x*4.-uTime*.25)*.045;p+=normal*n;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec3 vNormal;varying vec3 vPos;uniform float uTime;uniform vec3 uColor;
      void main(){float fres=pow(1.-abs(dot(normalize(vNormal),vec3(0.,0.,1.))),2.5);float veins=sin(vPos.y*13.+sin(vPos.x*8.+uTime*.35)*2.)*.5+.5;vec3 base=mix(vec3(.008,.025,.018),uColor*.28,veins*.24);vec3 col=base+uColor*fres*.8;float sparkle=pow(max(0.,sin(vPos.x*35.+vPos.y*29.+uTime)),35.);col+=sparkle*uColor*.35;gl_FragColor=vec4(col,1.);}`
  })
); coreGroup.add(core);
const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.58, 2), new THREE.MeshBasicMaterial({ color: 0xb9ff38, wireframe: true, transparent: true, opacity: .075 })); coreGroup.add(wire);

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d'), g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(185,255,56,.3)'); g.addColorStop(.25, 'rgba(120,255,100,.12)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
glow.scale.set(7, 7, 1); coreGroup.add(glow);
const rings = [];
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05 + i * .36, .006, 4, 160), new THREE.MeshBasicMaterial({ color: i === 1 ? 0x6fffe0 : 0xb9ff38, transparent: true, opacity: .18 - i * .035 }));
  ring.rotation.set(1.1 + i * .38, .2 + i * .55, 0); coreGroup.add(ring); rings.push(ring);
}
const orbital = new THREE.Group(); coreGroup.add(orbital);
for (let i = 0; i < 24; i++) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(.015 + Math.random() * .025, .015, .08 + Math.random() * .13), new THREE.MeshBasicMaterial({ color: i % 3 ? 0x7b9483 : 0xb9ff38, transparent: true, opacity: .45 }));
  const a = Math.random() * Math.PI * 2, r = 2.2 + Math.random() * 1.25;
  m.position.set(Math.cos(a) * r, (Math.random() - .5) * 2.8, Math.sin(a) * r); m.lookAt(0, 0, 0); orbital.add(m);
}

const starCount = mobile() ? 700 : 1600;
const starPositions = new Float32Array(starCount * 3), starSizes = new Float32Array(starCount);
for (let i = 0; i < starCount; i++) {
  const r = 8 + Math.random() * 55, a = Math.random() * Math.PI * 2;
  starPositions[i * 3] = Math.cos(a) * r; starPositions[i * 3 + 1] = (Math.random() - .5) * 38; starPositions[i * 3 + 2] = Math.sin(a) * r - 12;
  starSizes[i] = Math.random();
}
const starsGeo = new THREE.BufferGeometry(); starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0x9ab6a6, size: .026, transparent: true, opacity: .65, sizeAttenuation: true })); scene.add(stars);

const grid = new THREE.GridHelper(100, 80, 0x335d3c, 0x17261e); grid.position.y = -3.2; grid.material.transparent = true; grid.material.opacity = .3; scene.add(grid);

const artifacts3D = new THREE.Group(); world.add(artifacts3D); artifacts3D.visible = false;
const clickable = [];
function labelSprite(text, color = '#b9ff38', width = 512) {
  const c = document.createElement('canvas'); c.width = width; c.height = 96;
  const ctx = c.getContext('2d'); ctx.font = '600 27px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(text, width / 2, 50);
  const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })); sprite.scale.set(2.7, .5, 1); return sprite;
}
['SYMBIOSE', 'MÉMOIRE', 'PLURALITÉ'].forEach((name, i) => {
  const group = new THREE.Group(); group.position.set((i - 1) * 3.4, .15, -1.5 - Math.abs(i - 1) * .5);
  const shape = i === 0 ? new THREE.IcosahedronGeometry(.55, 1) : i === 1 ? new THREE.BoxGeometry(.85, .85, .85) : new THREE.TorusKnotGeometry(.38, .1, 80, 10);
  const mesh = new THREE.Mesh(shape, new THREE.MeshStandardMaterial({ color: 0x14251c, emissive: i === 2 ? 0x4e2866 : 0x294e19, emissiveIntensity: 1.3, metalness: .7, roughness: .2, wireframe: i === 2 }));
  mesh.userData.key = ['symbiose', 'memoire', 'pluralite'][i]; group.add(mesh); clickable.push(mesh);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(.9, .008, 4, 70), new THREE.MeshBasicMaterial({ color: 0xb9ff38, transparent: true, opacity: .3 })); halo.rotation.x = Math.PI / 2; group.add(halo);
  const label = labelSprite(`0${i + 1}  /  ${name}`); label.position.y = -1; group.add(label);
  artifacts3D.add(group);
});

let portalActive = false, dragging = false, lastX = 0, lastY = 0, yaw = 0, pitch = 0;
let scrollRatio = 0;
const keys = {};
function setPortal(active) {
  portalActive = active; document.body.classList.toggle('portal-active', active);
  $('#portal-hud').setAttribute('aria-hidden', !active); artifacts3D.visible = active || renderer.xr.isPresenting;
  if (active) { yaw = pitch = 0; camera.position.set(0, 0, 8); }
  else { camera.position.set(0, 0, 9); camera.rotation.set(0, 0, 0); rig.position.set(0, 0, 0); }
}
$('#enter-portal').addEventListener('click', () => setPortal(true));
$('#exit-portal').addEventListener('click', () => setPortal(false));
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Escape' && portalActive) setPortal(false);
});
addEventListener('keyup', e => keys[e.code] = false);
canvas.addEventListener('pointerdown', e => { if (portalActive) { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); } });
canvas.addEventListener('pointerup', () => dragging = false);
canvas.addEventListener('pointermove', e => {
  mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight * 2 - 1);
  if (dragging && portalActive) { yaw -= (e.clientX - lastX) * .003; pitch -= (e.clientY - lastY) * .003; pitch = THREE.MathUtils.clamp(pitch, -.8, .8); lastX = e.clientX; lastY = e.clientY; }
});
canvas.addEventListener('click', e => {
  if (!portalActive || Math.abs(e.clientX - lastX) > 5) return;
  raycaster.setFromCamera(new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1)), camera);
  const hit = raycaster.intersectObjects(clickable)[0]; if (hit) openTransmission(hit.object.userData.key);
});

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
const controllers = [];
for (let i = 0; i < 2; i++) {
  const controller = renderer.xr.getController(i);
  controller.addEventListener('selectstart', () => {
    const matrix = new THREE.Matrix4().identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld); raycaster.ray.direction.set(0, 0, -1).applyMatrix4(matrix);
    const hit = raycaster.intersectObjects(clickable)[0]; if (hit) toast(`TRANSMISSION ${transmissions[hit.object.userData.key].title} SÉLECTIONNÉE`);
  });
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -4)]), new THREE.LineBasicMaterial({ color: 0xb9ff38, transparent: true, opacity: .4 }));
  controller.add(line); rig.add(controller); controllers.push(controller);
}

async function setupVR() {
  const button = $('#vr-button');
  if (!('xr' in navigator)) { button.innerHTML = '<span class="vr-dot"></span> MODE IMMERSIF'; button.title = 'WebXR absent : exploration 3D disponible'; return; }
  const supported = await navigator.xr.isSessionSupported('immersive-vr').catch(() => false);
  if (!supported) { button.innerHTML = '<span class="vr-dot"></span> MODE IMMERSIF'; button.title = 'Casque non détecté : exploration 3D disponible'; return; }
  button.addEventListener('click', async () => {
    if (renderer.xr.isPresenting) return;
    try {
      const session = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] });
      await renderer.xr.setSession(session);
      session.addEventListener('end', () => { world.position.y = 0; grid.position.y = -3.2; rig.position.set(0, 0, 0); setPortal(false); });
      world.position.y = 1.5; grid.position.y = 0; rig.position.z = 5; artifacts3D.visible = true;
    } catch { toast('LE PORTAIL VR N’A PAS PU S’OUVRIR. EXPLORATION 3D DISPONIBLE.'); }
  });
}
setupVR();
$('#vr-button').addEventListener('click', () => { if (!renderer.xr.isPresenting && $('#vr-button').textContent.includes('IMMERSIF')) setPortal(true); });

function positionCore() {
  if (portalActive || renderer.xr.isPresenting) coreGroup.position.set(0, .6, -2.5);
  else if (mobile()) coreGroup.position.set(1.6, -.6, -4.5);
  else coreGroup.position.set(2.8, .25, 0);
}
positionCore();
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, mobile() ? 1.5 : 2)); positionCore();
});
addEventListener('scroll', () => { scrollRatio = scrollY / Math.max(1, document.body.scrollHeight - innerHeight); }, { passive: true });

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const t = clock.getElapsedTime();
  coreUniforms.uTime.value = t;
  if (!reducedMotion) {
    core.rotation.y = t * .055; core.rotation.x = Math.sin(t * .15) * .12;
    wire.rotation.y = -t * .04; wire.rotation.z = t * .025;
    rings.forEach((r, i) => r.rotation.z = t * (.025 + i * .018));
    orbital.rotation.y = t * .045; stars.rotation.y = t * .0015;
    artifacts3D.children.forEach((g, i) => { g.children[0].rotation.x = t * (.12 + i * .03); g.children[0].rotation.y = t * .17; g.position.y = .15 + Math.sin(t * .7 + i * 2) * .12; });
  }
  if (!renderer.xr.isPresenting) {
    if (portalActive) {
      camera.rotation.order = 'YXZ'; camera.rotation.y = yaw; camera.rotation.x = pitch;
      const speed = .055;
      if (keys.KeyW || keys.ArrowUp) { camera.position.x -= Math.sin(yaw) * speed; camera.position.z -= Math.cos(yaw) * speed; }
      if (keys.KeyS || keys.ArrowDown) { camera.position.x += Math.sin(yaw) * speed; camera.position.z += Math.cos(yaw) * speed; }
      if (keys.KeyA || keys.ArrowLeft) camera.position.x -= Math.cos(yaw) * speed;
      if (keys.KeyD || keys.ArrowRight) camera.position.x += Math.cos(yaw) * speed;
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -9, 9); camera.position.z = THREE.MathUtils.clamp(camera.position.z, -9, 12);
      $('#hud-coordinates').textContent = `X ${camera.position.x.toFixed(1)} · Z ${camera.position.z.toFixed(1)}`;
    } else {
      world.rotation.y += ((mouse.x * .035 + scrollRatio * .5) - world.rotation.y) * .025;
      world.rotation.x += ((-mouse.y * .025) - world.rotation.x) * .025;
    }
    positionCore();
  }
  renderer.render(scene, camera);
});
