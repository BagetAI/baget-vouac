const DB_ID = '204efda7-313d-4614-ac28-496448d5ce3c';
const WAITLIST_FORM = document.getElementById('waitlist-form');
const FORM_RESPONSE = document.getElementById('form-response');
const SIGNUP_COUNT_EL = document.getElementById('signup-count');

/**
 * Fetch and update the signup count from the public API.
 */
async function updateSignupCount() {
    if (!SIGNUP_COUNT_EL) return;
    try {
        const response = await fetch(`https://app.baget.ai/api/public/databases/${DB_ID}/count`);
        if (response.ok) {
            const data = await response.json();
            // Using a base offset of 125 for social proof as per brand direction
            SIGNUP_COUNT_EL.textContent = (data.count + 125);
        }
    } catch (error) {
        console.error('Failed to fetch signup count:', error);
    }
}

/**
 * Handle the waitlist form submission.
 */
if (WAITLIST_FORM) {
    WAITLIST_FORM.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const formData = new FormData(WAITLIST_FORM);
        const email = formData.get('email');

        if (!email) return;

        // UI state: loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Reserving...';

        try {
            const response = await fetch(`https://app.baget.ai/api/public/databases/${DB_ID}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        email: email,
                        source: 'landing_page_v2',
                        timestamp: new Date().toISOString()
                    }
                }),
            });

            if (response.ok) {
                // UI state: success
                WAITLIST_FORM.classList.add('hidden');
                FORM_RESPONSE.classList.remove('hidden');
                updateSignupCount();
            } else {
                throw new Error('Database insertion failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Try Again';
            alert('Something went wrong. Please try again.');
        }
    });
}

/**
 * Compliance Modal Logic
 */
function closeModal() {
    const modal = document.getElementById('legal-fire-gate');
    if (modal) {
        modal.classList.add('hidden');
        localStorage.setItem('vouac_legal_accepted_2026', 'true');
    }
}

/**
 * Initialize on load
 */
window.onload = () => {
    updateSignupCount();

    // Check if legal compliance was already accepted
    const modal = document.getElementById('legal-fire-gate');
    const hasAccepted = localStorage.getItem('vouac_legal_accepted_2026');

    if (modal && !hasAccepted) {
        // Show modal with a delay for dramatic effect
        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 1500);
    }
};
