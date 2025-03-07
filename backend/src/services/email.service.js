const nodemailer = require('nodemailer');

/**
 * Email service for sending emails
 */
class EmailService {
    constructor() {
        try {
            // Check if email credentials are provided and not placeholders
            if (process.env.EMAIL_USER && 
                process.env.EMAIL_PASSWORD && 
                !process.env.EMAIL_USER.includes('your_email') &&
                !process.env.EMAIL_PASSWORD.includes('your_email_password')) {
                
                this.transporter = nodemailer.createTransport({
                    service: process.env.EMAIL_SERVICE || 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                this.enabled = true;
            } else {
                console.warn('Email credentials not provided or are placeholders. Email sending is disabled.');
                this.enabled = false;
            }
        } catch (error) {
            console.error('Error initializing email service:', error.message);
            this.enabled = false;
        }
    }
    
    /**
     * Send a confirmation email to the user
     * @param {Object} options - Email options
     * @param {string} options.email - Recipient email
     * @param {string} options.name - Recipient name
     * @param {string} options.product - Product name
     * @param {string} options.promotion - Promotion name
     * @param {string} options.platform - Platform name
     * @param {string} options.reviewLink - Review link
     * @returns {Promise} - Nodemailer send result
     */
    async sendConfirmationEmail(options) {
        // If email service is not enabled, return a mock success response
        if (!this.enabled) {
            console.log(`[MOCK] Would send confirmation email to: ${options.email} (${options.name})`);
            console.log(`[MOCK] Email content: Thank you for your submission for ${options.product}. You selected the ${options.promotion} promotion.`);
            return {
                success: true,
                mock: true,
                message: 'Email service is disabled. This is a mock response.'
            };
        }
        
        const platformText = this.getPlatformText(options.platform);
        
        const mailOptions = {
            from: `"Product Review App" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: options.email,
            subject: 'Thank you for your submission!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4a90e2;">Thank You for Your Submission!</h2>
                    
                    <p>Hello ${options.name},</p>
                    
                    <p>Thank you for completing our product review form. We appreciate your feedback on our ${options.product}.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #333;">Your Selected Promotion:</h3>
                        <p style="font-weight: bold; color: #4a90e2;">${options.promotion}</p>
                        
                        <p>You will receive your promotion within 7 days. Our team will process your request and get back to you shortly.</p>
                    </div>
                    
                    <p>We would greatly appreciate if you could take a moment to leave a review on ${platformText}. Your feedback helps us improve our products and services.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${options.reviewLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Leave a Review</a>
                    </div>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact our customer support team.</p>
                    
                    <p>Best regards,<br>The Product Review Team</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                        <p>This email was sent to ${options.email}. If you did not submit this form, please disregard this email.</p>
                    </div>
                </div>
            `
        };
        
        try {
            return await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Get the platform text for display in emails
     * @param {string} platform - Platform code
     * @returns {string} - Platform display text
     */
    getPlatformText(platform) {
        const platformMap = {
            'amazon': 'Amazon',
            'walmart': 'Walmart',
            'ebay': 'eBay'
        };
        
        return platformMap[platform] || platform;
    }
}

module.exports = new EmailService();
