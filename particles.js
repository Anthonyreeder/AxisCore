particlesJS("particles-js", {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: ["#ffffff", "#87CEEB", "#00BFFF", "#1E90FF"]  // Multiple colors
    },
    shape: {
      type: ["circle", "triangle"],  // Mix of shapes
      stroke: {
        width: 0,
        color: "#000000"
      }
    },
    opacity: {
      value: 0.6,
      random: true,
      anim: {
        enable: true,
        speed: 0.5,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: ["bubble", "repulse"]
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 250,
        size: 6,
        duration: 2,
        opacity: 0.8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      }
    }
  },
  retina_detect: true,
  // Add custom animation patterns
  animation: {
    enable: true,
    patterns: [
      {
        type: "flow",
        speed: 5,
        direction: "right"
      },
      {
        type: "vortex",
        speed: 3,
        center: { x: 0.2, y: 0.5 }
      }
    ]
  }
});

// Add custom animation effects
let time = 0;
function animateParticles() {
  time += 0.01;
  
  const particles = pJSDom[0].pJS.particles.array;
  particles.forEach((p, i) => {
    // Create flowing wave pattern
    p.y += Math.sin(time + i * 0.1) * 0.5;
    
    // Add subtle spiral effect
    const angle = time * 0.5;
    const radius = 100;
    p.x += Math.cos(angle + i * 0.1) * 0.2;
    
    // Change colors gradually
    if (i % 20 === 0) {
      const hue = (time * 10) % 360;
      p.color = `hsl(${hue}, 70%, 70%)`;
    }
  });
  
  requestAnimationFrame(animateParticles);
}

// Start custom animation
animateParticles(); 