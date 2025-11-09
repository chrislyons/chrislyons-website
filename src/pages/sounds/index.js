/**
 * Sounds Page Render Functions
 *
 * Extracted from src/main.js - Contains all render functions for /sounds/* routes
 */

// Import utilities
import contentLoader from '../../utils/contentLoader.js';

// Import components
import { PageHeader } from '../../components/PageHeader.js';
import { SongAccordion } from '../../components/SongAccordion.js';

// Import data
import { songs } from '../../data/songs.js';

/**
 * Helper function to render placeholder pages
 */
function renderPlaceholderPage(title, description) {
  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto text-center py-20">
      <h1 class="text-5xl font-bold mb-6 text-primary">${title}</h1>
      <p class="text-xl text-gray-600 mb-8">${description}</p>
      <p class="text-base text-gray-500">Content coming soon.</p>
      <div class="mt-8">
        <a href="/" class="link">← Back to home</a>
      </div>
    </div>
  `;
}

/**
 * Render Discography page with 3D carousel
 */
export function renderDiscographyPage() {
  contentLoader.updateDocumentTitle('Discography');

  const albums = [
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3394260668/size=large/bgcol=ffffff/linkcol=333333/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/transbastardized-orphan-under-a-harvest-moon">Transbastardized Orphan under a Harvest Moon by Heartbeat Hotel</a></iframe>',
      title: 'Transbastardized Orphan under a Harvest Moon',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3513920352/size=large/bgcol=333333/linkcol=2ebd35/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/cottage-country-lost-tracks-rarities">Cottage Country (Lost Tracks &amp; Rarities) by Heartbeat Hotel</a></iframe>',
      title: 'Cottage Country (Lost Tracks & Rarities)',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2794385769/size=large/bgcol=333333/linkcol=fe7eaf/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/fetus-dreams">Fetus Dreams by Heartbeat Hotel</a></iframe>',
      title: 'Fetus Dreams',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2124895145/size=large/bgcol=333333/linkcol=fe7eaf/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/coughdrops-ep">CoughDrops EP by Heartbeat Hotel</a></iframe>',
      title: 'CoughDrops EP',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=4015725829/size=large/bgcol=333333/linkcol=9a64ff/transparent=true/" seamless><a href="https://heartbeathotel.bandcamp.com/album/intae-woe">Intae Woe by Heartbeat Hotel</a></iframe>',
      title: 'Intae Woe',
      artist: 'Heartbeat Hotel'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3126550928/size=large/bgcol=ffffff/linkcol=e99708/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/alton-sterling-ep">ALTON STERLING EP by Magical Superflowers</a></iframe>',
      title: 'ALTON STERLING EP',
      artist: 'Magical Superflowers'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3108652218/size=large/bgcol=ffffff/linkcol=63b2cc/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/hello-world-ep">HELLO WORLD EP by Magical Superflowers</a></iframe>',
      title: 'HELLO WORLD EP',
      artist: 'Magical Superflowers'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=4026392449/size=large/bgcol=ffffff/linkcol=de270f/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/holding-pattern-ep">HOLDING PATTERN EP by Magical Superflowers</a></iframe>',
      title: 'HOLDING PATTERN EP',
      artist: 'Magical Superflowers'
    },
    {
      embed: '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3578788191/size=large/bgcol=ffffff/linkcol=0687f5/transparent=true/" seamless><a href="https://magicalsuperflowers.bandcamp.com/album/moonbulbs-ep">MOONBULBS EP by Magical Superflowers</a></iframe>',
      title: 'MOONBULBS EP',
      artist: 'Magical Superflowers'
    }
  ];

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <!-- Header with inline Volume Control -->
      <div class="mb-8">
        <div class="flex items-center gap-4">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Discography</h1>
          <div class="volume-control-container">
            <button id="volume-button" class="volume-button" aria-label="Volume control">
              <svg id="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
            <div id="volume-slider-container" class="volume-slider-container">
              <input type="range" id="volume-slider" class="volume-slider" min="0" max="100" value="90" aria-label="Volume slider">
              <span id="volume-percentage" class="volume-percentage">90%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Carousel Container -->
      <div class="carousel-3d-wrapper">
        <!-- Navigation Arrows -->
        <button id="carousel-prev" class="carousel-nav carousel-nav-left" aria-label="Previous album">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button id="carousel-next" class="carousel-nav carousel-nav-right" aria-label="Next album">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- 3D Carousel Scene -->
        <div class="carousel-3d-scene">
          <div id="carousel-3d" class="carousel-3d">
            ${albums.map((album, index) => `
              <div class="carousel-3d-item" data-index="${index}">
                <div class="bandcamp-embed-container">
                  ${album.embed}
                </div>
                <div class="album-info">
                  <h3 class="font-semibold text-gray-900">${album.title}</h3>
                  <p class="text-sm text-gray-600">${album.artist}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Back Navigation -->
      <div style="margin-top: 14rem;" class="text-center">
        <a href="/sounds" class="link text-lg">← Back to Sounds</a>
      </div>
    </div>

    <style>
      .carousel-3d-wrapper {
        position: relative;
        width: 100%;
        height: 900px;
        margin: 0 0 2rem;
      }

      .carousel-3d-scene {
        width: 100%;
        height: 100%;
        perspective: 2000px;
        perspective-origin: 50% 45%;
        overflow: visible;
      }

      .carousel-3d {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .carousel-3d-item {
        position: absolute;
        left: 50%;
        top: 55%;
        width: 380px;
        transform-style: preserve-3d;
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: -190px;
        margin-top: -280px;
      }

      .bandcamp-embed-container {
        width: 100%;
        height: 560px;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        background: #fff;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .album-info {
        text-align: center;
        margin-top: 1.5rem;
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      .carousel-3d-item[data-position="0"] .album-info {
        opacity: 1;
      }

      .carousel-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #333;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .carousel-nav:hover {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        transform: translateY(-50%) scale(1.15);
      }

      .carousel-nav:active {
        transform: translateY(-50%) scale(1.05);
      }

      .carousel-nav-left {
        left: 10%;
      }

      .carousel-nav-right {
        right: 10%;
      }

      /* Volume Control Styles */
      .volume-control-container {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .volume-button {
        background: var(--card-bg, rgba(255, 255, 255, 0.95));
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-primary, #333);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .volume-button:hover {
        background: var(--card-bg-hover, rgba(255, 255, 255, 1));
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: scale(1.05);
      }

      .volume-button svg {
        width: 24px;
        height: 24px;
      }

      .volume-slider-container {
        position: absolute;
        left: 60px;
        top: 50%;
        transform: translateY(-50%);
        background: var(--card-bg, rgba(255, 255, 255, 0.98));
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
        border-radius: 1rem;
        padding: 0.75rem 1rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 1000;
        white-space: nowrap;
      }

      .volume-slider-container.visible {
        opacity: 1;
        pointer-events: auto;
      }

      .volume-slider {
        width: 120px;
        height: 4px;
        border-radius: 2px;
        background: var(--border-color, #ddd);
        outline: none;
        -webkit-appearance: none;
        appearance: none;
      }

      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color, #4A90E2);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .volume-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        background: var(--primary-hover, #3A7BC8);
      }

      .volume-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color, #4A90E2);
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }

      .volume-slider::-moz-range-thumb:hover {
        transform: scale(1.2);
        background: var(--primary-hover, #3A7BC8);
      }

      .volume-percentage {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary, #333);
        min-width: 40px;
        text-align: right;
      }

      @media (max-width: 1200px) {
        .carousel-3d-wrapper {
          height: 700px;
        }

        .carousel-3d-item {
          width: 340px;
          margin-left: -170px;
          margin-top: -260px;
        }

        .bandcamp-embed-container {
          height: 520px;
        }

        .carousel-nav-left {
          left: 5%;
        }

        .carousel-nav-right {
          right: 5%;
        }
      }

      @media (max-width: 768px) {
        .carousel-3d-wrapper {
          height: 600px;
        }

        .carousel-3d-item {
          width: 300px;
          margin-left: -150px;
          margin-top: -240px;
        }

        .bandcamp-embed-container {
          height: 480px;
        }

        .carousel-nav {
          width: 48px;
          height: 48px;
        }

        .carousel-nav-left {
          left: 20px;
        }

        .carousel-nav-right {
          right: 20px;
        }
      }
    </style>
  `;

  // Add 3D carousel navigation functionality
  setTimeout(() => {
    const carousel = document.getElementById('carousel-3d');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const items = document.querySelectorAll('.carousel-3d-item');

    if (!carousel || !prevBtn || !nextBtn || items.length === 0) return;

    let currentIndex = 0;
    const totalAlbums = 9;
    const anglePerItem = 360 / totalAlbums;
    const radius = 650; // Distance from center

    function updateCarousel() {
      // Rotate the entire carousel
      const rotationAngle = -anglePerItem * currentIndex;
      carousel.style.transform = 'rotateY(' + rotationAngle + 'deg)';

      // Position and style each item
      items.forEach((item, index) => {
        const itemAngle = anglePerItem * index;
        const relativePosition = (index - currentIndex + totalAlbums) % totalAlbums;

        // Position in 3D space
        item.style.transform = 'rotateY(' + itemAngle + 'deg) translateZ(' + radius + 'px)';

        // Calculate distance from center (0 = center, higher = further)
        const distanceFromCenter = Math.min(relativePosition, totalAlbums - relativePosition);

        // Apply Cover Flow lighting and scaling effects
        let opacity = 1;
        let scale = 1;
        let brightness = 1;
        let zIndex = 50;

        if (distanceFromCenter === 0) {
          // Center item - full brightness
          opacity = 1;
          scale = 1;
          brightness = 1;
          zIndex = 100;
        } else if (distanceFromCenter === 1) {
          // Adjacent items - slightly dimmed
          opacity = 0.7;
          scale = 0.85;
          brightness = 0.8;
          zIndex = 80;
        } else if (distanceFromCenter === 2) {
          // Second tier - more dimmed
          opacity = 0.4;
          scale = 0.7;
          brightness = 0.6;
          zIndex = 60;
        } else {
          // Far items - heavily dimmed
          opacity = 0.2;
          scale = 0.6;
          brightness = 0.4;
          zIndex = 40;
        }

        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.querySelector('.bandcamp-embed-container').style.transform = 'scale(' + scale + ')';
        item.querySelector('.bandcamp-embed-container').style.filter = 'brightness(' + brightness + ')';
        item.setAttribute('data-position', distanceFromCenter);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalAlbums) % totalAlbums;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalAlbums;
      updateCarousel();
    });

    // Keyboard navigation (scoped to discography page)
    const handleKeydown = (e) => {
      if (window.location.pathname === '/sounds/discography') {
        if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + totalAlbums) % totalAlbums;
          updateCarousel();
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % totalAlbums;
          updateCarousel();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);

    // Initialize carousel
    updateCarousel();

    // Volume Control Logic
    const volumeButton = document.getElementById('volume-button');
    const volumeSliderContainer = document.getElementById('volume-slider-container');
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercentage = document.getElementById('volume-percentage');
    const volumeIcon = document.getElementById('volume-icon');
    const carouselScene = document.querySelector('.carousel-3d-scene');

    let hideTimeout;

    function updateVolumeIcon(volume) {
      if (volume === 0) {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      } else if (volume < 50) {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      } else {
        volumeIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>';
      }
    }

    function showVolumeSlider() {
      volumeSliderContainer.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        volumeSliderContainer.classList.remove('visible');
      }, 3000);
    }

    function hideVolumeSlider() {
      clearTimeout(hideTimeout);
      volumeSliderContainer.classList.remove('visible');
    }

    function toggleVolumeSlider() {
      if (volumeSliderContainer.classList.contains('visible')) {
        hideVolumeSlider();
      } else {
        showVolumeSlider();
      }
    }

    function setVolume(volume) {
      const normalizedVolume = volume / 100;
      carouselScene.style.opacity = 0.3 + (normalizedVolume * 0.7); // Keep min opacity at 0.3

      // Store volume in localStorage
      localStorage.setItem('discographyVolume', volume);
      volumePercentage.textContent = volume + '%';
      updateVolumeIcon(volume);
    }

    // Load saved volume
    const savedVolume = localStorage.getItem('discographyVolume') || 90;
    volumeSlider.value = savedVolume;
    setVolume(parseInt(savedVolume));

    volumeButton.addEventListener('click', () => {
      toggleVolumeSlider();
    });

    volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value);
      setVolume(volume);
      showVolumeSlider(); // Reset hide timer on interaction
    });

    // Keep slider visible when hovering over it
    volumeSliderContainer.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });

    volumeSliderContainer.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        volumeSliderContainer.classList.remove('visible');
      }, 1000);
    });

    // Single player logic - pause others when one plays
    const iframes = document.querySelectorAll('.bandcamp-embed-container iframe');
    let currentlyPlayingIndex = null;

    // Create observer for each iframe
    iframes.forEach((iframe, index) => {
      // Add click listener to track active player
      iframe.addEventListener('load', () => {
        iframe.contentWindow.addEventListener('click', () => {
          if (currentlyPlayingIndex !== null && currentlyPlayingIndex !== index) {
            // Attempt to pause the currently playing iframe
            // Note: This has limited cross-origin support
            const currentIframe = iframes[currentlyPlayingIndex];
            try {
              currentIframe.contentWindow.postMessage('{"method":"pause"}', '*');
            } catch (e) {
              // Cross-origin restriction, user will need to manually pause
            }
          }
          currentlyPlayingIndex = index;
        });
      });
    });

  }, 100);
}

/**
 * Render Lyrics page
 */
export function renderLyricsPage() {
  contentLoader.updateDocumentTitle('Lyrics');

  const pageContent = document.getElementById('page-content');
  pageContent.innerHTML = `
    <div class="max-w-4xl mx-auto">
      ${PageHeader.render({
        title: 'Collected Lyrics',
        subtitle: 'Song Compositions',
        description: ''
      })}

      <!-- Song Accordion -->
      <section class="mb-12">
        ${SongAccordion.render(songs)}
      </section>

      <!-- Back Navigation -->
      <div class="mt-12 text-center">
        <a href="/sounds" class="link text-lg">← Back to Sounds</a>
      </div>
    </div>
  `;

  // Attach event listeners after rendering
  SongAccordion.attachEventListeners();
}

/**
 * Render Portfolio page
 */
export function renderPortfolioPage() {
  contentLoader.updateDocumentTitle('Portfolio');
  const pageData = contentLoader.getPageData('portfolio');
  renderPlaceholderPage('Portfolio', pageData?.meta?.description || 'Professional audio portfolio and technical recordings');
}
