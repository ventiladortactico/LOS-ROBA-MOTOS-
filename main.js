// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.add('hidden');
    });
});

// Lazy load animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

function setupLazyLoad() {
    document.querySelectorAll('.lazy-load').forEach(el => {
        observer.observe(el);
    });
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeBtn = document.getElementById('close-lightbox');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const counter = document.getElementById('lightbox-counter');

let allMedia = [];
let currentIndex = 0;

function buildMediaArray() {
    allMedia = [];
    // Combine photos and videos from galleryData
    if (typeof galleryData !== 'undefined') {
        galleryData.photos.forEach((photo, index) => {
            allMedia.push({
                type: 'image',
                src: photo.src,
                alt: photo.title || `Foto ${index + 1}`
            });
        });
        galleryData.videos.forEach((video) => {
            allMedia.push({
                type: 'video',
                src: video.src,
                alt: video.title || 'Video'
            });
        });
    }
}

function openLightbox(index) {
    currentIndex = index;
    const media = allMedia[index];
    const backgroundMusic = document.getElementById('bg-music');
    
    if (media.type === 'image') {
        lightboxImg.src = media.src;
        lightboxImg.alt = media.alt;
        lightboxImg.classList.remove('hidden');
        lightboxVideo.classList.add('hidden');
        lightboxVideo.pause();
        // Restaurar volumen
        if (backgroundMusic) backgroundMusic.volume = 1.0;
    } else {
        lightboxVideo.src = media.src;
        lightboxVideo.classList.remove('hidden');
        lightboxImg.classList.add('hidden');
        lightboxVideo.play();
        // Bajar volumen de la música de fondo cuando hay video
        if (backgroundMusic) backgroundMusic.volume = 0.1; 
    }
    
    counter.textContent = `${index + 1} / ${allMedia.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const backgroundMusic = document.getElementById('bg-music');
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    document.body.style.overflow = '';
    // Restaurar volumen al cerrar
    if (backgroundMusic) backgroundMusic.volume = 1.0;
}

function nextMedia() {
    if (allMedia.length === 0) return;
    currentIndex = (currentIndex + 1) % allMedia.length;
    openLightbox(currentIndex);
}

function prevMedia() {
    if (allMedia.length === 0) return;
    currentIndex = (currentIndex - 1 + allMedia.length) % allMedia.length;
    openLightbox(currentIndex);
}

// Initialize gallery
function initGallery() {
    const photoContainer = document.getElementById('photo-grid');
    const videoContainer = document.getElementById('video-grid');
    
    if (!photoContainer || typeof galleryData === 'undefined') return;

    // Clear existing
    photoContainer.innerHTML = '';
    
    galleryData.photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'photo-grid-item rounded-2xl lazy-load card-hover';
        item.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;
        item.addEventListener('click', () => openLightbox(index));
        photoContainer.appendChild(item);
    });

    if (videoContainer) {
        videoContainer.innerHTML = '';
        galleryData.videos.forEach((video, index) => {
            const item = document.createElement('div');
            item.className = 'video-grid-item rounded-2xl lazy-load card-hover';
            item.innerHTML = `
                <video muted loop playsinline>
                    <source src="${video.src}" type="video/mp4">
                </video>
                <div class="play-icon">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-10">
                    <h3 class="text-xl font-bold mb-2">${video.title}</h3>
                    <p class="text-gray-300 text-sm">${video.date}</p>
                </div>
            `;
            item.addEventListener('click', () => openLightbox(galleryData.photos.length + index));
            videoContainer.appendChild(item);
        });
    }

    buildMediaArray();
    setupLazyLoad();
}

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
if (nextBtn) nextBtn.addEventListener('click', nextMedia);
if (prevBtn) prevBtn.addEventListener('click', prevMedia);

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextMedia();
    if (e.key === 'ArrowLeft') prevMedia();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Run init
document.addEventListener('DOMContentLoaded', () => {
    initGallery();

    // Music Toggle Logic
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicWave = document.getElementById('music-wave');
    let isPlaying = false;

    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicWave.classList.add('hidden');
                musicToggle.classList.remove('animate-pulse');
            } else {
                bgMusic.play().catch(e => console.log("Audio play blocked by browser"));
                musicWave.classList.remove('hidden');
                musicToggle.classList.add('animate-pulse');
            }
            isPlaying = !isPlaying;
        });
    }

    // Confetti Effect
    const fireConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0ea5e9', '#38bdf8', '#ffffff']
        });
    };

    // Hero Buttons Logic
    const btnGaleria = document.getElementById('btn-galeria');
    const btnRandom = document.getElementById('btn-random');

    if (btnGaleria) {
        btnGaleria.addEventListener('click', () => {
            fireConfetti();
            document.querySelector('#galeria').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnRandom) {
        btnRandom.addEventListener('click', () => {
            fireConfetti();
            if (allMedia.length > 0) {
                const randomIndex = Math.floor(Math.random() * allMedia.length);
                openLightbox(randomIndex);
            }
        });
    }
});