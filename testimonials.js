class TestimonialsCarousel {
    constructor() {
        this.container = document.querySelector('.testimonials-scroll');
        this.track = document.querySelector('.testimonials-track');
        this.cards = Array.from(document.querySelectorAll('.testimonial-card'));
        
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        
        this.init();
    }

    init() {
        // Add dots
        const dotsContainer = document.querySelector('.scroll-dots');
        this.cards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot' + (idx === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.scrollToCard(idx));
            dotsContainer.appendChild(dot);
        });

        // Touch events
        this.track.addEventListener('touchstart', this.touchStart.bind(this));
        this.track.addEventListener('touchmove', this.touchMove.bind(this));
        this.track.addEventListener('touchend', this.touchEnd.bind(this));

        // Mouse events
        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));

        // Prevent context menu
        window.oncontextmenu = e => {
            if(e.target.closest('.testimonials-track')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        // Auto scroll
        this.startAutoScroll();
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
        const cardWidth = this.cards[0].offsetWidth + 32; // Including gap
        const closest = Math.round(this.currentTranslate / cardWidth) * cardWidth;
        this.scrollToPosition(closest);
    }

    scrollToPosition(position) {
        this.currentTranslate = position;
        this.prevTranslate = position;
        this.setSliderPosition();
        this.updateDots();
        this.updateProgress();
    }

    updateDots() {
        const cardWidth = this.cards[0].offsetWidth + 32;
        const activeIndex = Math.abs(Math.round(this.currentTranslate / cardWidth));
        document.querySelectorAll('.scroll-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
        });
    }

    updateProgress() {
        const maxScroll = (this.cards.length - 1) * (this.cards[0].offsetWidth + 32);
        const progress = (Math.abs(this.currentTranslate) / maxScroll) * 100;
        document.querySelector('.scroll-progress').style.setProperty('--scroll-percent', `${progress}%`);
    }

    startAutoScroll() {
        setInterval(() => {
            if(!this.isDragging) this.scrollToNext();
        }, 5000);
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

    scrollToCard(index) {
        const cardWidth = this.cards[0].offsetWidth + 32;
        this.scrollToPosition(-cardWidth * index);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
}); 