class PortfolioField {
    constructor() {
        this.canvas = document.getElementById('portfolio-field');
        this.ctx = this.canvas.getContext('2d');
        this.discoveredProjects = new Set();
        this.currentDiscoverable = 'project1';
        this.chimeSound = new Audio('node-discover.mp3'); // Updated sound file name
        
        this.projects = [
            {
                id: 'project1',
                position: { x: 0.25, y: 0.3 },
                title: 'Intelligent Lead Distribution',
                description: 'An AI-powered system that revolutionized lead distribution for a major insurance provider, resulting in a 45% increase in conversion rates. The system analyzes agent performance, expertise, and current workload to make intelligent routing decisions.',
                details: {
                    challenge: 'Manual lead distribution was causing delays and mismatches between lead types and agent expertise.',
                    solution: 'Developed an intelligent routing system using Salesforce Einstein and custom algorithms.',
                    impact: 'Reduced response time by 80% and improved customer satisfaction scores by 35%',
                    tech: ['Salesforce Einstein', 'Custom Lightning Components', 'Advanced Apex Logic']
                }
            },
            {
                id: 'project2',
                position: { x: 0.75, y: 0.3 },
                title: 'Predictive Analytics Suite',
                description: 'A comprehensive analytics platform that transformed financial forecasting for a leading investment firm. The system processes millions of data points to predict market trends and automate reporting.',
                details: {
                    challenge: 'Complex data analysis was taking weeks to process and interpret.',
                    solution: 'Built a real-time analytics suite with predictive modeling capabilities.',
                    impact: 'Reduced analysis time from weeks to minutes, with 92% prediction accuracy',
                    tech: ['Einstein Analytics', 'Custom Dashboards', 'Automated Reporting']
                }
            },
            {
                id: 'project3',
                position: { x: 0.5, y: 0.7 },
                title: 'Multi-System Integration Hub',
                description: 'A centralized integration hub that seamlessly connects multiple enterprise systems, creating a unified data ecosystem that eliminated data silos and manual processes.',
                details: {
                    challenge: 'Disconnected systems were causing data inconsistencies and manual work.',
                    solution: 'Developed a central hub with bi-directional syncing and validation.',
                    impact: 'Eliminated 40+ hours of weekly manual work and reduced errors by 95%',
                    tech: ['MuleSoft', 'Custom APIs', 'Real-time Sync Engine']
                }
            }
        ];
        
        this.nodes = [];
        this.activeNode = null;
        this.trails = [];
        this.maxTrails = 50;
        this.pulsingConnections = [];
        this.init();

        // Initialize all projects as undiscovered
        this.initializeSidebar();
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
        const baseRadius = node.project ? 8 : 3;
        const isDiscoverable = node.project && node.project.id === this.currentDiscoverable;
        const isDiscovered = node.project && this.discoveredProjects.has(node.project.id);
        
        // Glow effect for discoverable node
        if(isDiscoverable) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, baseRadius + 8, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 242, ${0.2 + Math.sin(Date.now() / 500) * 0.1})`;
            this.ctx.fill();
        }

        // Main node
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, baseRadius, 0, Math.PI * 2);
        
        if(isDiscovered) {
            this.ctx.fillStyle = 'rgba(0, 255, 242, 0.8)';
        } else if(isDiscoverable) {
            this.ctx.fillStyle = 'rgba(0, 255, 242, 0.6)';
        } else if(node.project) {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        } else {
            this.ctx.fillStyle = 'rgba(0, 255, 242, 0.3)';
        }
        
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

        // Check for hovering over any discovered or discoverable node
        let hoveredNode = null;
        this.nodes.forEach(node => {
            if(node.project) {
                const dx = x - node.x;
                const dy = y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < 30) {
                    if(node.project.id === this.currentDiscoverable || 
                       this.discoveredProjects.has(node.project.id)) {
                        hoveredNode = node;
                    }
                }
            }
        });

        this.activeNode = hoveredNode;
        
        // Show/hide project details based on hover
        const details = document.querySelector('.project-details');
        if(hoveredNode && this.discoveredProjects.has(hoveredNode.project.id)) {
            this.updateProjectDetails(hoveredNode.project);
        } else {
            details.classList.remove('visible');
        }
    }

    updateProjectDetails(project) {
        // Only show details if project is discovered
        if(!project || !this.discoveredProjects.has(project.id)) {
            return;
        }

        const details = document.querySelector('.project-details');
        details.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-stats">
                <div>Technologies: ${project.details.tech.join(', ')}</div>
                <div>Duration: ${project.details.duration}</div>
                <div>Impact: ${project.details.impact}</div>
            </div>
        `;
        details.classList.add('visible');
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.nodes.forEach(node => {
            if(node.project && node.project.id === this.currentDiscoverable) {
                const dx = x - node.x;
                const dy = y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < 30) {
                    this.discoverProject(node.project);
                }
            }
        });
    }

    discoverProject(project) {
        this.chimeSound.play();
        this.discoveredProjects.add(project.id);
        
        // Determine next discoverable project
        const projectIds = this.projects.map(p => p.id);
        const currentIndex = projectIds.indexOf(project.id);
        this.currentDiscoverable = projectIds[currentIndex + 1];

        // Update UI
        this.updateProjectDetails(project);
        this.updateSidebar();
        
        // Add discovery animation
        this.addDiscoveryEffect(project);
    }

    updateSidebar() {
        const items = document.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            const projectId = item.dataset.project;
            const isDiscovered = this.discoveredProjects.has(projectId);
            const isNext = projectId === this.currentDiscoverable;
            
            if(isDiscovered) {
                item.classList.add('discovered');
                item.querySelector('h3').textContent = this.projects.find(p => p.id === projectId).title;
                item.querySelector('.preview-text').style.display = 'block';
            } else {
                item.classList.toggle('next', isNext);
                item.querySelector('h3').textContent = '???? ????';
                item.querySelector('.preview-text').style.display = 'none';
            }
        });
    }

    addDiscoveryEffect(project) {
        const ripple = {
            x: this.nodes.find(n => n.project?.id === project.id).x,
            y: this.nodes.find(n => n.project?.id === project.id).y,
            radius: 0,
            opacity: 1
        };

        const animate = () => {
            ripple.radius += 3;
            ripple.opacity -= 0.02;

            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0, 255, 242, ${ripple.opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if(ripple.opacity > 0) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    initializeSidebar() {
        const items = document.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            item.querySelector('h3').textContent = '???? ????';
            item.querySelector('.preview-text').style.display = 'none';
            if(item.dataset.project === 'project1') {
                item.classList.add('next');
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