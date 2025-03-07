document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showLoginModal();
    }
    
    // DOM Elements - Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const logoutBtn = document.getElementById('logout-btn');
    const viewAllSubmissionsBtn = document.getElementById('view-all-submissions');
    
    // DOM Elements - Products
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const cancelProductBtn = document.getElementById('cancel-product');
    const productSearch = document.getElementById('product-search');
    
    // DOM Elements - Promotions
    const addPromotionBtn = document.getElementById('add-promotion-btn');
    const promotionModal = document.getElementById('promotion-modal');
    const promotionForm = document.getElementById('promotion-form');
    const cancelPromotionBtn = document.getElementById('cancel-promotion');
    const promotionSearch = document.getElementById('promotion-search');
    
    // DOM Elements - Submissions
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const exportExcelBtn = document.getElementById('export-excel-btn');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    
    // DOM Elements - Settings
    const emailSettingsForm = document.getElementById('email-settings-form');
    const addUserBtn = document.getElementById('add-user-btn');
    
    // DOM Elements - Modals
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const viewSubmissionModal = document.getElementById('view-submission-modal');
    const closeSubmissionViewBtn = document.getElementById('close-submission-view');
    
    // Sample data (in a real app, this would come from an API)
    let products = [
        { id: 1, name: 'Premium Wireless Earbuds', amazonAsin: 'B08QDTW1MP', walmartId: '123456789' },
        { id: 2, name: 'Smart Water Bottle', amazonAsin: 'B09CGHZQKJ', walmartId: '987654321' },
        { id: 3, name: 'Fitness Tracker Watch', amazonAsin: 'B07XLMVLK5', walmartId: '456789123' }
    ];
    
    let promotions = [
        { id: 1, name: 'Free Product Sample', description: 'Receive a free sample of one of our new products' },
        { id: 2, name: '20% Discount on Next Purchase', description: 'Receive a 20% discount code for your next purchase' },
        { id: 3, name: 'Extended Warranty', description: 'Receive an additional 1-year warranty on your product' }
    ];
    
    let submissions = [
        {
            id: 1,
            date: '03/05/2025',
            name: 'John Smith',
            email: 'john.smith@example.com',
            product: 'Premium Wireless Earbuds',
            platform: 'Amazon',
            orderNumber: '123-4567890-1234567',
            satisfaction: 'Very Satisfied',
            promotion: 'Free Product Sample',
            newsletter: true
        },
        {
            id: 2,
            date: '03/04/2025',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            product: 'Smart Water Bottle',
            platform: 'Walmart',
            orderNumber: '123456789012345',
            satisfaction: 'Somewhat Satisfied',
            promotion: '20% Discount on Next Purchase',
            newsletter: false
        },
        {
            id: 3,
            date: '03/03/2025',
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            product: 'Fitness Tracker Watch',
            platform: 'eBay',
            orderNumber: '12-34567-89012',
            satisfaction: 'Very Satisfied',
            promotion: 'Extended Warranty',
            newsletter: true
        }
    ];
    
    // Current page for submissions pagination
    let currentPage = 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(submissions.length / itemsPerPage);
    
    // Update total pages display
    totalPagesSpan.textContent = totalPages;
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // View All Submissions button
    if (viewAllSubmissionsBtn) {
        viewAllSubmissionsBtn.addEventListener('click', function() {
            // Switch to submissions tab
            navItems.forEach(navItem => navItem.classList.remove('active'));
            document.querySelector('.nav-item[data-tab="submissions"]').classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById('submissions').classList.add('active');
        });
    }
    
    // Products
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            // Reset form
            productForm.reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-modal-title').textContent = 'Add Product';
            
            // Show modal
            productModal.style.display = 'block';
        });
    }
    
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('product-id').value;
            const productName = document.getElementById('product-name').value;
            const amazonAsin = document.getElementById('amazon-asin').value;
            const walmartId = document.getElementById('walmart-id').value;
            
            if (productId) {
                // Edit existing product
                const index = products.findIndex(p => p.id == productId);
                if (index !== -1) {
                    products[index] = {
                        id: parseInt(productId),
                        name: productName,
                        amazonAsin: amazonAsin,
                        walmartId: walmartId
                    };
                }
            } else {
                // Add new product
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                products.push({
                    id: newId,
                    name: productName,
                    amazonAsin: amazonAsin,
                    walmartId: walmartId
                });
            }
            
            // Update products table
            renderProductsTable();
            
            // Close modal
            productModal.style.display = 'none';
        });
    }
    
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', function() {
            productModal.style.display = 'none';
        });
    }
    
    if (productSearch) {
        productSearch.addEventListener('input', function() {
            renderProductsTable(this.value);
        });
    }
    
    // Promotions
    if (addPromotionBtn) {
        addPromotionBtn.addEventListener('click', function() {
            // Reset form
            promotionForm.reset();
            document.getElementById('promotion-id').value = '';
            document.getElementById('promotion-modal-title').textContent = 'Add Promotion';
            
            // Show modal
            promotionModal.style.display = 'block';
        });
    }
    
    if (promotionForm) {
        promotionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const promotionId = document.getElementById('promotion-id').value;
            const promotionName = document.getElementById('promotion-name').value;
            const promotionDescription = document.getElementById('promotion-description').value;
            
            if (promotionId) {
                // Edit existing promotion
                const index = promotions.findIndex(p => p.id == promotionId);
                if (index !== -1) {
                    promotions[index] = {
                        id: parseInt(promotionId),
                        name: promotionName,
                        description: promotionDescription
                    };
                }
            } else {
                // Add new promotion
                const newId = promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
                promotions.push({
                    id: newId,
                    name: promotionName,
                    description: promotionDescription
                });
            }
            
            // Update promotions table
            renderPromotionsTable();
            
            // Close modal
            promotionModal.style.display = 'none';
        });
    }
    
    if (cancelPromotionBtn) {
        cancelPromotionBtn.addEventListener('click', function() {
            promotionModal.style.display = 'none';
        });
    }
    
    if (promotionSearch) {
        promotionSearch.addEventListener('input', function() {
            renderPromotionsTable(this.value);
        });
    }
    
    // Submissions
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
            exportSubmissions('csv');
        });
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            exportSubmissions('excel');
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // In a real app, this would filter the submissions based on the selected filters
            // For this demo, we'll just reset to page 1
            currentPage = 1;
            currentPageSpan.textContent = currentPage;
            renderSubmissionsTable();
        });
    }
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                currentPageSpan.textContent = currentPage;
                renderSubmissionsTable();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                currentPageSpan.textContent = currentPage;
                renderSubmissionsTable();
            }
        });
    }
    
    // Settings
    if (emailSettingsForm) {
        emailSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, this would save the settings to the server
            alert('Email settings saved successfully!');
        });
    }
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            // In a real app, this would show a modal to add a new user
            alert('This feature is not implemented in the demo.');
        });
    }
    
    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // In a real app, this would validate the credentials with the server
            if (username === 'admin' && password === 'password') {
                // Set logged in state
                localStorage.setItem('isLoggedIn', 'true');
                
                // Hide login modal
                loginModal.style.display = 'none';
                
                // Update current user display
                document.getElementById('current-user').textContent = username;
            } else {
                alert('Invalid username or password. Try admin/password.');
            }
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear logged in state
            localStorage.removeItem('isLoggedIn');
            
            // Show login modal
            showLoginModal();
        });
    }
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the parent modal
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    if (closeSubmissionViewBtn) {
        closeSubmissionViewBtn.addEventListener('click', function() {
            viewSubmissionModal.style.display = 'none';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Initialize tables
    renderProductsTable();
    renderPromotionsTable();
    renderSubmissionsTable();
    
    // Add event listeners for edit and delete buttons
    document.addEventListener('click', function(e) {
        // Product edit button
        if (e.target.closest('.edit-btn') && e.target.closest('#products-table')) {
            const productId = e.target.closest('.edit-btn').getAttribute('data-id');
            editProduct(productId);
        }
        
        // Product delete button
        if (e.target.closest('.delete-btn') && e.target.closest('#products-table')) {
            const productId = e.target.closest('.delete-btn').getAttribute('data-id');
            deleteProduct(productId);
        }
        
        // Promotion edit button
        if (e.target.closest('.edit-btn') && e.target.closest('#promotions-table')) {
            const promotionId = e.target.closest('.edit-btn').getAttribute('data-id');
            editPromotion(promotionId);
        }
        
        // Promotion delete button
        if (e.target.closest('.delete-btn') && e.target.closest('#promotions-table')) {
            const promotionId = e.target.closest('.delete-btn').getAttribute('data-id');
            deletePromotion(promotionId);
        }
        
        // Submission view button
        if (e.target.closest('.view-btn') && e.target.closest('#submissions-table')) {
            const submissionId = e.target.closest('.view-btn').getAttribute('data-id');
            viewSubmission(submissionId);
        }
        
        // Submission delete button
        if (e.target.closest('.delete-btn') && e.target.closest('#submissions-table')) {
            const submissionId = e.target.closest('.delete-btn').getAttribute('data-id');
            deleteSubmission(submissionId);
        }
    });
    
    // Helper Functions
    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    function showLoginModal() {
        loginModal.style.display = 'block';
    }
    
    function renderProductsTable(searchTerm = '') {
        const productsTable = document.getElementById('products-table');
        if (!productsTable) return;
        
        // Filter products by search term
        const filteredProducts = searchTerm
            ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : products;
        
        // Generate table rows
        let html = '';
        filteredProducts.forEach(product => {
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.amazonAsin}</td>
                    <td>${product.walmartId}</td>
                    <td class="actions">
                        <button class="btn-icon edit-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        productsTable.innerHTML = html;
    }
    
    function renderPromotionsTable(searchTerm = '') {
        const promotionsTable = document.getElementById('promotions-table');
        if (!promotionsTable) return;
        
        // Filter promotions by search term
        const filteredPromotions = searchTerm
            ? promotions.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : promotions;
        
        // Generate table rows
        let html = '';
        filteredPromotions.forEach(promotion => {
            html += `
                <tr>
                    <td>${promotion.id}</td>
                    <td>${promotion.name}</td>
                    <td>${promotion.description}</td>
                    <td class="actions">
                        <button class="btn-icon edit-btn" data-id="${promotion.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" data-id="${promotion.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        promotionsTable.innerHTML = html;
    }
    
    function renderSubmissionsTable() {
        const submissionsTable = document.getElementById('submissions-table');
        if (!submissionsTable) return;
        
        // Calculate pagination
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedSubmissions = submissions.slice(start, end);
        
        // Generate table rows
        let html = '';
        paginatedSubmissions.forEach(submission => {
            html += `
                <tr>
                    <td>${submission.id}</td>
                    <td>${submission.date}</td>
                    <td>${submission.name}</td>
                    <td>${submission.email}</td>
                    <td>${submission.product}</td>
                    <td>${submission.platform}</td>
                    <td>${submission.orderNumber}</td>
                    <td>${submission.satisfaction}</td>
                    <td>${submission.promotion}</td>
                    <td>${submission.newsletter ? 'Yes' : 'No'}</td>
                    <td class="actions">
                        <button class="btn-icon view-btn" data-id="${submission.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon delete-btn" data-id="${submission.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        submissionsTable.innerHTML = html;
        
        // Update recent submissions table
        const recentSubmissionsTable = document.getElementById('recent-submissions-table');
        if (recentSubmissionsTable) {
            let recentHtml = '';
            submissions.slice(0, 3).forEach(submission => {
                recentHtml += `
                    <tr>
                        <td>${submission.date}</td>
                        <td>${submission.name}</td>
                        <td>${submission.product}</td>
                        <td>${submission.platform}</td>
                        <td>${submission.satisfaction}</td>
                        <td>${submission.promotion}</td>
                    </tr>
                `;
            });
            
            recentSubmissionsTable.innerHTML = recentHtml;
        }
    }
    
    function editProduct(productId) {
        const product = products.find(p => p.id == productId);
        if (!product) return;
        
        // Populate form
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('amazon-asin').value = product.amazonAsin;
        document.getElementById('walmart-id').value = product.walmartId;
        
        // Update modal title
        document.getElementById('product-modal-title').textContent = 'Edit Product';
        
        // Show modal
        productModal.style.display = 'block';
    }
    
    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id != productId);
            renderProductsTable();
        }
    }
    
    function editPromotion(promotionId) {
        const promotion = promotions.find(p => p.id == promotionId);
        if (!promotion) return;
        
        // Populate form
        document.getElementById('promotion-id').value = promotion.id;
        document.getElementById('promotion-name').value = promotion.name;
        document.getElementById('promotion-description').value = promotion.description;
        
        // Update modal title
        document.getElementById('promotion-modal-title').textContent = 'Edit Promotion';
        
        // Show modal
        promotionModal.style.display = 'block';
    }
    
    function deletePromotion(promotionId) {
        if (confirm('Are you sure you want to delete this promotion?')) {
            promotions = promotions.filter(p => p.id != promotionId);
            renderPromotionsTable();
        }
    }
    
    function viewSubmission(submissionId) {
        const submission = submissions.find(s => s.id == submissionId);
        if (!submission) return;
        
        // Populate submission details
        const submissionDetails = document.getElementById('submission-details');
        submissionDetails.innerHTML = `
            <div class="submission-detail-item">
                <strong>ID:</strong> ${submission.id}
            </div>
            <div class="submission-detail-item">
                <strong>Date:</strong> ${submission.date}
            </div>
            <div class="submission-detail-item">
                <strong>Name:</strong> ${submission.name}
            </div>
            <div class="submission-detail-item">
                <strong>Email:</strong> ${submission.email}
            </div>
            <div class="submission-detail-item">
                <strong>Product:</strong> ${submission.product}
            </div>
            <div class="submission-detail-item">
                <strong>Platform:</strong> ${submission.platform}
            </div>
            <div class="submission-detail-item">
                <strong>Order Number:</strong> ${submission.orderNumber}
            </div>
            <div class="submission-detail-item">
                <strong>Satisfaction:</strong> ${submission.satisfaction}
            </div>
            <div class="submission-detail-item">
                <strong>Promotion:</strong> ${submission.promotion}
            </div>
            <div class="submission-detail-item">
                <strong>Newsletter:</strong> ${submission.newsletter ? 'Yes' : 'No'}
            </div>
        `;
        
        // Show modal
        viewSubmissionModal.style.display = 'block';
    }
    
    function deleteSubmission(submissionId) {
        if (confirm('Are you sure you want to delete this submission?')) {
            submissions = submissions.filter(s => s.id != submissionId);
            renderSubmissionsTable();
        }
    }
    
    function exportSubmissions(format) {
        // In a real app, this would generate and download a file
        alert(`Exporting submissions as ${format.toUpperCase()}...`);
    }
});
