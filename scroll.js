class ScrollExperience {
    constructor() {
        this.lightBars = [];
        this.notes = [];
        this.lastScrollY = 0;
        this.scrollVelocity = 0;
        this.sections = document.querySelectorAll('.content-section');
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        // Create light bars
        const numBars = 12;
        for(let i = 0; i < numBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'light-bar';
            bar.style.left = `${(i + 1) * (window.innerWidth / (numBars + 1))}px`;
            document.body.appendChild(bar);
            this.lightBars.push(bar);
        }
    }

    createNote(x, y, hue) {
        const note = document.createElement('div');
        note.className = 'note';
        note.style.left = `${x}px`;
        note.style.top = `${y}px`;
        note.style.width = '20px';
        note.style.height = '20px';
        note.style.background = `hsl(${hue}, 100%, 70%)`;
        note.style.boxShadow = `0 0 20px hsl(${hue}, 100%, 70%)`;
        document.body.appendChild(note);
        
        requestAnimationFrame(() => {
            note.style.opacity = '1';
            note.style.transform = `scale(1.5) translateX(${this.scrollVelocity > 0 ? '100px' : '-100px'})`;
        });
        
        setTimeout(() => note.remove(), 1000);
    }

    createSmoke(element) {
        const smoke = document.createElement('canvas');
        smoke.className = 'smoke-effect';
        smoke.width = 200;
        smoke.height = 200;
        element.appendChild(smoke);

        const ctx = smoke.getContext('2d');
        let particles = [];
        
        // Create smoke particles
        for(let i = 0; i < 50; i++) {
            particles.push({
                x: smoke.width/2,
                y: smoke.height/2,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 2),
                size: Math.random() * 15 + 5,
                opacity: Math.random() * 0.5 + 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, smoke.width, smoke.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= 0.01;
                p.size += 0.2;

                if(p.opacity > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                    ctx.fill();
                }
            });

            particles = particles.filter(p => p.opacity > 0);
            
            if(particles.length > 0) {
                requestAnimationFrame(animate);
            } else {
                smoke.remove();
            }
        };

        animate();
    }

    updateProgress() {
        const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        document.getElementById('progress-bar').style.height = `${scrollProgress * 100}%`;
    }

    handleScroll() {
        const currentScroll = window.scrollY;
        this.scrollVelocity = currentScroll - this.lastScrollY;
        this.lastScrollY = currentScroll;

        // Update light bars
        this.lightBars.forEach((bar, i) => {
            const hue = (i * 30 + currentScroll / 2) % 360;
            const intensity = Math.min(Math.abs(this.scrollVelocity) / 5, 100);
            bar.style.background = `linear-gradient(to bottom, 
                transparent,
                hsl(${hue}, 100%, ${70 + intensity}%),
                transparent
            )`;
            bar.style.filter = `blur(${Math.abs(this.scrollVelocity) / 20}px)`;
        });

        // Update sections visibility with smoke effect
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if(rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
                if(!section.classList.contains('active')) {
                    section.classList.add('active');
                    this.createSmoke(section);
                }
            } else {
                section.classList.remove('active');
            }
        });

        this.updateProgress();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.init());
    }

    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollExperience();
}); 