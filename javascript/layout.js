class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.statusDiv = document.getElementById('formStatus');
        this.initializeForm();
    }

    initializeForm() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addInputValidation();
    }

    addInputValidation() {
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (!errorDiv) {
            const div = document.createElement('div');
            div.className = 'field-error';
            field.parentElement.appendChild(div);
        }

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
            case 'message':
                isValid = field.value.length >= 10;
                errorMessage = 'Message must be at least 10 characters long';
                break;
        }

        field.parentElement.querySelector('.field-error').textContent = 
            !isValid && field.value ? errorMessage : '';
        return isValid;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(this.form);
        const isValid = Array.from(this.form.elements).every(field => 
            field.type === 'submit' || this.validateField(field));

        if (!isValid) {
            this.showStatus('Please correct the errors in the form', 'error');
            return;
        }

        try {
            // Simulate API call
            await this.simulateFormSubmission(formData);
            this.showStatus('Thank you for your message! We will get back to you soon.', 'success');
            this.form.reset();
        } catch (error) {
            this.showStatus('There was an error sending your message. Please try again.', 'error');
        }
    }

    showStatus(message, type) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `form-status ${type}`;
        this.statusDiv.style.display = 'block';
        
        setTimeout(() => {
            this.statusDiv.style.opacity = '0';
            setTimeout(() => {
                this.statusDiv.style.display = 'none';
                this.statusDiv.style.opacity = '1';
            }, 300);
        }, 4000);
    }

    simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            }, 1000);
        });
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});