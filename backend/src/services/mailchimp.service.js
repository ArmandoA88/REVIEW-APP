const Mailchimp = require('mailchimp-api-v3');

/**
 * Mailchimp service for managing newsletter subscriptions
 */
class MailchimpService {
    constructor() {
        this.enabled = false;
        
        try {
            // Check if API key is provided and not a placeholder
            if (process.env.MAILCHIMP_API_KEY && 
                typeof process.env.MAILCHIMP_API_KEY === 'string' && 
                !process.env.MAILCHIMP_API_KEY.includes('your_mailchimp_api_key')) {
                
                this.mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
                this.listId = process.env.MAILCHIMP_LIST_ID;
                this.enabled = true;
            } else {
                console.warn('Mailchimp API key not provided or is a placeholder. Mailchimp integration is disabled.');
            }
        } catch (error) {
            console.error('Error initializing Mailchimp service:', error.message);
        }
        
        // If not enabled, create a mock getMemberHash method
        if (!this.enabled) {
            this.mailchimp = {
                getMemberHash: (email) => {
                    return Buffer.from(email.toLowerCase()).toString('hex');
                }
            };
        }
    }
    
    /**
     * Add a subscriber to the Mailchimp list
     * @param {Object} options - Subscriber options
     * @param {string} options.email - Subscriber email
     * @param {string} options.name - Subscriber name
     * @returns {Promise} - Mailchimp API response
     */
    async addSubscriber(options) {
        // If Mailchimp is not enabled, return a mock success response
        if (!this.enabled) {
            console.log(`[MOCK] Would add subscriber to Mailchimp: ${options.email} (${options.name})`);
            return {
                success: true,
                mock: true,
                message: 'Mailchimp integration is disabled. This is a mock response.'
            };
        }
        
        // Split name into first and last name
        const nameParts = options.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const subscriber = {
            email_address: options.email,
            status: 'subscribed', // Use 'pending' for double opt-in
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        };
        
        try {
            return await this.mailchimp.post(`/lists/${this.listId}/members`, subscriber);
        } catch (error) {
            // If the user is already subscribed, update their information
            if (error.status === 400 && error.title === 'Member Exists') {
                const subscriberHash = this.mailchimp.getMemberHash(options.email);
                return await this.mailchimp.patch(`/lists/${this.listId}/members/${subscriberHash}`, {
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                });
            }
            
            console.error('Error adding subscriber to Mailchimp:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Remove a subscriber from the Mailchimp list
     * @param {string} email - Subscriber email
     * @returns {Promise} - Mailchimp API response
     */
    async removeSubscriber(email) {
        // If Mailchimp is not enabled, return a mock success response
        if (!this.enabled) {
            console.log(`[MOCK] Would remove subscriber from Mailchimp: ${email}`);
            return {
                success: true,
                mock: true,
                message: 'Mailchimp integration is disabled. This is a mock response.'
            };
        }
        
        const subscriberHash = this.mailchimp.getMemberHash(email);
        
        try {
            // Archive the member instead of permanently deleting
            return await this.mailchimp.patch(`/lists/${this.listId}/members/${subscriberHash}`, {
                status: 'unsubscribed'
            });
        } catch (error) {
            // If the user doesn't exist, just return success
            if (error.status === 404) {
                return { success: true, message: 'Member not found' };
            }
            
            console.error('Error removing subscriber from Mailchimp:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Check if an email is subscribed to the Mailchimp list
     * @param {string} email - Subscriber email
     * @returns {Promise<boolean>} - Whether the email is subscribed
     */
    async isSubscribed(email) {
        // If Mailchimp is not enabled, return false
        if (!this.enabled) {
            console.log(`[MOCK] Would check if subscribed to Mailchimp: ${email}`);
            return false;
        }
        
        const subscriberHash = this.mailchimp.getMemberHash(email);
        
        try {
            const response = await this.mailchimp.get(`/lists/${this.listId}/members/${subscriberHash}`);
            return response.status === 'subscribed';
        } catch (error) {
            if (error.status === 404) {
                return false;
            }
            
            console.error('Error checking subscription status in Mailchimp:', error.message);
            return false;
        }
    }
}

module.exports = new MailchimpService();
