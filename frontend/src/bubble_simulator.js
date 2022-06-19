import { randomInRange } from './util.js';

export class BubbleSimulator {
    static TICK_MS = 20; // 50 FPS
    static FLOAT_SPEED = 0.6;

    constructor(targetCanvas) {
        this.targetCanvas = targetCanvas;
        this.bubbles = [];
        this.start = this.start.bind(this);
        this.render = this.render.bind(this);
    }

    start() {
        window.requestAnimationFrame(this.render);
    }

    addBubble(radius, fill) {
        this.bubbles.push({
            // Spawn at a random horizontal position, fully inside the viewport:
            "x": randomInRange(radius, window.innerWidth - radius),
            // Spawn just below the viewport:
            "y": window.innerHeight + radius,
            "r": radius,
            "fillStyle": fill
        });
    }

    render(timestamp) {
        if (this.lastRender === undefined) {
            this.lastRender = timestamp;
        }

        if (timestamp - this.lastRender > BubbleSimulator.TICK_MS) {
            this.targetCanvas.width = window.innerWidth;
            this.targetCanvas.height = window.innerHeight;

            const ctx = this.targetCanvas.getContext('2d');
            for (let i = this.bubbles.length - 1; i >= 0; i--) {
                const bubble = this.bubbles[i];

                bubble.y -= BubbleSimulator.FLOAT_SPEED;
                if (bubble.y < -bubble.r) {
                    // Fully out of view, remove it:
                    this.bubbles.splice(i, 1);
                }
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI, false);
                ctx.fillStyle = bubble.fillStyle;
                ctx.fill();
            }
        }

        window.requestAnimationFrame(this.render);
    }

}