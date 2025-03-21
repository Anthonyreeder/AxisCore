// Ocean Waves
particlesJS("particles-blue", {
    particles: {
        number: { value: 80 },
        color: { value: ["#ffffff", "#3498db", "#87CEEB"] },
        shape: { type: "circle" },
        opacity: {
            value: 0.6,
            random: true,
            anim: { enable: true, speed: 0.5, opacity_min: 0.1 }
        },
        size: { value: 3, random: true },
        move: {
            enable: true,
            speed: 2,
            direction: "left",
            out_mode: "out"
        }
    },
    interactivity: {
        events: {
            onhover: { enable: true, mode: "bubble" }
        }
    }
});

// Fire Storm
particlesJS("particles-fire", {
    particles: {
        number: { value: 100 },
        color: { value: ["#ff4422", "#ff7700", "#ff9900"] },
        shape: { type: "triangle" },
        opacity: { value: 0.8 },
        size: { 
            value: 5,
            random: true,
            anim: { enable: true, speed: 3, size_min: 1 }
        },
        move: {
            enable: true,
            speed: 6,
            direction: "top",
            random: true
        }
    }
});

// Matrix Rain
particlesJS("particles-matrix", {
    particles: {
        number: { value: 150 },
        color: { value: "#00ff00" },
        shape: { type: "char", character: ["1", "0"] },
        opacity: { value: 0.5 },
        size: { value: 4 },
        move: {
            enable: true,
            speed: 3,
            direction: "bottom",
            straight: true
        }
    },
    background: { color: "#000000" }
});

// Galaxy Spiral
particlesJS("particles-galaxy", {
    particles: {
        number: { value: 200 },
        color: { value: ["#ffffff", "#ff00ff", "#00ffff"] },
        shape: { type: "circle" },
        opacity: { value: 0.7 },
        size: { value: 2, random: true },
        move: {
            enable: true,
            speed: 2,
            attract: { enable: true, rotateX: 500, rotateY: 500 }
        }
    },
    background: { color: "#000033" }
});

// Screen Crack
particlesJS("particles-crack", {
    particles: {
        number: { value: 15 },
        color: { value: "#ffffff" },
        shape: { type: "polygon", polygon: { nb_sides: 3 } },
        opacity: { value: 0.8 },
        size: { value: 10 },
        move: {
            enable: true,
            speed: 8,
            direction: "none",
            out_mode: "bounce",
            bounce: true
        }
    },
    interactivity: {
        events: {
            onclick: {
                enable: true,
                mode: "repulse"
            }
        },
        modes: {
            repulse: { distance: 200, duration: 0.4 }
        }
    }
});

// Snow Fall
particlesJS("particles-snow", {
    particles: {
        number: { value: 100 },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.7 },
        size: { value: 3, random: true },
        move: {
            enable: true,
            speed: 2,
            direction: "bottom",
            random: true,
            straight: false,
            out_mode: "out"
        }
    },
    background: { color: "#203060" }
});

// Neon Pulse
particlesJS("particles-neon", {
    particles: {
        number: { value: 80 },
        color: { value: ["#ff00ff", "#00ffff", "#ff3377"] },
        shape: { type: "circle" },
        opacity: { 
            value: 0.8,
            anim: { enable: true, speed: 2, opacity_min: 0.1 }
        },
        size: { value: 4 },
        move: {
            enable: true,
            speed: 3,
            random: true
        }
    },
    background: { color: "#110022" }
});

// DNA Helix
particlesJS("particles-dna", {
    particles: {
        number: { value: 60 },
        color: { value: ["#ff0000", "#0000ff"] },
        shape: { type: "circle" },
        opacity: { value: 0.8 },
        size: { value: 3 },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            path: {
                enable: true,
                type: "sine",
                frequency: 0.5
            }
        }
    }
});

// Cyber Grid
particlesJS("particles-cyber", {
    particles: {
        number: { value: 100 },
        color: { value: "#00ff00" },
        shape: { type: "edge" },
        opacity: { value: 0.5 },
        size: { value: 2 },
        line_linked: {
            enable: true,
            color: "#00ff00",
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            straight: true
        }
    },
    background: { color: "#001100" }
});

// Atomic Orbit
particlesJS("particles-atomic", {
    particles: {
        number: { value: 8 },
        color: { value: "#ff9900" },
        shape: { type: "circle" },
        opacity: { value: 0.8 },
        size: { value: 8 },
        move: {
            enable: true,
            speed: 3,
            direction: "none",
            path: {
                enable: true,
                type: "circle",
                radius: 100
            }
        }
    },
    background: { color: "#000066" }
}); 