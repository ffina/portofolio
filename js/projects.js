const PROJECT_DETAILS = {
    'loan-default': {
        category: 'AI & ML',
        title: 'Loan default prediction',
        image: 'assets/images/project/loan-default.png',
        tags: ['Python', 'Scikit-Learn', 'LightGBM', 'SMOTE'],
        description: 'End-to-end Machine Learning pipeline to mitigate financial credit risk on high-volume imbalanced financial datasets (67k+ records). Evaluated 5 classification models with advanced resampling techniques to maximize recall and prevent costly default risks.',
        highlights: [
            'Optimized credit risk detection using SMOTE & ADASYN techniques, significantly boosting minority class recall for high-risk borrower detection.',
            'Applied Dimensionality Reduction (PCA) with LightGBM, raising F1-Score from 0.68 to 0.71 while maintaining low computational latency.'
        ],
        paperUrl: 'assets/papers/loan-default-paper.pdf'
    },
    'smartlaundry': {
        category: 'UI/UX',
        title: 'SmartLaundry',
        image: 'assets/images/project/laundry.png',
        tags: ['Figma', 'UI/UX', 'Mobile'],
        description: 'Customer-side laundry ordering & tracking: choose the laundry type and pickup/delivery method, then follow the order status in real time from received to finished.',
        figmaUrl: 'https://www.figma.com/proto/NKUhroxNWEW4pBwnfFd4iK/Smart-Laundry-Web?node-id=22-175&t=XA6GZJONNbnpnac4-0&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=22%3A175&show-proto-sidebar=1'
    },
    'congklak': {
        category: 'UI/UX',
        title: 'Accessible Congklak',
        image: 'assets/images/project/congklak.jpg',
        tags: ['Figma', 'Accessibility', 'Game design'],
        description: 'A prototype of the traditional Congklak game playable by blind users, with audio narration for each hole and turn, plus haptic feedback.',
        figmaUrl: 'https://www.figma.com/proto/ZKgionbDuydsojZujxNPPP/IEMKA?node-id=21-1184&t=tI4kiAiXSWdVmcRx-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=21%3A1184&show-proto-sidebar=1'
    },
    'vr-cake': {
        category: 'UI/UX',
        title: 'VR Cake Master',
        image: 'assets/images/project/vrCake.jpg',
        tags: ['Figma', 'VR', 'Spatial UI'],
        description: 'A VR interface concept for a cake-decorating simulation: users pick utensils and toppings from a spatial panel, then interact directly with 3D objects via controllers.',
        figmaUrl: 'https://www.figma.com/proto/ZKgionbDuydsojZujxNPPP/IEMKA?node-id=95-22&t=tI4kiAiXSWdVmcRx-0&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=95%3A22&show-proto-sidebar=1'
    },
    'visiontalk': {
        category: 'Mobile app',
        title: 'VisionTalk',
        image: 'assets/images/project/visiontalk.png',
        tags: ['Flutter', 'Python', 'Computer Vision', 'Edge Computing'],
        description: 'An AI-powered mobile app that recognizes objects around the user in real time via the camera (edge computing), supporting both accessibility and environment exploration.',
        highlights: [
            'Real-time object recognition with on-device edge computing (e.g. detecting "bottle" at 62.6% accuracy)',
            'Live performance indicator (FPS) to monitor model inference speed',
            'Lightweight, responsive bounding-box overlay interface'
        ]
    },
    'purchasing-dashboard': {
        category: 'Data & security',
        title: 'Purchasing dashboard',
        image: 'assets/images/project/purchasing-dashboard.png',
        tags: ['Power BI', 'DAX', 'Data modeling'],
        description: 'An interactive sales dashboard recreating the Adventure Works case study, applying data modeling and visualization to analyze sales, profit margin, and quantity per product category.'
    },
    'file-encryption': {
        category: 'Data & security',
        title: 'Secure file encryption system',
        image: 'assets/images/project/file-encryption.png',
        tags: ['AES', 'DES', 'RC4', 'RSA'],
        description: 'End-to-end secure file encryption architecture combining high-speed symmetric ciphers (AES, DES, RC4) with asymmetric key management (RSA) to guarantee enterprise data confidentiality and integrity.',
        highlights: [
            'Implemented secure RSA public-private key pair management and validation workflows for end-to-end data encryption.',
            'Built an intuitive, security-focused web client for seamless client-side file encryption and decryption operations.'
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- Filter + "Show all" ---
    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.project-card');
    const grid = document.querySelector('[data-project-grid]');

    const LIMIT = 4;
    const showAllBtn = document.querySelector('[data-project-show-all]');
    let currentMatches = [];
    let expanded = false;

    function renderCards() {
        cards.forEach(card => card.classList.add('is-hidden'));
        const visible = expanded ? currentMatches : currentMatches.slice(0, LIMIT);
        visible.forEach(card => card.classList.remove('is-hidden'));

        if (showAllBtn) {
            if (currentMatches.length > LIMIT && !expanded) {
                showAllBtn.textContent = `Show all (${currentMatches.length})`;
                showAllBtn.hidden = false;
            } else {
                showAllBtn.hidden = true;
            }
        }
    }

    function applyFilter(filter) {
        currentMatches = Array.from(cards).filter(
            card => filter === 'all' || card.dataset.category === filter
        );
        expanded = false;
        renderCards();
    }

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            grid.classList.add('is-filtering');
            setTimeout(() => {
                applyFilter(pill.dataset.filter);
                grid.classList.remove('is-filtering');
            }, 200);
        });
    });

    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            expanded = true;
            renderCards();
        });
    }

    applyFilter('all');

    // --- Modal ---
    const overlay = document.querySelector('[data-modal-overlay]');
    const body = document.querySelector('[data-modal-body]');
    const closeBtn = document.querySelector('[data-modal-close]');
    if (!overlay || !body || !closeBtn) return;

    function renderModal(key) {
        const data = PROJECT_DETAILS[key];
        if (!data) return;
        const tagsHtml = data.tags.map(t => `<span class="project-tag" style="margin-right:8px;">${t}</span>`).join('');
        const highlightsHtml = (data.highlights || [])
            .map(h => `<li style="margin-bottom:8px;">${h}</li>`).join('');
        const figmaHtml = data.figmaUrl
            ? `<a href="${data.figmaUrl}" target="_blank" rel="noopener" style="display:inline-block;margin-top:18px;border:1px solid #4ade80;color:#4ade80;padding:10px 20px;border-radius:999px;font-size:0.8rem;font-weight:600;text-decoration:none;">Open Figma prototype</a>`
            : '';
        const imageHtml = data.image
            ? `<div style="width:100%;aspect-ratio:16/10;border-radius:12px;margin-bottom:18px;background-color:#1f1f1f;background-image:url('${data.image}');background-size:cover;background-position:center;"></div>`
            : '';
        const paperHtml = data.paperUrl
            ? `<a href="${data.paperUrl}" target="_blank" rel="noopener" class="modal-paper-link" style="display:inline-block;font-size:0.8rem;font-weight:600;margin-bottom:16px;">Read the paper (PDF)</a><br>`
            : '';
        body.innerHTML = `
            ${imageHtml}
            <p style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;color:#4ade80;margin-bottom:8px;">${data.category}</p>
            <h3 style="font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:14px;">${data.title}</h3>
            <p style="color:#d1d5db;line-height:1.7;margin-bottom:16px;">${data.description}</p>
            ${highlightsHtml ? `<ul style="list-style: disc; color:#9ca3af;font-size:0.9rem;line-height:1.6;padding-left:18px;margin-bottom:16px;">${highlightsHtml}</ul>` : ''}
            ${paperHtml}
            <div style="margin-top:12px;">${tagsHtml}</div>
            ${figmaHtml}
        `;
        overlay.hidden = false;
    }

    cards.forEach(card => {
        if (card.dataset.project) {
            card.addEventListener('click', () => renderModal(card.dataset.project));
        }
    });

    closeBtn.addEventListener('click', () => { overlay.hidden = true; });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.hidden = true;
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') overlay.hidden = true;
    });
});
