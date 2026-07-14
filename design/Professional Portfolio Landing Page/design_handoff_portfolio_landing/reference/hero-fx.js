// Lightweight canvas hero animations for landing page options.
// Registers three custom elements: <fx-particles>, <fx-wire>, <fx-waves>.
// Each fills its parent, respects devicePixelRatio, reacts to the mouse,
// and pauses when off-screen.

class FxBase extends HTMLElement {
  connectedCallback() {
    this.style.cssText += 'display:block;position:absolute;inset:0;overflow:hidden;pointer-events:none;';
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    this.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.mouse = { x: -9999, y: -9999 };
    this._onMove = (e) => {
      const r = this.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    };
    // listen on the parent hero section so pointer-events stay off the canvas
    (this.parentElement || window).addEventListener('mousemove', this._onMove);
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this);
    this._visible = true;
    this._io = new IntersectionObserver((en) => { this._visible = en[0].isIntersecting; });
    this._io.observe(this);
    this._resize();
    this.init && this.init();
    const loop = (t) => {
      this._raf = requestAnimationFrame(loop);
      if (!this._visible || this.w === 0) return;
      this.draw(t);
    };
    this._raf = requestAnimationFrame(loop);
  }
  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    this._ro && this._ro.disconnect();
    this._io && this._io.disconnect();
    (this.parentElement || window).removeEventListener('mousemove', this._onMove);
  }
  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.onResize && this.onResize();
  }
  attr(name, fallback) { return this.getAttribute(name) || fallback; }
}

