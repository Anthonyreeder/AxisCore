class QuantumExperience {
    constructor() {
        this.field = document.getElementById('quantum-field');
        this.states = document.querySelectorAll('.quantum-state');
        this.ctx = this.initQuantumField();
        this.particles = [];
        this.lastTime = 0;
        
        this.init();
    }

    initQuantumField() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.field.appendChild(canvas);
        return canvas.getContext('2d');
    }

    createParticle(x, y) {
        return {
            x: x || Math.random() * window.innerWidth,
            y: y || Math.random() * window.innerHeight,
            size: 2,
            speedX: (Math.random() - 0.5) * 1,
            speedY: (Math.random() - 0.5) * 1,
            life: 1,
            color: `hsla(${180 + Math.random() * 30}, 100%, 70%, `,
            connections: []
        };
    }

    animate(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.fillStyle = 'rgba(0, 8, 20, 0.1)';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Update and draw particles
        this.particles = this.particles.filter(p => p.life > 0);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.003;

            // Bounce off edges
            if(p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
            if(p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + p.life + ')';
            this.ctx.fill();

            // Connect nearby particles
            this.particles.forEach(p2 => {
                if(p !== p2) {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if(distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(0, 255, 242, ${0.2 * Math.min(p.life, p2.life)})`;
                        this.ctx.stroke();
                    }
                }
            });
        });

        // Add new particles occasionally
        if(Math.random() < 0.1) {
            this.particles.push(this.createParticle());
        }

        requestAnimationFrame((t) => this.animate(t));
    }

    handleScroll() {
        this.states.forEach(state => {
            const rect = state.getBoundingClientRect();
            if(rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
                state.querySelector('.superposition')?.classList.add('collapsed');
                
                // Create particles around the visible element
                for(let i = 0; i < 10; i++) {
                    const x = rect.left + Math.random() * rect.width;
                    const y = rect.top + Math.random() * rect.height;
                    this.particles.push(this.createParticle(x, y));
                }
            }
        });
    }

    init() {
        // Initial particles
        for(let i = 0; i < 30; i++) {
            this.particles.push(this.createParticle());
        }
        
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => {
            const canvas = this.ctx.canvas;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        requestAnimationFrame((t) => this.animate(t));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuantumExperience();
}); 