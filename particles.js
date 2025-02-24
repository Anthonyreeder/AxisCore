particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 1500
      }
    },
    color: {
      value: ["#ffffff", "#3498db", "#e74c3c", "#2ecc71"]
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: true,
        speed: 3,
        size_min: 0.3,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#3498db",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "top",
      random: false,
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
        mode: "bubble"
      },
      onclick: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 200,
        size: 12,
        duration: 2,
        opacity: 0.8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  retina_detect: true
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