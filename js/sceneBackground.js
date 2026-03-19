/**
 * sceneBackground.js
 * Three.js ambient background: drifting particles,
 * wireframe icosahedron, and a slow-rotating torus.
 * Reacts to mouse movement for subtle camera parallax.
 */

export function initBackgroundScene() {
  if (typeof window.THREE === 'undefined') return;
  const canvas   = document.getElementById('canvas-bg');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 50;

  // ── Particle field ──
  const count = 800;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(count * 3);
  const col   = new Float32Array(count * 3);
  const palette = [
    new THREE.Color(0x4f8ef7),
    new THREE.Color(0x7b4fff),
    new THREE.Color(0x00e5ff),
    new THREE.Color(0xffffff),
  ];
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 180;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 180;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 180;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const particles = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.5, vertexColors: true, transparent: true, opacity: 0.6,
  }));
  scene.add(particles);

  // ── Wireframe icosahedron ──
  const sphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(12, 1),
    new THREE.MeshBasicMaterial({ color: 0x4f8ef7, wireframe: true, transparent: true, opacity: 0.05 })
  );
  sphere.position.set(20, -10, 0);
  scene.add(sphere);

  // ── Slow torus ──
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.05, 16, 80),
    new THREE.MeshBasicMaterial({ color: 0x7b4fff, transparent: true, opacity: 0.12 })
  );
  torus.position.set(-25, 10, -10);
  scene.add(torus);

  // ── Mouse parallax ──
  let mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  // ── Resize ──
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ──
  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    particles.rotation.y = t * 0.15;
    particles.rotation.x = t * 0.05;
    sphere.rotation.y    = t * 0.20;
    sphere.rotation.x    = t * 0.10;
    torus.rotation.z     = t * 0.30;
    torus.rotation.x     = t * 0.15;

    // Camera follows mouse lazily
    camera.position.x += (mx / window.innerWidth  * 6 - camera.position.x) * 0.03;
    camera.position.y += (-my / window.innerHeight * 6 + 3 - camera.position.y) * 0.03;

    renderer.render(scene, camera);
  })();
}
