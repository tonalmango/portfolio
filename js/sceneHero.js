/**
 * sceneHero.js
 * Three.js interactive hero orb:
 * - Metallic icosahedron (inner + wireframe outer)
 * - Two orbiting rings
 * - Sphere of floating particles
 * - Mouse-reactive rotation
 */

export function initHeroScene() {
  if (typeof window.THREE === 'undefined') return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const parent   = canvas.parentElement;
  const w        = parent.offsetWidth;
  const h        = parent.offsetHeight || 500;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.z = 5;

  // ── Inner solid icosahedron ──
  const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.6, 1),
    new THREE.MeshStandardMaterial({
      color: 0x4f8ef7, roughness: 0.3, metalness: 0.8,
      transparent: true, opacity: 0.92,
    })
  );
  scene.add(mesh);

  // ── Outer wireframe shell ──
  const mesh2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.MeshBasicMaterial({ color: 0x7b4fff, wireframe: true, transparent: true, opacity: 0.25 })
  );
  scene.add(mesh2);

  // ── Orbiting rings ──
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.025, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 })
  );
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.015, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0x4f8ef7, transparent: true, opacity: 0.3 })
  );
  ring2.rotation.x = Math.PI / 5;
  ring2.rotation.z = Math.PI / 4;
  scene.add(ring2);

  // ── Lights ──
  const pl1 = new THREE.PointLight(0x4f8ef7, 2, 20);   pl1.position.set(4,  4, 4);
  const pl2 = new THREE.PointLight(0x7b4fff, 1.5, 20); pl2.position.set(-4, -2, 2);
  scene.add(pl1, pl2, new THREE.AmbientLight(0xffffff, 0.4));

  // ── Shell particles ──
  const pCount = 300;
  const pGeo   = new THREE.BufferGeometry();
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r     = 3.2 + Math.random() * 0.8;
    pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x00e5ff, size: 0.03, transparent: true, opacity: 0.8,
  }));
  scene.add(pts);

  // ── Mouse interaction ──
  let mx = 0, my = 0;
  parent.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mx = (e.clientX - rect.left) / rect.width  - 0.5;
    my = (e.clientY - rect.top)  / rect.height - 0.5;
  });

  // ── Resize ──
  window.addEventListener('resize', () => {
    const w2 = parent.offsetWidth;
    const h2 = parent.offsetHeight || 500;
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
    renderer.setSize(w2, h2);
  });

  // ── Animation loop ──
  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    mesh.rotation.y  = t;
    mesh.rotation.x  = t * 0.4;
    mesh2.rotation.y = -t * 0.7;
    mesh2.rotation.z = t * 0.3;
    ring1.rotation.z = t * 0.5;
    ring2.rotation.y = t * 0.6;
    pts.rotation.y   = t * 0.2;

    // Subtle mouse parallax
    mesh.rotation.y  += mx * 0.02;
    mesh.rotation.x  += my * 0.02;

    renderer.render(scene, camera);
  })();
}
