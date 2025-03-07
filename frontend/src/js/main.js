document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('review-form');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const toStep2Btn = document.getElementById('to-step2');
    const backToStep1Btn = document.getElementById('back-to-step1');
    const toStep3Btn = document.getElementById('to-step3');
    const backToStep2Btn = document.getElementById('back-to-step2');
    const submitBtn = document.getElementById('submit-form');
    const progressBar = document.getElementById('form-progress');
    const stepIndicators = document.querySelectorAll('.step');
    const termsLink = document.getElementById('terms-link');
    const termsModal = document.getElementById('terms-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Form fields
    const productSelect = document.getElementById('product');
    const platformSelect = document.getElementById('platform');
    const orderNumberInput = document.getElementById('orderNumber');
    const satisfactionSelect = document.getElementById('satisfaction');
    const promotionSelect = document.getElementById('promotion');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const newsletterCheckbox = document.getElementById('newsletter');
    
    // Error messages
    const orderNumberError = document.getElementById('orderNumber-error');
    const emailError = document.getElementById('email-error');
    
    // Confirmation elements
    const selectedPromotionSpan = document.getElementById('selected-promotion');
    const reviewLink = document.getElementById('review-link');
    const submissionSummary = document.getElementById('submission-summary');
    
    // Sample data (in a real app, this would come from an API)
    const products = [
        { id: 1, name: 'Premium Wireless Earbuds', amazonAsin: 'B08QDTW1MP', walmartId: '123456789' },
        { id: 2, name: 'Smart Water Bottle', amazonAsin: 'B09CGHZQKJ', walmartId: '987654321' },
        { id: 3, name: 'Fitness Tracker Watch', amazonAsin: 'B07XLMVLK5', walmartId: '456789123' }
    ];
    
    const promotions = [
        { id: 1, name: 'Free Product Sample' },
        { id: 2, name: '20% Discount on Next Purchase' },
        { id: 3, name: 'Extended Warranty' }
    ];
    
    // Load sample data
    function loadSampleData() {
        // Load products
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            option.dataset.amazonAsin = product.amazonAsin;
            option.dataset.walmartId = product.walmartId;
            productSelect.appendChild(option);
        });
        
        // Load promotions
        promotions.forEach(promotion => {
            const option = document.createElement('option');
            option.value = promotion.id;
            option.textContent = promotion.name;
            promotionSelect.appendChild(option);
        });
    }
    
    // Initialize
    loadSampleData();
    
    // Form navigation
    toStep2Btn.addEventListener('click', function() {
        if (validateStep1()) {
            step1.classList.remove('active');
            step2.classList.add('active');
            stepIndicators[0].classList.add('completed');
            stepIndicators[1].classList.add('active');
            progressBar.style.width = '66.66%';
        }
    });
    
    backToStep1Btn.addEventListener('click', function() {
        step2.classList.remove('active');
        step1.classList.add('active');
        stepIndicators[1].classList.remove('active');
        progressBar.style.width = '33.33%';
    });
    
    toStep3Btn.addEventListener('click', function() {
        if (validateStep2()) {
            step2.classList.remove('active');
            step3.classList.add('active');
            stepIndicators[1].classList.add('completed');
            stepIndicators[2].classList.add('active');
            progressBar.style.width = '100%';
            
            // Update confirmation page
            updateConfirmation();
        }
    });
    
    backToStep2Btn.addEventListener('click', function() {
        step3.classList.remove('active');
        step2.classList.add('active');
        stepIndicators[2].classList.remove('active');
        progressBar.style.width = '66.66%';
    });
    
    // Form validation
    function validateStep1() {
        let isValid = true;
        
        console.log('Validating Step 1...');
        
        // Check required fields
        if (!productSelect.value) {
            isValid = false;
            productSelect.classList.add('error');
            console.log('Product not selected');
        } else {
            productSelect.classList.remove('error');
            console.log('Product selected:', productSelect.value);
        }
        
        if (!platformSelect.value) {
            isValid = false;
            platformSelect.classList.add('error');
            console.log('Platform not selected');
        } else {
            platformSelect.classList.remove('error');
            console.log('Platform selected:', platformSelect.value);
        }
        
        if (!orderNumberInput.value) {
            isValid = false;
            orderNumberInput.classList.add('error');
            orderNumberError.textContent = 'Order number is required';
            console.log('Order number is empty');
        } else {
            // Validate order number format based on platform
            const platform = platformSelect.value;
            let isValidFormat = true;
            
            if (platform === 'amazon') {
                // Amazon format: 123-1234567-1234567
                isValidFormat = /^\d{3}-\d{7}-\d{7}$/.test(orderNumberInput.value);
            } else if (platform === 'walmart') {
                // Walmart format: 15-digit number
                isValidFormat = /^\d{15}$/.test(orderNumberInput.value);
            } else if (platform === 'ebay') {
                // eBay format: 11-digit number with hyphens
                isValidFormat = /^\d{2}-\d{5}-\d{5}$/.test(orderNumberInput.value);
            }
            
            if (!isValidFormat) {
                orderNumberError.textContent = 'Order number format does not match the expected pattern for the selected platform. You can still proceed.';
                console.log('Order number format is invalid, but proceeding');
                // We don't set isValid to false here because the requirement is to warn but not block
            } else {
                orderNumberError.textContent = '';
                console.log('Order number format is valid');
            }
            
            orderNumberInput.classList.remove('error');
            console.log('Order number provided:', orderNumberInput.value);
        }
        
        if (!satisfactionSelect.value) {
            isValid = false;
            satisfactionSelect.classList.add('error');
            console.log('Satisfaction not selected');
        } else {
            satisfactionSelect.classList.remove('error');
            console.log('Satisfaction selected:', satisfactionSelect.value);
        }
        
        console.log('Step 1 validation result:', isValid);
        return isValid;
    }
    
    function validateStep2() {
        let isValid = true;
        
        // Check required fields
        if (!promotionSelect.value) {
            isValid = false;
            promotionSelect.classList.add('error');
        } else {
            promotionSelect.classList.remove('error');
        }
        
        if (!nameInput.value) {
            isValid = false;
            nameInput.classList.add('error');
        } else {
            nameInput.classList.remove('error');
        }
        
        if (!emailInput.value) {
            isValid = false;
            emailInput.classList.add('error');
            emailError.textContent = 'Email is required';
        } else if (!isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            emailError.textContent = 'Please enter a valid email address';
        } else {
            emailInput.classList.remove('error');
            emailError.textContent = '';
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Update confirmation page
    function updateConfirmation() {
        // Set selected promotion
        const selectedPromotion = promotionSelect.options[promotionSelect.selectedIndex].text;
        selectedPromotionSpan.textContent = selectedPromotion;
        
        // Set review link based on platform and product
        const platform = platformSelect.value;
        const selectedProductOption = productSelect.options[productSelect.selectedIndex];
        
        if (platform === 'amazon') {
            const asin = selectedProductOption.dataset.amazonAsin;
            reviewLink.href = `https://www.amazon.com/review/review-your-purchases/?asin=${asin}`;
        } else if (platform === 'walmart') {
            const productId = selectedProductOption.dataset.walmartId;
            reviewLink.href = `https://www.walmart.com/reviews/write-review?productId=${productId}`;
        } else if (platform === 'ebay') {
            // For eBay, we'll just use a placeholder link since the actual format wasn't specified
            reviewLink.href = 'https://www.ebay.com/mye/myebay/purchase';
            reviewLink.textContent = 'Go to eBay Purchases';
        }
        
        // Build submission summary
        const productName = selectedProductOption.text;
        const platformName = platformSelect.options[platformSelect.selectedIndex].text;
        const satisfaction = satisfactionSelect.options[satisfactionSelect.selectedIndex].text;
        
        submissionSummary.innerHTML = `
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Platform:</strong> ${platformName}</p>
            <p><strong>Order Number:</strong> ${orderNumberInput.value}</p>
            <p><strong>Satisfaction:</strong> ${satisfaction}</p>
            <p><strong>Promotion:</strong> ${selectedPromotion}</p>
            <p><strong>Name:</strong> ${nameInput.value}</p>
            <p><strong>Email:</strong> ${emailInput.value}</p>
            <p><strong>Newsletter:</strong> ${newsletterCheckbox.checked ? 'Yes' : 'No'}</p>
        `;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Create form data object
        const formData = {
            id: Date.now(), // Use timestamp as a unique ID
            date: new Date().toISOString(),
            product: {
                id: productSelect.value,
                name: productSelect.options[productSelect.selectedIndex].text
            },
            platform: platformSelect.value,
            orderNumber: orderNumberInput.value,
            satisfaction: satisfactionSelect.value,
            promotion: {
                id: promotionSelect.value,
                name: promotionSelect.options[promotionSelect.selectedIndex].text
            },
            name: nameInput.value,
            email: emailInput.value,
            newsletter: newsletterCheckbox.checked
        };
        
        console.log('Form submitted:', formData);
        
        // Save to localStorage
        saveSubmissionToLocalStorage(formData);
        
        // Simulate successful submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitted!';
        
        // Show a success message
        alert('Your submission has been saved successfully! In a real application, you would receive a confirmation email.');
    });
    
    /**
     * Save submission to localStorage
     * @param {Object} submission - The submission data to save
     */
    function saveSubmissionToLocalStorage(submission) {
        // Get existing submissions from localStorage
        let submissions = JSON.parse(localStorage.getItem('reviewAppSubmissions') || '[]');
        
        // Add new submission
        submissions.push(submission);
        
        // Save back to localStorage
        localStorage.setItem('reviewAppSubmissions', JSON.stringify(submissions));
        
        console.log('Submission saved to localStorage. Total submissions:', submissions.length);
    }
    
    /**
     * Get all submissions from localStorage
     * @returns {Array} - Array of submissions
     */
    function getSubmissionsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('reviewAppSubmissions') || '[]');
    }
    
    // Add a function to view submissions (for demo purposes)
    window.viewSubmissions = function() {
        const submissions = getSubmissionsFromLocalStorage();
        console.table(submissions);
        alert(`You have ${submissions.length} submissions saved locally. Check the browser console to view them (press F12 and go to Console tab).`);
    };
    
    // Platform change handler to update order number validation message
    platformSelect.addEventListener('change', function() {
        // Clear any existing error message
        orderNumberError.textContent = '';
        
        // If there's a value in the order number field, validate it for the new platform
        if (orderNumberInput.value) {
            const platform = platformSelect.value;
            let isValidFormat = true;
            let formatExample = '';
            
            if (platform === 'amazon') {
                isValidFormat = /^\d{3}-\d{7}-\d{7}$/.test(orderNumberInput.value);
                formatExample = '123-1234567-1234567';
            } else if (platform === 'walmart') {
                isValidFormat = /^\d{15}$/.test(orderNumberInput.value);
                formatExample = '123456789012345';
            } else if (platform === 'ebay') {
                isValidFormat = /^\d{2}-\d{5}-\d{5}$/.test(orderNumberInput.value);
                formatExample = '12-34567-89012';
            }
            
            if (!isValidFormat) {
                orderNumberError.textContent = `Order number format does not match the expected pattern for ${platform.charAt(0).toUpperCase() + platform.slice(1)} (e.g., ${formatExample}). You can still proceed.`;
            }
        }
    });
    
    // Terms of Service modal
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', function() {
        termsModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            termsModal.style.display = 'none';
        }
    });
});
