/*
 * Hero animations for glrebadulla.dev — ported from the design handoff's
 * reference/hero-fx.js. Registers two custom elements:
 *   <fx-particles accent="#28c05a">          — interactive particle network
 *   <fx-typeword words="a,b,c" color="#…">    — type-and-erase rotating word
 *
 * Ported faithfully: the animation math is unchanged from the reference. The
 * dead <fx-wire> / <fx-waves> prototypes were dropped. Two spec fixes applied:
 *   1. FxBase honors prefers-reduced-motion (draw one static frame, no loop) —
 *      the reference only handled reduced motion in FxTypeWord.
 *   2. FxTypeWord clears its SSR fallback text before animating, so the
 *      server-rendered word never duplicates.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/** Shared canvas lifecycle: DPR-aware sizing, mouse tracking on the parent,
 *  pause when off-screen, re-seed on resize, reduced-motion static frame. */
abstract class FxBase extends HTMLElement {
  protected canvas!: HTMLCanvasElement;
  protected ctx!: CanvasRenderingContext2D;
  protected mouse = { x: -9999, y: -9999 };
  protected w = 0;
  protected h = 0;

  private _raf = 0;
  private _ro: ResizeObserver | null = null;
  private _io: IntersectionObserver | null = null;
  private _visible = true;
  private _ready = false;
  private _reducedMotion = false;
  private readonly _onMove = (e: Event): void => {
    const me = e as MouseEvent;
    const r = this.getBoundingClientRect();
    this.mouse.x = me.clientX - r.left;
    this.mouse.y = me.clientY - r.top;
  };

  connectedCallback(): void {
    this.style.cssText +=
      'display:block;position:absolute;inset:0;overflow:hidden;pointer-events:none;';
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;';
    this.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this._reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Track the mouse on the parent hero section so pointer-events stay off the
    // canvas (the canvas must not intercept clicks/hovers).
    (this.parentElement ?? window).addEventListener('mousemove', this._onMove);

    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this);
    this._io = new IntersectionObserver((entries) => {
      this._visible = entries[0]?.isIntersecting ?? true;
    });
    this._io.observe(this);

    this._resize();
    this.init();
    this._ready = true;

    if (this._reducedMotion) {
      this.draw(0); // one static frame, no animation loop
      return;
    }

    const loop = (t: number): void => {
      this._raf = requestAnimationFrame(loop);
      if (!this._visible || this.w === 0) return;
      this.draw(t);
    };
    this._raf = requestAnimationFrame(loop);
  }

  disconnectedCallback(): void {
    cancelAnimationFrame(this._raf);
    this._ro?.disconnect();
    this._io?.disconnect();
    (this.parentElement ?? window).removeEventListener(
      'mousemove',
      this._onMove
    );
  }

  private _resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.getBoundingClientRect();
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.onResize();
    // Resizing clears the canvas; under reduced motion the loop isn't running,
    // so redraw the static frame to avoid a blank hero.
    if (this._ready && this._reducedMotion) this.draw(0);
  }

  protected attr(name: string, fallback: string): string {
    return this.getAttribute(name) || fallback;
  }

  /** Called once after the first resize. Override to seed state. */
  protected init(): void {}
  /** Called after every resize. Override to re-seed on new dimensions. */
  protected onResize(): void {}
  /** Render a single frame. */
  protected abstract draw(t: number): void;
}

// ---------------------------------------------------------------- particles
class FxParticles extends FxBase {
  private accent = '#28c05a';
  private line = 'rgba(255,255,255,0.14)';
  private dot = 'rgba(255,255,255,0.55)';
  private pts: Particle[] = [];

  protected init(): void {
    this.accent = this.attr('accent', '#28c05a');
    this.line = this.attr('line', 'rgba(255,255,255,0.14)');
    this.dot = this.attr('dot', 'rgba(255,255,255,0.55)');
    this.spawn();
  }

  protected onResize(): void {
    this.spawn();
  }

  private spawn(): void {
    const count = Math.min(130, Math.floor((this.w * this.h) / 11000));
    this.pts = Array.from({ length: count }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  protected draw(): void {
    const { ctx, w, h, pts, mouse } = this;
    ctx.clearRect(0, 0, w, h);
    const R = 140;
    const MR = 190;

    for (const p of pts) {
      // gentle drift + edge wrap
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
      // mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < MR * MR && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = (1 - d / MR) * 0.9;
        p.x += (dx / d) * f;
        p.y += (dy / d) * f;
      }
    }

    // connecting lines
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i]!;
        const b = pts[j]!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const alpha = 1 - Math.sqrt(d2) / R;
          ctx.strokeStyle = this.line;
          ctx.globalAlpha = alpha * 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // dots (accent + larger near the cursor)
    ctx.globalAlpha = 1;
    for (const p of pts) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const near = dx * dx + dy * dy < MR * MR;
      ctx.fillStyle = near ? this.accent : this.dot;
      ctx.beginPath();
      ctx.arc(p.x, p.y, near ? p.r + 0.8 : p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ---------------------------------------------------------------- type word
class FxTypeWord extends HTMLElement {
  private words: string[] = ['intelligent'];
  private span!: HTMLSpanElement;
  private _stopped = false;
  private _t = 0;

  connectedCallback(): void {
    this.style.display = 'inline';
    this.words = (this.getAttribute('words') || 'intelligent')
      .split(',')
      .map((w) => w.trim());

    // Clear the SSR fallback word before appending our span, so it never
    // duplicates once JS takes over.
    this.textContent = '';
    this.span = document.createElement('span');
    this.span.style.color = this.getAttribute('color') || 'inherit';
    this.appendChild(this.span);

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.span.textContent = this.words[0] ?? '';
      return;
    }
    void this._run();
  }

  disconnectedCallback(): void {
    this._stopped = true;
    clearTimeout(this._t);
  }

  private _wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this._t = window.setTimeout(resolve, ms);
    });
  }

  private async _run(): Promise<void> {
    let i = 0;
    while (!this._stopped) {
      const word = this.words[i % this.words.length]!;
      for (let c = 1; c <= word.length && !this._stopped; c++) {
        this.span.textContent = word.slice(0, c);
        await this._wait(65 + Math.random() * 45); // type: 65–110ms/char
      }
      await this._wait(2100); // hold
      for (let c = word.length - 1; c >= 0 && !this._stopped; c--) {
        this.span.textContent = word.slice(0, c);
        await this._wait(38); // erase
      }
      await this._wait(380); // pause before next word
      i++;
    }
  }
}

if (!customElements.get('fx-particles')) {
  customElements.define('fx-particles', FxParticles);
}
if (!customElements.get('fx-typeword')) {
  customElements.define('fx-typeword', FxTypeWord);
}

// Mark this file as a module so its class declarations are module-scoped (not
// global). Consumers import it for side effects: `import '../scripts/hero-fx'`.
export {};
