document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Add smooth transitions to form elements
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        element.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            validateField(this);
        });

        element.addEventListener('input', function() {
            validateField(this);
        });
    });

    function validateField(field) {
        const errorDiv = field.parentElement.querySelector('.field-error') || 
                        createErrorDiv(field.parentElement);
        
        let isValid = true;
        let errorMessage = '';

        switch(field.id) {
            case 'name':
                isValid = field.value.length >= 2;
                errorMessage = 'Name must be at least 2 characters long';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'phone':
                if (field.value) {
                    isValid = /^[0-9]{10}$/.test(field.value);
                    errorMessage = 'Phone number must be 10 digits';
                }
                break;
            case 'subject':
                isValid = field.value !== '';
                errorMessage = 'Please select a subject';
                break;
            case 'message':
                isValid = field.value.length >= 10;
                errorMessage = 'Message must be at least 10 characters long';
                break;
        }

        if (!isValid && field.value) {
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
            field.parentElement.classList.add('has-error');
        } else {
            errorDiv.style.display = 'none';
            field.parentElement.classList.remove('has-error');
        }

        return isValid;
    }

    function createErrorDiv(parent) {
        const div = document.createElement('div');
        div.className = 'field-error';
        parent.appendChild(div);
        return div;
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = type;
        formStatus.style.display = 'block';

        setTimeout(() => {
            formStatus.style.opacity = '0';
            setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.style.opacity = '1';
            }, 300);
        }, 3000);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const fields = ['name', 'email', 'subject', 'message'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Simulate form submission
            showStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            showStatus('Please check the form for errors.', 'error');
        }
    });
});
