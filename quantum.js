class QuantumExperience {
    constructor() {
        this.field = document.getElementById('quantum-field');
        this.states = document.querySelectorAll('.quantum-state');
        this.ctx = this.initQuantumField();
        this.particles = [];
        this.entangledPairs = [];
        
        this.init();
    }

    initQuantumField() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.field.appendChild(canvas);
        return canvas.getContext('2d');
    }

    createParticle() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            entangled: null,
            phase: Math.random() * Math.PI * 2
        };
    }

    createEntangledPair() {
        const p1 = this.createParticle();
        const p2 = this.createParticle();
        p1.entangled = p2;
        p2.entangled = p1;
        this.entangledPairs.push([p1, p2]);
    }

    animate() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.fillStyle = 'rgba(0, 255, 242, 0.5)';

        // Update and draw quantum particles
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.phase += 0.05;

            if(p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
            if(p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * Math.sin(p.phase), 0, Math.PI * 2);
            this.ctx.fill();

            // Draw entanglement lines
            if(p.entangled) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'rgba(0, 255, 242, 0.2)';
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.entangled.x, p.entangled.y);
                this.ctx.stroke();
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    handleScroll() {
        this.states.forEach(state => {
            const rect = state.getBoundingClientRect();
            if(rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
                state.querySelector('.superposition')?.classList.add('collapsed');
                this.createQuantumEffect(state);
            }
        });
    }

    createQuantumEffect(element) {
        const rect = element.getBoundingClientRect();
        for(let i = 0; i < 5; i++) {
            const particle = this.createParticle();
            particle.x = rect.left + Math.random() * rect.width;
            particle.y = rect.top + Math.random() * rect.height;
            this.particles.push(particle);
        }
        this.createEntangledPair();
    }

    init() {
        for(let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle());
        }
        for(let i = 0; i < 10; i++) {
            this.createEntangledPair();
        }
        
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.initQuantumField());
        
        this.animate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuantumExperience();
}); 