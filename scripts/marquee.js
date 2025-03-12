// Initialize the marquee
const initMarquee = () => {
    const container = document.querySelector('.marquee-container');
    if (!container) return;
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '50px'; // Adjust this value as needed
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.backgroundColor = 'transparent';
    
    // Set the source
    iframe.src = 'scripts/marquee.html';
    
    // Clear container and add iframe
    container.innerHTML = '';
    container.appendChild(iframe);
};

// Initialize on load
window.addEventListener('load', initMarquee); 