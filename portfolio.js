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
        this.trails = [];
        this.maxTrails = 50;
        this.pulsingConnections = [];
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

    addTrail(x, y) {
        this.trails.push({
            x, y,
            life: 1,
            radius: 2
        });
        
        if (this.trails.length > this.maxTrails) {
            this.trails.shift();
        }
    }

    drawTrails() {
        this.trails.forEach((trail, i) => {
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, trail.radius * trail.life, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 242, ${0.2 * trail.life})`;
            this.ctx.fill();
            trail.life *= 0.95;
        });

        this.trails = this.trails.filter(trail => trail.life > 0.01);
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

        this.drawTrails();

        requestAnimationFrame(() => this.animate());
    }

    updateNodePositions(mouseX, mouseY) {
        this.nodes.forEach(node => {
            if (!node.project) {
                const dx = mouseX - node.x;
                const dy = mouseY - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    node.vx -= (dx / distance) * force * 0.5;
                    node.vy -= (dy / distance) * force * 0.5;
                }
                
                // Add some random movement
                node.vx += (Math.random() - 0.5) * 0.1;
                node.vy += (Math.random() - 0.5) * 0.1;
                
                // Apply friction
                node.vx *= 0.99;
                node.vy *= 0.99;
            }
        });
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.addTrail(x, y);
        this.updateNodePositions(x, y);

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

    handleClick(e) {
        if (this.activeNode && this.activeNode.project) {
            // Create ripple effect
            const ripple = {
                x: this.activeNode.x,
                y: this.activeNode.y,
                radius: 0,
                maxRadius: 100,
                opacity: 1
            };
            
            const animate = () => {
                ripple.radius += 2;
                ripple.opacity -= 0.02;
                
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(0, 255, 242, ${ripple.opacity})`;
                this.ctx.stroke();
                
                if (ripple.radius < ripple.maxRadius) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
            
            // Highlight connected nodes
            this.highlightConnections(this.activeNode);
        }
    }

    highlightConnections(node) {
        // Find all nodes within connection distance
        this.nodes.forEach(otherNode => {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                // Add pulsing connection
                const connection = {
                    start: node,
                    end: otherNode,
                    pulse: 0
                };
                
                this.pulsingConnections.push(connection);
            }
        });
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createNodes();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioField();
}); 