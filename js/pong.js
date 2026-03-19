/**
 * pong.js
 * Mini neon Pong game in a modal.
 * - Player: mouse / touch
 * - CPU: simple AI tracker
 * - Ball trail, glow effects
 * - First to 7 wins
 */

export function initPong() {
  const trigger  = document.getElementById('pong-trigger');
  const modal    = document.getElementById('pong-modal');
  const closeBtn = document.getElementById('pong-close');
  const canvas   = document.getElementById('pong-canvas');
  const ctx      = canvas.getContext('2d');

  const W = canvas.width;   // 536
  const H = canvas.height;  // 300

  let playerScore = 0;
  let cpuScore    = 0;
  let animFrame   = null;
  let running     = false;

  const state = {
    ball:   { x: W / 2, y: H / 2, vx: 4, vy: 3, r: 8 },
    player: { x: 16, y: H / 2 - 40, w: 12, h: 80 },
    cpu:    { x: W - 28, y: H / 2 - 40, w: 12, h: 80 },
    trail:  [],
  };

  // ── Reset ball to center ──
  function reset() {
    state.ball.x  = W / 2;
    state.ball.y  = H / 2;
    state.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
    state.ball.vy = (Math.random() - 0.5) * 6;
    state.trail   = [];
  }

  // ── Draw a single frame ──
  function draw() {
    const b = state.ball;

    // Background
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    ctx.fillStyle = 'rgba(79,142,247,0.07)';
    for (let x = 20; x < W; x += 30) {
      for (let y = 20; y < H; y += 30) {
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Center dashed line
    ctx.setLineDash([6, 10]);
    ctx.strokeStyle = 'rgba(79,142,247,0.15)';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.setLineDash([]);

    // Ball trail
    state.trail.forEach((p, i) => {
      const alpha = (i / state.trail.length) * 0.35;
      ctx.beginPath();
      ctx.arc(p.x, p.y, b.r * (i / state.trail.length), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      ctx.fill();
    });

    // Ball glow
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 3);
    grad.addColorStop(0, 'rgba(0,229,255,0.4)');
    grad.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();

    // Ball
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = '#00e5ff'; ctx.fill();

    // Paddles
    function drawPaddle(p, color) {
      const g = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(79,142,247,0.3)');
      ctx.fillStyle  = g;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 12;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(p.x, p.y, p.w, p.h, 4);
      } else {
        ctx.rect(p.x, p.y, p.w, p.h);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    drawPaddle(state.player, '#4f8ef7');
    drawPaddle(state.cpu,    '#7b4fff');
  }

  // ── Update physics for one tick ──
  function update() {
    const b = state.ball;

    // Trail
    state.trail.push({ x: b.x, y: b.y });
    if (state.trail.length > 12) state.trail.shift();

    // Move
    b.x += b.vx;
    b.y += b.vy;

    // Wall bounces
    if (b.y - b.r < 0) { b.y = b.r;     b.vy *= -1; }
    if (b.y + b.r > H) { b.y = H - b.r; b.vy *= -1; }

    // Player paddle collision
    const p = state.player;
    if (b.x - b.r < p.x + p.w && b.x + b.r > p.x && b.y > p.y && b.y < p.y + p.h) {
      b.vx  = Math.abs(b.vx) * 1.05;
      b.vy += ((b.y - (p.y + p.h / 2)) / (p.h / 2)) * 2;
      b.x   = p.x + p.w + b.r;
    }

    // CPU paddle collision
    const c = state.cpu;
    if (b.x + b.r > c.x && b.x - b.r < c.x + c.w && b.y > c.y && b.y < c.y + c.h) {
      b.vx = -Math.abs(b.vx) * 1.05;
      b.x  = c.x - b.r;
    }

    // CPU AI — tracks ball with slight lag
    const cpuCenter = c.y + c.h / 2;
    c.y += (b.y - cpuCenter) * 0.06;
    c.y  = Math.max(0, Math.min(H - c.h, c.y));

    // Scoring
    if (b.x < 0) {
      cpuScore++;
      document.getElementById('pong-cpu-score').textContent = cpuScore;
      reset();
      if (cpuScore >= 7) endGame('CPU');
    }
    if (b.x > W) {
      playerScore++;
      document.getElementById('pong-player-score').textContent = playerScore;
      reset();
      if (playerScore >= 7) endGame('You');
    }

    // Speed cap to prevent teleporting
    b.vx = Math.min(Math.max(b.vx, -12), 12);
    b.vy = Math.min(Math.max(b.vy, -10), 10);
  }

  // ── End game overlay ──
  function endGame(winner) {
    running = false;
    cancelAnimationFrame(animFrame);
    ctx.fillStyle = 'rgba(6,8,15,0.8)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#e8eaf0';
    ctx.font      = 'bold 32px Syne, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(winner + ' Win' + (winner === 'CPU' ? 's' : '!'), W / 2, H / 2 - 10);
    ctx.font      = '14px DM Mono, monospace';
    ctx.fillStyle = '#8892a4';
    ctx.fillText('Close & reopen to play again', W / 2, H / 2 + 30);
  }

  // ── Main game loop ──
  function loop() {
    if (!running) return;
    update();
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  // ── Input: mouse ──
  canvas.addEventListener('mousemove', (e) => {
    const rect  = canvas.getBoundingClientRect();
    const scale = H / rect.height;
    state.player.y = (e.clientY - rect.top) * scale - state.player.h / 2;
    state.player.y = Math.max(0, Math.min(H - state.player.h, state.player.y));
  });

  // ── Input: touch ──
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect  = canvas.getBoundingClientRect();
    const scale = H / rect.height;
    state.player.y = (e.touches[0].clientY - rect.top) * scale - state.player.h / 2;
    state.player.y = Math.max(0, Math.min(H - state.player.h, state.player.y));
  }, { passive: false });

  // ── Open / close modal ──
  function openGame() {
    modal.classList.add('active');
    if (!running) {
      playerScore = 0;
      cpuScore    = 0;
      document.getElementById('pong-player-score').textContent = '0';
      document.getElementById('pong-cpu-score').textContent    = '0';
      reset();
      running = true;
      loop();
    }
  }

  function closeGame() {
    modal.classList.remove('active');
    running = false;
    cancelAnimationFrame(animFrame);
  }

  trigger.addEventListener('click',  openGame);
  closeBtn.addEventListener('click', closeGame);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGame();
  });
}
