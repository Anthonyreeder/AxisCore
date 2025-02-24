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
            {
                id: 'project2',
                position: { x: 0.7, y: 0.3 },
                title: 'Einstein Analytics Suite',
                description: 'Custom dashboard implementation for financial services with real-time metrics',
                details: {
                    tech: ['Einstein Analytics', 'Apex', 'Custom Dashboards'],
                    duration: '4 months',
                    impact: 'Improved decision-making time by 60%'
                }
            },
            {
                id: 'project3',
                position: { x: 0.5, y: 0.6 },
                title: 'Multi-Platform Integration',
                description: 'Seamless integration between Salesforce, Xero, and HubSpot for unified data flow',
                details: {
                    tech: ['Integration APIs', 'Middleware', 'Custom Sync Logic'],
                    duration: '3 months',
                    impact: 'Eliminated 20 hours of manual work weekly'
                }
            }
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

        // Add velocity to nodes
        this.nodes.forEach(node => {
            node.vx = (Math.random() - 0.5) * 0.5;
            node.vy = (Math.random() - 0.5) * 0.5;
        });
    }

    drawNode(node) {
        // Increase node size
        const baseRadius = node.project ? 8 : 3;
        
        // Glow effect
        if(node.project) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, baseRadius + 5, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 255, 242, 0.1)';
            this.ctx.fill();
        }

        // Main node
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, baseRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = node.project ? 
            'rgba(0, 255, 242, 0.8)' : 
            'rgba(0, 255, 242, 0.3)';
        this.ctx.fill();

        // Highlight active node
        if(node === this.activeNode) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, baseRadius + 12, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(0, 255, 242, 0.2)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update positions
        this.nodes.forEach(node => {
            if (!node.project) { // Only move non-project nodes
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off edges
                if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            }
        });

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