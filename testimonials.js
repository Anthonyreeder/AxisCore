class TestimonialsCarousel {
    constructor() {
        this.container = document.querySelector('.testimonials-scroll');
        this.track = document.querySelector('.testimonials-track');
        this.cards = Array.from(document.querySelectorAll('.testimonial-card'));
        this.prevButton = document.querySelector('.carousel-arrow.prev');
        this.nextButton = document.querySelector('.carousel-arrow.next');
        
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.autoScrollSpeed = 1; // Increased speed
        this.isHovered = false;
        
        this.init();
    }

    init() {
        // Manual controls
        this.prevButton.addEventListener('click', () => this.scrollToPrev());
        this.nextButton.addEventListener('click', () => this.scrollToNext());

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
                const maxScroll = -((this.cards.length - 1) * (this.cards[0].offsetWidth + 32));
                this.currentTranslate -= this.autoScrollSpeed;
                
                // Reset to start when reaching the end
                if (this.currentTranslate <= maxScroll) {
                    this.currentTranslate = 0;
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
        const cardWidth = this.cards[0].offsetWidth + 32;
        const maxScroll = -(cardWidth * (this.cards.length - 1));
        if(this.currentTranslate > maxScroll) {
            this.scrollToPosition(this.currentTranslate - cardWidth);
        } else {
            this.scrollToPosition(0);
        }
    }

    scrollToPrev() {
        const cardWidth = this.cards[0].offsetWidth + 32;
        if(this.currentTranslate < 0) {
            this.scrollToPosition(this.currentTranslate + cardWidth);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
}); 