class LightTrail {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.trails = [];
        this.text = 'AXISCORE';
        this.textPoints = [];
        this.phase = 'trails'; // trails, morph, or text
        this.frameCount = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.initTrails();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initTrails() {
        for(let i = 0; i < 5; i++) {
            this.trails.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                hue: Math.random() * 360,
                size: Math.random() * 3 + 2,
                history: []
            });
        }
    }

    generateTextPoints() {
        this.ctx.font = 'bold 150px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const metrics = this.ctx.measureText(this.text);
        const textWidth = metrics.width;
        const textHeight = 150;
        
        // Create temporary canvas for text
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = textWidth;
        tempCanvas.height = textHeight * 1.5;
        
        tempCtx.font = 'bold 150px Inter';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillStyle = 'white';
        tempCtx.fillText(this.text, tempCanvas.width/2, tempCanvas.height/2);
        
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imageData.data;
        
        this.textPoints = [];
        
        // Sample points from text
        for(let i = 0; i < pixels.length; i += 16) {
            const x = (i/4) % tempCanvas.width;
            const y = Math.floor((i/4) / tempCanvas.width);
            
            if(pixels[i + 3] > 128) {
                this.textPoints.push({
                    x: x + (this.canvas.width - textWidth)/2,
                    y: y + (this.canvas.height - textHeight)/2,
                    originalX: x + (this.canvas.width - textWidth)/2,
                    originalY: y + (this.canvas.height - textHeight)/2,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    drawTrails() {
        this.ctx.fillStyle = 'rgba(0, 0, 51, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.trails.forEach(trail => {
            trail.history.push({x: trail.x, y: trail.y});
            if(trail.history.length > 50) trail.history.shift();

            trail.x += trail.vx;
            trail.y += trail.vy;

            if(trail.x < 0 || trail.x > this.canvas.width) trail.vx *= -1;
            if(trail.y < 0 || trail.y > this.canvas.height) trail.vy *= -1;

            this.ctx.beginPath();
            this.ctx.moveTo(trail.history[0].x, trail.history[0].y);

            trail.history.forEach((point, i) => {
                const nextPoint = trail.history[i + 1] || {x: trail.x, y: trail.y};
                const xc = (point.x + nextPoint.x) / 2;
                const yc = (point.y + nextPoint.y) / 2;
                this.ctx.quadraticCurveTo(point.x, point.y, xc, yc);
            });

            const gradient = this.ctx.createLinearGradient(
                trail.history[0].x, trail.history[0].y,
                trail.x, trail.y
            );
            gradient.addColorStop(0, `hsla(${trail.hue}, 100%, 50%, 0)`);
            gradient.addColorStop(1, `hsla(${trail.hue}, 100%, 50%, 0.8)`);

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = trail.size;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            trail.hue = (trail.hue + 1) % 360;
        });
    }

    morphToText() {
        if(!this.textPoints.length) this.generateTextPoints();
        
        // Create explosive effect
        if(this.phase === 'trails') {
            this.trails.forEach(trail => {
                trail.vx *= 1.2;
                trail.vy *= 1.2;
            });
            
            if(this.frameCount > 60) {
                this.phase = 'morph';
                this.trails = [];
                
                // Initialize particles for each text point
                this.textPoints.forEach(point => {
                    point.x = Math.random() * this.canvas.width;
                    point.y = Math.random() * this.canvas.height;
                    point.vx = (point.originalX - point.x) / 50;
                    point.vy = (point.originalY - point.y) / 50;
                });
            }
        }
        
        if(this.phase === 'morph') {
            this.ctx.fillStyle = 'rgba(0, 0, 51, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            let allSettled = true;
            
            this.textPoints.forEach(point => {
                point.x += point.vx;
                point.y += point.vy;
                
                const dx = point.originalX - point.x;
                const dy = point.originalY - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance > 1) allSettled = false;
                
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = 'white';
                this.ctx.fill();
            });
            
            if(allSettled) this.phase = 'text';
        }
    }

    animate() {
        this.frameCount++;
        
        if(this.frameCount < 180) {
            this.drawTrails();
        } else {
            this.morphToText();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lightshow');
    new LightTrail(canvas);
}); 