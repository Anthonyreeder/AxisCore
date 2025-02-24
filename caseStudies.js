class CaseStudyTransition {
    constructor() {
        this.currentView = 'main';
        this.transitioning = false;
        this.initTransitions();
    }

    async transitionToCase(caseId) {
        if(this.transitioning) return;
        this.transitioning = true;

        // Create star field effect
        await this.createStarfieldTransition();
        
        // Rotate and zoom effect (like Lylat Wars)
        await this.rotateView();
        
        // Load case study content
        this.loadCaseContent(caseId);
        
        this.transitioning = false;
    }

    // ... more transition methods
} 