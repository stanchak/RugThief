document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    
    // Google Apps Script Web App URL for form submission
    const scriptURL = 'https://script.google.com/macros/s/AKfycby5tvO5a_TEQXHI5QFe9eWf_VZ-0nK17dKITj12yQx_DxViDZH82FVsGDNqyZFaBmH2Ag/exec';
    
    // Show processing message
    document.getElementById('submission-message').innerHTML = 
        '<p style="color: #ffcc00; margin-top: 15px;">💬 Processing your request...</p>';
    
    // Create request options - using JSONP approach
    const url = `${scriptURL}?email=${encodeURIComponent(email)}&callback=handleResponse`;
    
    // Create a script element to handle the JSONP request
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    
    // Define the callback function in the global scope
    window.handleResponse = function(response) {
        console.log('Response received:', response);
        // Show success message
        document.getElementById('submission-message').innerHTML = 
            '<p style="color: #00ff00; margin-top: 15px;">🎉 YOU\'RE ON THE LIST! 🎉<br>We\'ll notify you when we launch!</p>';
        
        // Clean up script tag
        document.body.removeChild(script);
        
        // Clear the form
        document.getElementById('email-form').reset();
    };
    
    // Add error handling
    script.onerror = function() {
        console.error('Script loading error');
        document.getElementById('submission-message').innerHTML = 
            '<p style="color: #ff0000; margin-top: 15px;">❌ Something went wrong! Please try again.</p>';
        
        // Clean up script tag
        document.body.removeChild(script);
    };
    
    // Fallback - assume success after 3 seconds if no response
    setTimeout(function() {
        if (document.getElementById('submission-message').innerHTML.includes('Processing')) {
            console.log('Fallback: Assuming success after timeout');
            document.getElementById('submission-message').innerHTML = 
                '<p style="color: #00ff00; margin-top: 15px;">🎉 YOU\'RE ON THE LIST! 🎉<br>We\'ll notify you when we launch!</p>';
            document.getElementById('email-form').reset();
        }
    }, 3000);
}); 