
import { Point, ParticleType } from '../types';
import { COLORS, XMAS_PALETTE, FRICTION, GRAVITY } from '../constants';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: ParticleType;
  opacity: number;
  rotation: number;
  rotationSpeed: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = Math.random() * 2 + 1;
    this.size = Math.random() * 4 + 2;
    this.color = XMAS_PALETTE[Math.floor(Math.random() * XMAS_PALETTE.length)];
    this.type = this.getRandomType();
    this.opacity = Math.random() * 0.5 + 0.5;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
  }

  private getRandomType(): ParticleType {
    const r = Math.random();
    if (r < 0.6) return ParticleType.SNOWFLAKE;
    if (r < 0.8) return ParticleType.STAR;
    return ParticleType.BOKEH;
  }

  update(width: number, height: number, handPos: Point | null, gesture: string) {
    // Basic physics
    this.vy += GRAVITY;
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Interaction logic
    if (handPos) {
      const dx = this.x - handPos.x;
      const dy = this.y - handPos.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      const forceRadius = 180;

      if (dist < forceRadius) {
        const angle = Math.atan2(dy, dx);
        const strength = (forceRadius - dist) / forceRadius;

        if (gesture === 'FIST') {
          // Attract
          this.vx -= Math.cos(angle) * strength * 2;
          this.vy -= Math.sin(angle) * strength * 2;
        } else if (gesture === 'OPEN_PALM') {
          // Repel
          this.vx += Math.cos(angle) * strength * 2;
          this.vy += Math.sin(angle) * strength * 2;
        } else if (gesture === 'WAVE') {
          // Turbulence/Wind
          this.vx += (Math.random() - 0.5) * 10 * strength;
          this.vy += (Math.random() - 0.5) * 10 * strength;
        }
      }
    }

    // Reset if out of bounds
    if (this.y > height) {
      this.y = -10;
      this.x = Math.random() * width;
      this.vy = Math.random() * 2 + 1;
    }
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    switch (this.type) {
      case ParticleType.SNOWFLAKE:
        this.drawSnowflake(ctx);
        break;
      case ParticleType.STAR:
        this.drawStar(ctx);
        break;
      case ParticleType.BOKEH:
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    ctx.restore();
  }

  private drawSnowflake(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.size);
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }
  }

  private drawStar(ctx: CanvasRenderingContext2D) {
    const spikes = 5;
    const outerRadius = this.size;
    const innerRadius = this.size / 2;
    let rot = (Math.PI / 2) * 3;
    let cx = 0;
    let cy = 0;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

export class ParticleSystem {
  particles: Particle[] = [];
  width: number = 0;
  height: number = 0;

  constructor(count: number, width: number, height: number) {
    this.width = width;
    this.height = height;
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(width, height));
    }
  }

  update(handPos: Point | null, gesture: string) {
    this.particles.forEach(p => p.update(this.width, this.height, handPos, gesture));
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => p.draw(ctx));
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
