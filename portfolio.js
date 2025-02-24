class PortfolioField {
    constructor() {
        this.canvas = document.getElementById('portfolio-field');
        this.ctx = this.canvas.getContext('2d');
        this.projects = [
            {
                id: 'project1',
                position: { x: 0.3, y: 0.4 }, // Relative positions (0-1)
                title: 'Lead Distribution System',
                description: 'AI-powered lead routing system that increased conversion rates by 45%',
                details: {
                    tech: ['Apex', 'Lightning Web Components', 'Einstein Analytics'],
                    duration: '3 months',
                    impact: 'Reduced lead response time by 80%'
                }
            },
            // Add more projects
        ];
        
        this.nodes = [];
        this.activeNode = null;
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createNodes();
        this.addEventListeners();
        this.animate();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createNodes() {
        this.projects.forEach(project => {
            this.nodes.push({
                x: project.position.x * this.canvas.width,
                y: project.position.y * this.canvas.height,
                radius: 5,
                project: project,
                connections: []
            });
        });

        // Create some additional nodes for visual effect
        for(let i = 0; i < 20; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 2,
                connections: []
            });
        }
    }

    drawNode(node) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = node.project ? 
            'rgba(0, 255, 242, 0.8)' : 
            'rgba(0, 255, 242, 0.3)';
        this.ctx.fill();

        if(node === this.activeNode) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius + 10, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(0, 255, 242, 0.2)';
            this.ctx.stroke();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.nodes.forEach(node => {
            this.nodes.forEach(otherNode => {
                if(node !== otherNode) {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if(distance < 150) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(node.x, node.y);
                        this.ctx.lineTo(otherNode.x, otherNode.y);
                        this.ctx.strokeStyle = `rgba(0, 255, 242, ${0.1 * (1 - distance/150)})`;
                        this.ctx.stroke();
                    }
                }
            });
        });

        // Draw nodes
        this.nodes.forEach(node => this.drawNode(node));

        requestAnimationFrame(() => this.animate());
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let hoveredNode = null;
        this.nodes.forEach(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < 30 && node.project) {
                hoveredNode = node;
            }
        });

        if(hoveredNode !== this.activeNode) {
            this.activeNode = hoveredNode;
            this.updateProjectDetails();
        }
    }

    updateProjectDetails() {
        const details = document.querySelector('.project-details');
        const navItems = document.querySelectorAll('.portfolio-item');

        if(this.activeNode && this.activeNode.project) {
            details.innerHTML = `
                <h3>${this.activeNode.project.title}</h3>
                <p>${this.activeNode.project.description}</p>
                <div class="project-stats">
                    <div>Technologies: ${this.activeNode.project.details.tech.join(', ')}</div>
                    <div>Duration: ${this.activeNode.project.details.duration}</div>
                    <div>Impact: ${this.activeNode.project.details.impact}</div>
                </div>
            `;
            details.classList.add('visible');

            // Update sidebar
            navItems.forEach(item => {
                if(item.dataset.project === this.activeNode.project.id) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        } else {
            details.classList.remove('visible');
            navItems.forEach(item => item.classList.remove('active'));
        }
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createNodes();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioField();
}); 