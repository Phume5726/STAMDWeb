// Try submitting a form with missing required fields
document.querySelector('form').submit();

// Try an invalid email
document.querySelector('input[type="email"]').value = 'invalid-email';

// Simulate offline
window.dispatchEvent(new Event('offline'));

// Simulate a failed fetch
fetch('/non-existent-url');

// Trigger an error
throw new Error('Test error');

// Trigger an unhandled promise rejection
Promise.reject('Test rejection');

