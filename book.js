class StoryBook {
    constructor() {
        this.pages = document.querySelectorAll('.page');
        this.currentPage = 0;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.updatePages();
    }

    handleScroll() {
        if(this.isAnimating) return;

        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        
        this.pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            const pageMiddle = rect.top + rect.height / 2;
            
            if(pageMiddle < windowHeight * 0.6 && pageMiddle > windowHeight * 0.4) {
                this.currentPage = index;
                this.updatePages();
            }
        });
    }

    updatePages() {
        this.pages.forEach((page, index) => {
            page.classList.remove('active', 'inactive-top', 'inactive-bottom');
            
            if(index === this.currentPage) {
                page.classList.add('active');
            } else if(index < this.currentPage) {
                page.classList.add('inactive-top');
            } else {
                page.classList.add('inactive-bottom');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StoryBook();
}); 