// ---------------------------------------------------------------- particles
class FxParticles extends FxBase {
  init() {
    this.accent = this.attr('accent', '#ff8a3d');
    this.line = this.attr('line', 'rgba(255,255,255,0.14)');
    this.dot = this.attr('dot', 'rgba(255,255,255,0.55)');
    this.spawn();
  }
  onResize() { this.spawn(); }
  spawn() {
    const count = Math.min(130, Math.floor((this.w * this.h) / 11000));
    this.pts = Array.from({ length: count }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }
  draw() {
    const { ctx, w, h, pts, mouse } = this;
    ctx.clearRect(0, 0, w, h);
    const R = 140, MR = 190;
    for (const p of pts) {
      // gentle drift
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
      // mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < MR * MR && d2 > 0.01) {
        const d = Math.sqrt(d2), f = (1 - d / MR) * 0.9;
        p.x += (dx / d) * f; p.y += (dy / d) * f;
      }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const alpha = 1 - Math.sqrt(d2) / R;
          ctx.strokeStyle = this.line;
          ctx.globalAlpha = alpha * 0.9;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    for (const p of pts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const near = dx * dx + dy * dy < MR * MR;
      ctx.fillStyle = near ? this.accent : this.dot;
      ctx.beginPath(); ctx.arc(p.x, p.y, near ? p.r + 0.8 : p.r, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// ---------------------------------------------------------------- wireframe
class FxWire extends FxBase {
  init() {
    this.stroke = this.attr('stroke', 'rgba(20,20,20,0.5)');
    this.accent = this.attr('accent', '#ff8a3d');
    // icosahedron vertices
    const t = (1 + Math.sqrt(5)) / 2;
    const V = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ].map(v => { const l = Math.hypot(...v); return v.map(c => c / l); });
    this.verts = V;
    const E = new Set();
    const F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
    for (const f of F) for (let i = 0; i < 3; i++) {
      const a = f[i], b = f[(i + 1) % 3];
      E.add(a < b ? a + '-' + b : b + '-' + a);
    }
    this.edges = [...E].map(s => s.split('-').map(Number));
    this.rx = 0.4; this.ry = 0;
  }
  draw(t) {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    const targetRy = (this.mouse.x > -999 ? (this.mouse.x / w - 0.5) : 0) * 0.9;
    const targetRx = 0.35 + (this.mouse.y > -999 ? (this.mouse.y / h - 0.5) : 0) * 0.5;
    this.ry += ((t * 0.00022 + targetRy) - this.ry) * 0.04;
    this.rx += (targetRx - this.rx) * 0.04;
    const cx = w * (parseFloat(this.attr('cx', '0.72'))), cy = h * 0.5;
    const scale = Math.min(w, h) * 0.34;
    const cosY = Math.cos(this.ry), sinY = Math.sin(this.ry);
    const cosX = Math.cos(this.rx), sinX = Math.sin(this.rx);
    const proj = this.verts.map(([x, y, z]) => {
      let X = x * cosY + z * sinY, Z = -x * sinY + z * cosY;
      let Y = y * cosX - Z * sinX; Z = y * sinX + Z * cosX;
      const p = 1 / (1.9 - Z * 0.5);
      return [cx + X * scale * p, cy + Y * scale * p, Z];
    });
    ctx.lineWidth = 1;
    for (const [a, b] of this.edges) {
      const pa = proj[a], pb = proj[b];
      const depth = (pa[2] + pb[2]) / 2;
      ctx.globalAlpha = 0.25 + (depth + 1) * 0.3;
      ctx.strokeStyle = this.stroke;
      ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const p of proj) {
      ctx.fillStyle = p[2] > 0.3 ? this.accent : this.stroke;
      ctx.beginPath(); ctx.arc(p[0], p[1], p[2] > 0.3 ? 3 : 2, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// ---------------------------------------------------------------- waves
class FxWaves extends FxBase {
  init() {
    this.colors = (this.attr('colors', '#ff8a3d,#ff5470,#7b5bff')).split(',');
  }
  draw(t) {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    const mx = this.mouse.x > -999 ? (this.mouse.x / w - 0.5) : 0;
    const my = this.mouse.y > -999 ? (this.mouse.y / h - 0.5) : 0;
    const lines = 26;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < lines; i++) {
      const f = i / (lines - 1);
      const baseY = h * (0.25 + f * 0.6);
      const col = this.colors[Math.floor(f * (this.colors.length - 0.001))];
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.10 + 0.28 * Math.sin(f * Math.PI);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const n = Math.sin(x * 0.006 + t * 0.0006 + i * 0.35)
          * Math.cos(x * 0.0023 - t * 0.00042 + i * 0.2);
        const y = baseY
          + n * (34 + f * 46)
          + mx * Math.sin(x * 0.004 + i) * 30
          + my * 40 * (f - 0.5);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------- type word
// <fx-typeword words="a,b,c" color="#28c05a"> — types a word, holds, erases, next.
class FxTypeWord extends HTMLElement {
  connectedCallback() {
    this.style.display = 'inline';
    this.words = (this.getAttribute('words') || 'intelligent').split(',').map(w => w.trim());
    this.span = document.createElement('span');
    this.span.style.color = this.getAttribute('color') || 'inherit';
    this.appendChild(this.span);
    this._stopped = false;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.span.textContent = this.words[0];
      return;
    }
    this._run();
  }
  disconnectedCallback() { this._stopped = true; clearTimeout(this._t); }
  _wait(ms) { return new Promise(r => { this._t = setTimeout(r, ms); }); }
  async _run() {
    let i = 0;
    while (!this._stopped) {
      const word = this.words[i % this.words.length];
      for (let c = 1; c <= word.length && !this._stopped; c++) {
        this.span.textContent = word.slice(0, c);
        await this._wait(65 + Math.random() * 45);
      }
      await this._wait(2100);
      for (let c = word.length - 1; c >= 0 && !this._stopped; c--) {
        this.span.textContent = word.slice(0, c);
        await this._wait(38);
      }
      await this._wait(380);
      i++;
    }
  }
}

customElements.define('fx-typeword', FxTypeWord);
customElements.define('fx-particles', FxParticles);
customElements.define('fx-wire', FxWire);
customElements.define('fx-waves', FxWaves);
