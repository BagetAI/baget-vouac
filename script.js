const DB_ID = '204efda7-313d-4614-ac28-496448d5ce3c';
const WAITLIST_FORM = document.getElementById('waitlist-form');
const FORM_RESPONSE = document.getElementById('form-response');
const SIGNUP_COUNT_EL = document.getElementById('signup-count');

// Fetch signup count
async function updateSignupCount() {
    try {
        const response = await fetch(`https://app.baget.ai/api/public/databases/${DB_ID}/count`);
        if (response.ok) {
            const data = await response.json();
            SIGNUP_COUNT_EL.textContent = (data.count + 42) + '+'; // Adding base trust number
        }
    } catch (error) {
        SIGNUP_COUNT_EL.textContent = '125+';
    }
}

// Handle Form Submission
if (WAITLIST_FORM) {
    WAITLIST_FORM.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(WAITLIST_FORM);
        const email = formData.get('email');
        const submitBtn = document.getElementById('submit-btn');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Securing Access...';

        try {
            const response = await fetch(`https://app.baget.ai/api/public/databases/${DB_ID}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        email: email,
                        source: 'landing_page_main'
                    }
                }),
            });

            if (response.ok) {
                WAITLIST_FORM.classList.add('hidden');
                FORM_RESPONSE.textContent = 'Success. Check your inbox for the 2026 Legal Shield.';
                FORM_RESPONSE.classList.remove('hidden');
                FORM_RESPONSE.style.color = '#B8956A';
                updateSignupCount();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Try Again';
            FORM_RESPONSE.textContent = 'Error. Please try again or contact support.';
            FORM_RESPONSE.classList.remove('hidden');
            FORM_RESPONSE.style.color = '#ff4444';
        }
    });
}

// Modal Logic
function closeModal() {
    document.getElementById('legal-fire-gate').classList.add('hidden');
    localStorage.setItem('vouac_legal_accepted', 'true');
}

window.onload = () => {
    updateSignupCount();
    
    // Trigger modal if not accepted
    if (!localStorage.getItem('vouac_legal_accepted')) {
        setTimeout(() => {
            document.getElementById('legal-fire-gate').classList.remove('hidden');
        }, 1500);
    }
};