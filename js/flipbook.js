document.addEventListener('DOMContentLoaded', function () {
    const imageFolder = 'images/';
    const firstPageNum = 1;
    const lastPageNum = 18;
    const imageExtension = '.jpg';

    const flipbook = $('#flipbook');
    const currentPageEl = document.getElementById('current-page');
    const totalPagesEl = document.getElementById('total-pages');
    const zoomLevelEl = document.querySelector('.zoom-level');
    const flipbookZoomContainer = document.querySelector('.flipbook-zoom-container');
    const wrapper = document.querySelector('.flipbook-scroll-wrapper');

    const baseWidth = 1200;
    const baseHeight = 900;
    let currentZoom = 1;
    const zoomStep = 0.1;
    const maxZoom = 3;
    const minZoom = 0.5;

    totalPagesEl.textContent = lastPageNum;

    // Create pages
    for (let i = firstPageNum; i <= lastPageNum; i++) {
        const page = $('<div />').addClass('page');
        page.css({
            backgroundImage: `url(${imageFolder}${i}${imageExtension})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '600px',
            height: '900px'
        });
        flipbook.append(page);
    }

    // Initialize turn.js
    flipbook.turn({
        width: baseWidth,
        height: baseHeight,
        autoCenter: false,
        elevation: 50,
        gradients: true,
        duration: 1000,
        pages: lastPageNum,
        when: {
            turning: function (event, page) {
                currentPageEl.textContent = page;
            },
            turned: function (event, page) {
                currentPageEl.textContent = page;
                const flipbookEl = document.getElementById('flipbook');

                // Apply or remove class based on whether it's page 1
                if (page === 1) {
                    flipbookEl.classList.remove('shift-right');
                } else {
                    flipbookEl.classList.add('shift-right');
                }
            }
        }
    });

    // Zoom handling
    const updateZoom = () => {
        const newWidth = baseWidth * currentZoom;
        const newHeight = baseHeight * currentZoom;

        $('#flipbook').turn('size', newWidth, newHeight);
        flipbookZoomContainer.style.width = `${newWidth}px`;
        flipbookZoomContainer.style.height = `${newHeight}px`;
        zoomLevelEl.textContent = `${Math.round(currentZoom * 100)}%`;
    };

    document.getElementById('zoom-in').addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            updateZoom();
        }
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            updateZoom();
        }
    });

    document.getElementById('zoom-fit').addEventListener('click', () => {
        currentZoom = 1;
        updateZoom();
    });

    // Fullscreen handler
    document.getElementById('fullscreen-toggle').addEventListener('click', () => {
        const docEl = document.documentElement;
        const isFullscreen = document.fullscreenElement;

        if (!isFullscreen) {
            if (docEl.requestFullscreen) docEl.requestFullscreen();
            document.body.classList.add('fullscreen');
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            document.body.classList.remove('fullscreen');
        }
    });

    // Navigation
    document.getElementById('next-page').addEventListener('click', () => {
        flipbook.turn('next');
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        flipbook.turn('previous');
    });

    document.getElementById('first-page').addEventListener('click', () => {
        flipbook.turn('page', 1);
    });

    document.getElementById('last-page').addEventListener('click', () => {
        flipbook.turn('page', lastPageNum);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') flipbook.turn('previous');
        if (e.key === 'ArrowRight') flipbook.turn('next');
    });

    updateZoom(); // initialize
});

