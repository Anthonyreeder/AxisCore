particlesJS("particles-js", {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 1500
      }
    },
    color: {
      value: ["#ffffff", "#3498db"]  // Keeping it mostly white/blue for professional look
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.6,
      random: true,
      anim: {
        enable: true,
        speed: 0.8,
        opacity_min: 0.2,
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
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce",  // Makes particles bounce off edges
      bounce: true,
      attract: {
        enable: true,
        rotateX: 1200,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: ["grab", "bubble"]
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 200,
        line_linked: {
          opacity: 0.8
        }
      },
      bubble: {
        distance: 250,
        size: 6,
        duration: 2,
        opacity: 0.8,
        speed: 3
      },
      push: {
        particles_nb: 4
      }
    }
  },
  retina_detect: true
}); 