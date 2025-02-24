class TestimonialsCarousel {
    constructor() {
        this.container = document.querySelector('.testimonials-scroll');
        this.track = document.querySelector('.testimonials-track');
        this.cards = Array.from(document.querySelectorAll('.testimonial-card'));
        this.prevButton = document.querySelector('.carousel-arrow.prev');
        this.nextButton = document.querySelector('.carousel-arrow.next');
        
        if (!this.prevButton || !this.nextButton) {
            console.error('Navigation buttons not found');
            return;
        }

        // Clone cards for infinite loop
        this.cards.forEach(card => {
            const clone = card.cloneNode(true);
            this.track.appendChild(clone);
        });

        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.autoScrollSpeed = 1.5;
        this.isHovered = false;
        this.cardWidth = this.cards[0].offsetWidth + 32;
        
        this.init();
    }

    init() {
        // Manual controls with instant card-by-card scrolling
        this.prevButton.onclick = () => {
            this.isHovered = true; // Pause auto-scroll
            const newPosition = this.currentTranslate + this.cardWidth;
            if(newPosition <= 0) {
                this.currentTranslate = newPosition;
            } else {
                this.currentTranslate = 0;
            }
            this.prevTranslate = this.currentTranslate;
            this.setSliderPosition();
            setTimeout(() => this.isHovered = false, 1000); // Resume auto-scroll after 1s
        };
        
        this.nextButton.onclick = () => {
            this.isHovered = true; // Pause auto-scroll
            const maxScroll = -(this.cardWidth * (this.cards.length - 1));
            const newPosition = this.currentTranslate - this.cardWidth;
            if(newPosition >= maxScroll) {
                this.currentTranslate = newPosition;
            } else {
                this.currentTranslate = 0; // Loop back to start
            }
            this.prevTranslate = this.currentTranslate;
            this.setSliderPosition();
            setTimeout(() => this.isHovered = false, 1000); // Resume auto-scroll after 1s
        };

        // Mouse wheel scrolling
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = Math.sign(e.deltaX || e.deltaY) * 50;
            this.currentTranslate = Math.max(
                Math.min(this.currentTranslate - delta, 0),
                -((this.cards.length - 1) * (this.cards[0].offsetWidth + 32))
            );
            this.prevTranslate = this.currentTranslate;
            this.setSliderPosition();
        });

        // Hover detection
        this.container.addEventListener('mouseenter', () => this.isHovered = true);
        this.container.addEventListener('mouseleave', () => this.isHovered = false);

        // Touch events
        this.track.addEventListener('touchstart', this.touchStart.bind(this));
        this.track.addEventListener('touchmove', this.touchMove.bind(this));
        this.track.addEventListener('touchend', this.touchEnd.bind(this));

        // Mouse drag events
        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));

        // Start continuous scroll
        this.startContinuousScroll();
    }

    startContinuousScroll() {
        const animate = () => {
            if (!this.isDragging && !this.isHovered) {
                this.currentTranslate -= this.autoScrollSpeed;
                
                // Check if we need to reset position for infinite loop
                const totalWidth = this.cardWidth * this.cards.length;
                if (Math.abs(this.currentTranslate) >= totalWidth) {
                    this.currentTranslate += totalWidth;
                }
                
                this.prevTranslate = this.currentTranslate;
                this.setSliderPosition();
            }
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    touchStart(e) {
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.animationID = requestAnimationFrame(this.animation.bind(this));
        this.track.style.cursor = 'grabbing';
    }

    touchMove(e) {
        if(!this.isDragging) return;
        const currentPosition = this.getPositionX(e);
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
    }

    touchEnd() {
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        this.track.style.cursor = 'grab';
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        if(Math.abs(movedBy) > 100) {
            if(movedBy > 0) {
                this.scrollToPrev();
            } else {
                this.scrollToNext();
            }
        } else {
            this.snapToClosest();
        }
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    animation() {
        this.setSliderPosition();
        if(this.isDragging) requestAnimationFrame(this.animation.bind(this));
    }

    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    snapToClosest() {
        const cardWidth = this.cards[0].offsetWidth + 32;
        const closest = Math.round(this.currentTranslate / cardWidth) * cardWidth;
        this.scrollToPosition(closest);
    }

    scrollToPosition(position) {
        this.currentTranslate = position;
        this.prevTranslate = position;
        this.setSliderPosition();
    }

    scrollToNext() {
        const totalWidth = this.cardWidth * this.cards.length;
        this.currentTranslate -= this.cardWidth;
        
        if (Math.abs(this.currentTranslate) >= totalWidth) {
            this.currentTranslate += totalWidth;
        }
        
        this.prevTranslate = this.currentTranslate;
        this.setSliderPosition();
    }

    scrollToPrev() {
        this.currentTranslate += this.cardWidth;
        const totalWidth = this.cardWidth * this.cards.length;
        
        if (this.currentTranslate > 0) {
            this.currentTranslate -= totalWidth;
        }
        
        this.prevTranslate = this.currentTranslate;
        this.setSliderPosition();
    }
}

// Make sure the DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing carousel...');
    new TestimonialsCarousel();
}); 