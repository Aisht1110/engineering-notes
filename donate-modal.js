(function() {
    // Only run once
    if (document.getElementById('donateModal')) return;

    const MODAL_KEY = 'btb_donate_seen';
    const MODAL_COOLDOWN_DAYS = 3; // Don't show again for 3 days after dismissal

    function shouldShowModal() {
        const last = localStorage.getItem(MODAL_KEY);
        if (!last) return true;
        const daysSince = (Date.now() - parseInt(last, 10)) / (1000 * 60 * 60 * 24);
        return daysSince >= MODAL_COOLDOWN_DAYS;
    }

    function dismissModal() {
        localStorage.setItem(MODAL_KEY, Date.now().toString());
        document.getElementById('donateModal').style.display = 'none';
    }

    // Determine the correct path to donate.html based on current URL depth
    // If we are in a subfolder like /mech/, we need to go up one level
    const depth = window.location.pathname.split('/').length - 2; // -1 for empty string at start, -1 for filename
    const prefix = depth > 0 && !window.location.pathname.endsWith('/') ? '../'.repeat(depth) : '';
    const donateUrl = prefix + 'donate.html';

    // Inject the Modal HTML
    const modalHTML = `
    <div id="donateModal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(15,23,42,0.5); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); justify-content:center; align-items:center; padding:20px;">
        <div style="background:#fff; border-radius:20px; max-width:420px; width:100%; padding:36px 28px; text-align:center; box-shadow:0 25px 50px -12px rgba(0,0,0,0.15); position:relative; animation:modalSlideUp 0.35s cubic-bezier(0.16,1,0.3,1);">
            <button id="modalClose" style="position:absolute; top:14px; right:16px; background:none; border:none; font-size:1.4rem; cursor:pointer; color:#94a3b8; line-height:1;">&times;</button>
            <div style="width:56px; height:56px; background:#eff6ff; border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 18px; font-size:1.6rem;">❤️</div>
            <h3 style="font-family:'DM Serif Text',serif; font-size:1.6rem; color:#0f172a; margin:0 0 10px;">Enjoying Free Notes?</h3>
            <p style="font-size:0.95rem; color:#64748b; line-height:1.7; margin:0 0 28px;">BTechBook is 100% free & ad-free. If our notes help you, a small contribution keeps the servers running for everyone!</p>
            <a id="modalDonate" href="${donateUrl}" style="display:block; width:100%; padding:14px; background:#2563eb; color:#fff; font-weight:700; font-size:1.05rem; border-radius:12px; text-decoration:none; margin-bottom:12px; transition:background 0.2s;">Support BTechBook ❤️</a>
            <button id="modalContinue" style="display:block; width:100%; padding:14px; background:#f1f5f9; color:#334155; font-weight:600; font-size:1rem; border-radius:12px; border:none; cursor:pointer; transition:background 0.2s;">Continue to Notes &rarr;</button>
        </div>
    </div>
    <style>
        @keyframes modalSlideUp {
            from { opacity:0; transform:translateY(30px); }
            to   { opacity:1; transform:translateY(0); }
        }
        #donateModal[style*="flex"] { display:flex !important; }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add interceptors
    // We target both the branch cards (.dept-box) and the individual subject links (.subject-item a)
    const linksToIntercept = document.querySelectorAll('.dept-box, .subject-item a, .subject-card a');

    linksToIntercept.forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (!shouldShowModal()) return; // Let the link work normally

            e.preventDefault();
            const targetUrl = card.getAttribute('href') || card.parentElement.getAttribute('href');
            
            if(!targetUrl || targetUrl === '#' || targetUrl.startsWith('javascript:')) {
                // If it's a broken or JS link, don't intercept
                return;
            }

            const modal = document.getElementById('donateModal');
            modal.style.display = 'flex';

            // Continue button
            document.getElementById('modalContinue').onclick = function() {
                dismissModal();
                window.location.href = targetUrl;
            };

            // Close button
            document.getElementById('modalClose').onclick = function() {
                dismissModal();
                window.location.href = targetUrl;
            };

            // Donate button clicks (also dismiss the modal so they aren't bugged again immediately)
            document.getElementById('modalDonate').onclick = function() {
                dismissModal();
            };

            // Click outside modal
            modal.onclick = function(ev) {
                if (ev.target === modal) {
                    dismissModal();
                    window.location.href = targetUrl;
                }
            };
        });
    });
})();
