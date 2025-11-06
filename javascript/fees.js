// Fee Calculator Class
class FeeCalculator {
    constructor() {
        this.courseCheckboxes = document.querySelectorAll('input[name="course"]');
        this.paymentSelect = document.getElementById('paymentOption');
        this.selectedCoursesDiv = document.getElementById('selectedCourses');
        this.subtotalSpan = document.getElementById('subtotal');
        this.discountSpan = document.getElementById('discount');
        this.totalSpan = document.getElementById('total');
        // Enrollment form elements (optional if present in the page)
        this.enrollmentForm = document.getElementById('enrollmentForm');
        this.nameInput = document.getElementById('studentName');
        this.emailInput = document.getElementById('studentEmail');
        this.phoneInput = document.getElementById('studentPhone');
        this.formMessage = document.getElementById('formMessage');
        this.init();
    }

    init() {
        // Initialize event listeners
        this.courseCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.animateCheckbox(checkbox);
                this.updateFees();
            });
        });

        this.paymentSelect.addEventListener('change', () => {
            this.updateFees();
            this.animateTotal();
        });

        // Enrollment form submit handler (if form exists)
        if (this.enrollmentForm) {
            this.enrollmentForm.addEventListener('submit', this.handleSubmit.bind(this));
        }
        // Add hover effects to course options
        document.querySelectorAll('.course-options label').forEach(label => {
            label.addEventListener('mouseenter', () => this.animateHover(label));
            label.addEventListener('mouseleave', () => this.removeHover(label));
        });
    }

    animateCheckbox(checkbox) {
        const label = checkbox.parentElement;
        label.style.transition = 'all 0.3s ease';
        
        if (checkbox.checked) {
            label.style.backgroundColor = '#e3f2fd';
            label.style.transform = 'scale(1.02)';
            label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        } else {
            label.style.backgroundColor = '#f8f9fa';
            label.style.transform = 'scale(1)';
            label.style.boxShadow = 'none';
        }
    }

    animateHover(label) {
        label.style.transition = 'all 0.3s ease';
        label.style.backgroundColor = '#f0f0f0';
        label.style.transform = 'translateY(-2px)';
        label.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    }

    removeHover(label) {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) {
            label.style.backgroundColor = '#f8f9fa';
            label.style.transform = 'translateY(0)';
            label.style.boxShadow = 'none';
        }
    }

    animateTotal() {
        const totalSection = document.querySelector('.total-section');
        totalSection.style.animation = 'highlight 1s ease';
    }

    updateFees() {
        const selectedCourses = Array.from(this.courseCheckboxes).filter(cb => cb.checked);
        let subtotal = selectedCourses.reduce((sum, course) => sum + Number(course.value), 0);
        
        // Calculate discounts
        let discountPercent = this.calculateDiscount(selectedCourses.length);
        const discount = (subtotal * discountPercent / 100);
        const total = subtotal - discount;

        // Animate and update the display
        this.updateDisplay(selectedCourses, subtotal, discount, total);
        // Show or hide enrollment form based on selection
        this.toggleForm(selectedCourses.length > 0);
    }

    calculateDiscount(courseCount) {
        let discountPercent = 0;
        
        // Course quantity discount
        if (courseCount === 2) discountPercent = 5;
        else if (courseCount === 3) discountPercent = 10;
        else if (courseCount > 3) discountPercent = 15;

        // Upfront payment discount
        if (this.paymentSelect.value === 'upfront') {
            discountPercent += 10;
        }

        return discountPercent;
    }

    updateDisplay(selectedCourses, subtotal, discount, total) {
        // Update selected courses with animation
        if (selectedCourses.length > 0) {
            const coursesList = selectedCourses
                .map(course => `
                    <div class="selected-course" style="animation: slideIn 0.3s ease">
                        <span>${course.dataset.course}</span>
                        <span>R${course.value}</span>
                    </div>
                `)
                .join('');
            this.selectedCoursesDiv.innerHTML = coursesList;
        } else {
            this.selectedCoursesDiv.innerHTML = '<p>No courses selected</p>';
        }

        // Animate number changes
        this.animateNumber(this.subtotalSpan, subtotal);
        this.animateNumber(this.discountSpan, discount);
        this.animateNumber(this.totalSpan, total);
    }

    animateNumber(element, value) {
        const duration = 500; // Animation duration in milliseconds
        const start = parseFloat(element.textContent);
        const end = value;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = start + (end - start) * progress;
            element.textContent = current.toFixed(2);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };

        requestAnimationFrame(updateNumber);
    }

    toggleForm(show) {
        if (!this.enrollmentForm) return;
        this.enrollmentForm.style.display = show ? 'block' : 'none';
        if (!show && this.formMessage) this.formMessage.textContent = '';
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.enrollmentForm) return;

        const name = (this.nameInput && this.nameInput.value || '').trim();
        const email = (this.emailInput && this.emailInput.value || '').trim();
        const phone = (this.phoneInput && this.phoneInput.value || '').trim();

        // Simple validation
        if (!name) {
            this.showFormMessage('Please enter your full name', true);
            this.nameInput.focus();
            return;
        }

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRe.test(email)) {
            this.showFormMessage('Please enter a valid email address', true);
            this.emailInput.focus();
            return;
        }

        const phoneClean = phone.replace(/[^0-9+]/g, '');
        if (!phone || phoneClean.length < 7) {
            this.showFormMessage('Please enter a valid phone number', true);
            this.phoneInput.focus();
            return;
        }

        // Gather selected courses and totals for confirmation
        const selectedCourses = Array.from(this.courseCheckboxes).filter(cb => cb.checked).map(cb => cb.dataset.course);
        const subtotal = parseFloat(this.subtotalSpan.textContent) || 0;
        const discount = parseFloat(this.discountSpan.textContent) || 0;
        const total = parseFloat(this.totalSpan.textContent) || 0;

        // Simulate successful submission (could be sent to server)
        const confirmation = `Thank you ${name}!\nYou enrolled for: ${selectedCourses.join(', ')}. Total payable: R${total.toFixed(2)}. We will contact you at ${email} / ${phone}.`;
        console.log('Enrollment submitted:', { name, email, phone, selectedCourses, subtotal, discount, total });
        this.showFormMessage('Enrollment submitted — thank you! We will contact you shortly.', false);

        // Optionally clear the form
        this.enrollmentForm.reset();
        // Keep form visible for confirmation; could hide after a timeout
    }

    showFormMessage(message, isError) {
        if (!this.formMessage) return;
        this.formMessage.textContent = message;
        this.formMessage.style.color = isError ? '#b00020' : '#006400';
    }
}

// Add required CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes highlight {
        0% { background-color: #f8f9fa; }
        50% { background-color: #e3f2fd; }
        100% { background-color: #f8f9fa; }
    }

    .selected-course {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 1px solid #eee;
        margin-bottom: 8px;
    }

    .total-section {
        transition: all 0.3s ease;
    }

    .total-section p {
        transition: all 0.3s ease;
    }

    .grand-total {
        position: relative;
        overflow: hidden;
    }

    .grand-total::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #0078d4;
        transform: scaleX(0);
        transition: transform 0.3s ease;
        transform-origin: left;
    }

    .total-section:hover .grand-total::after {
        transform: scaleX(1);
    }
`;
document.head.appendChild(style);

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeeCalculator();
});
