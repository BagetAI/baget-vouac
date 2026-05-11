const SPOTS_DB_ID = '536646df-d658-43a9-8895-becab1994215';
let allSpots = [];

/**
 * Fetch spots from the database
 */
async function fetchSpots() {
    const grid = document.getElementById('spots-grid');
    const loader = document.getElementById('spots-loader');
    
    try {
        const response = await fetch(`https://app.baget.ai/api/public/databases/${SPOTS_DB_ID}/rows`);
        if (!response.ok) throw new Error('Failed to fetch spots');
        
        const data = await response.json();
        allSpots = data.rows;
        
        if (loader) loader.style.display = 'none';
        renderSpots(allSpots);
    } catch (error) {
        console.error('Error fetching spots:', error);
        if (loader) loader.innerHTML = '<p style="color: #F44336;">Failed to load legal database. Please refresh.</p>';
    }
}

/**
 * Render spot cards into the grid
 */
function renderSpots(spots) {
    const grid = document.getElementById('spots-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (spots.length === 0) {
        grid.innerHTML = '<div class="no-results">No verified spots found matching these criteria.</div>';
        return;
    }

    spots.forEach(spot => {
        const data = spot.data;
        const riskClass = `risk-${data.risk_level.toLowerCase().replace(' ', '-')}`;
        
        const card = document.createElement('article');
        card.className = `spot-card ${riskClass}`;
        
        card.innerHTML = `
            <span class="spot-tag">${data.region} | ${data.department}</span>
            <h3>${data.name}</h3>
            <p>${data.legality_notes}</p>
            <div class="spot-meta">
                <span class="risk-indicator">Risk: ${data.risk_level}</span>
                <span class="spot-coords">${data.latitude}, ${data.longitude}</span>
            </div>
            ${data.source_url ? `<a href="${data.source_url}" target="_blank" class="source-link">Official Decree &rarr;</a>` : ''}
        `;
        
        grid.appendChild(card);
    });
}

/**
 * Filter spots by region and risk level
 */
function applyFilters() {
    const regionFilter = document.getElementById('region-filter').value;
    const riskFilter = document.getElementById('risk-filter').value;
    
    let filtered = allSpots;
    
    if (regionFilter !== 'all') {
        filtered = filtered.filter(s => s.data.region === regionFilter);
    }
    
    if (riskFilter !== 'all') {
        filtered = filtered.filter(s => s.data.risk_level === riskFilter);
    }
    
    renderSpots(filtered);
}

/**
 * Modal logic (preserved and enhanced)
 */
function initModal() {
    const accessBtn = document.getElementById('access-btn');
    const termsCheckbox = document.getElementById('accept-terms');
    const spotsModal = document.getElementById('spots-access-modal');

    if (termsCheckbox && accessBtn) {
        termsCheckbox.addEventListener('change', (e) => {
            accessBtn.disabled = !e.target.checked;
        });
        
        accessBtn.addEventListener('click', () => {
            spotsModal.classList.add('hidden');
            localStorage.setItem('vouac_spots_access_2026', 'true');
            fetchSpots(); // Fetch data after unlocking
        });
    }

    if (localStorage.getItem('vouac_spots_access_2026')) {
        if (spotsModal) spotsModal.classList.add('hidden');
        fetchSpots();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initModal();
    
    const regionFilter = document.getElementById('region-filter');
    const riskFilter = document.getElementById('risk-filter');
    
    if (regionFilter) regionFilter.addEventListener('change', applyFilters);
    if (riskFilter) riskFilter.addEventListener('change', applyFilters);
});
