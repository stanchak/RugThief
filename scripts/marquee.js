import { MARQUEE_TEXT } from './marquee-text.js';

class TextScroller {
    constructor(container, text, speed = 3.6) {
        this.container = container;
        this.text = text;
        this.speed = speed;
        this.position = 0;
        this.visibleChars = 0;
        this.totalWidth = 0;
        this.padding = 20; // Pixels of padding on each side
        this.init();
    }

    init() {
        // Create a measurement div that won't affect layout
        const measureDiv = document.createElement('div');
        measureDiv.style.cssText = `
            position: absolute;
            visibility: hidden;
            height: auto;
            width: auto;
            white-space: nowrap;
            font: ${getComputedStyle(this.container).font}
        `;
        document.body.appendChild(measureDiv);

        // Measure the full text width including emojis
        // This gives us the true width of the text with proper emoji rendering
        measureDiv.textContent = this.text;
        this.totalWidth = measureDiv.offsetWidth;
        this.fullTextLength = this.text.length;
        
        // Calculate average character width - but we'll use pixel-based positioning instead
        this.pixelsPerChar = this.totalWidth / Array.from(this.text).length;

        // Measure height with emoji to ensure consistent container height
        measureDiv.textContent = '🔥';
        const emojiHeight = measureDiv.offsetHeight;
        document.body.removeChild(measureDiv);

        // Calculate viewable area and prepare for smooth scrolling
        const containerWidth = this.container.offsetWidth;
        this.visibleWidth = containerWidth - (this.padding * 2);
        this.container.style.width = `${containerWidth}px`;
        
        // Calculate how many repetitions we need for smooth scrolling
        const repetitions = Math.ceil((containerWidth * 2) / this.totalWidth) + 1;
        this.repeatedText = this.text.repeat(repetitions);
        
        // Create fixed-width inner container for the text
        const innerContainer = document.createElement('div');
        innerContainer.style.cssText = `
            display: inline-block;
            white-space: pre;
            font-size: inherit;
            font-weight: inherit;
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
            padding-left: ${this.padding}px;
            height: ${emojiHeight}px;
            line-height: ${emojiHeight}px;
            width: ${this.totalWidth * repetitions}px;
        `;
        this.container.appendChild(innerContainer);
        this.textContainer = innerContainer;
        
        // Set the initial text content
        this.textContainer.textContent = this.repeatedText;
        
        // Add a small delay before starting the animation
        setTimeout(() => {
            this.startScrolling();
        }, 100);
    }

    update() {
        // Use pixel-based position for smoother animation
        // No need to change the text content - we scroll the entire repeated string
        const offset = (this.position % this.totalWidth);
        this.textContainer.style.transform = `translate3d(-${offset}px, 0, 0)`;
    }

    startScrolling() {
        let lastTime = performance.now();
        const animate = (currentTime) => {
            const deltaTime = Math.min(currentTime - lastTime, 16); // Cap at ~60fps for smoother animation
            lastTime = currentTime;
            
            // Update position with floating point for smoother movement
            this.position += (this.speed * deltaTime) / 1000;
            
            // Reset position when we've moved through one copy of the text
            if (this.position >= this.totalWidth) {
                // Wrap around seamlessly by resetting to the exact position mod totalWidth
                this.position = this.position % this.totalWidth;
            }
            
            this.update();
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

// Using the imported MARQUEE_TEXT from marquee-text.js

// Handle resize with debounce and smooth transition
let resizeTimeout;
let currentScroller;

// Initialize the scroller after the page loads
window.addEventListener('load', () => {
    const container = document.querySelector('.marquee-container');
    
    if (container) {
        // Clear existing content
        container.innerHTML = '';
        currentScroller = new TextScroller(container, MARQUEE_TEXT, 43.2); // 14.4 * 3 = 43.2 (3x the current speed)
    }
});

// Handle window resize events
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const container = document.querySelector('.marquee-container');
        if (container) {
            // Store the old position to maintain visual continuity
            const oldPosition = currentScroller ? currentScroller.position : 0;
            
            // Reinitialize scroller with same text
            container.innerHTML = '';
            const newScroller = new TextScroller(container, MARQUEE_TEXT, 43.2); // 3x the current speed
            
            // Try to maintain visual position if possible
            if (oldPosition && newScroller.totalWidth) {
                const positionRatio = oldPosition / currentScroller.totalWidth;
                newScroller.position = positionRatio * newScroller.totalWidth;
                newScroller.update();
            }
            
            currentScroller = newScroller;
        }
    }, 250);
}); 