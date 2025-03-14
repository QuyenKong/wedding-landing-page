// Music Player
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');
let isPlaying = false;

// Function to start playing music
function playMusic() {
    // Add playing class before attempting to play
    musicToggle.classList.add('playing');
    
    backgroundMusic.play().then(() => {
        isPlaying = true;
    }).catch(error => {
        console.log("Audio playback failed:", error);
        // Remove playing class if music fails to play
        musicToggle.classList.remove('playing');
    });
}

// Function to pause music
function pauseMusic() {
    backgroundMusic.pause();
    musicToggle.classList.remove('playing');
    isPlaying = false;
}

// Function to toggle music
function toggleMusic() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// Add click event listener to music toggle button
musicToggle.addEventListener('click', toggleMusic);

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
        pauseMusic();
    } else if (!document.hidden && !isPlaying) {
        playMusic();
    }
});

// Start playing after 200ms delay
setTimeout(() => {
    // Start rotating button and playing music
    playMusic();
}, 200);

// Countdown Timer
const weddingDate = new Date('2025-03-22T09:00:00+07:00');

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Gallery Images with Intersection Observer for smooth loading
// Row 1: 2 portraits
const row1Images = [
    'res/img/avatar/Portrait1.JPG',  // Portrait 1
    'res/img/avatar/Portrait2.JPG'   // Portrait 2
];

// Row 2: 1 portrait + 2 landscapes
const row2Images = [
    'res/img/avatar/Portrait3.JPG',  // Portrait 3
    'res/img/avatar/Landscape1.JPG',  // Landscape 1
    'res/img/avatar/Landscape2.JPG'   // Landscape 2
];

// Row 3: 2 portraits
const row3Images = [
    'res/img/avatar/Portrait6.JPG',  // Portrait 4
    'res/img/avatar/Portrait7.JPG'   // Portrait 5
];

const galleryImages = [...row1Images, ...row2Images, ...row3Images];

const galleryGrid = document.getElementById('gallery-grid');

// Create and configure Intersection Observer
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const item = entry.target;
            const img = item.querySelector('img');
            
            // Tối ưu loading ảnh
            if (img.dataset.src) {
                // Preload ảnh trước khi hiển thị
                const tempImg = new Image();
                tempImg.src = img.dataset.src;
                tempImg.onload = () => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    
                    // Thêm class visible sau khi ảnh đã load
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 100); // Giảm delay xuống để animation mượt hơn
                };
            } else {
                item.classList.add('visible');
            }
            
            observer.unobserve(item);
        }
    });
}, {
    threshold: 0.1, // Giảm threshold để load sớm hơn
    rootMargin: '50px'
});

// Create and add gallery items with lazy loading
galleryImages.forEach((imagePath, index) => {
    // Create landscape stack for middle row landscapes
    if (index === 3) {
        const landscapeStack = document.createElement('div');
        landscapeStack.className = 'landscape-stack';
        
        // Create and add both landscape images
        for (let i = 0; i < 2; i++) {
            const landscapeItem = document.createElement('div');
            landscapeItem.className = 'gallery-item landscape';
            
            const img = document.createElement('img');
            img.dataset.src = galleryImages[index + i];
            img.alt = 'Wedding Gallery Image';
            img.loading = 'lazy';
            
            landscapeItem.appendChild(img);
            landscapeStack.appendChild(landscapeItem);
            imageObserver.observe(landscapeItem);
        }
        
        galleryGrid.appendChild(landscapeStack);
        return;
    }
    
    // Skip the second landscape image as it's already added
    if (index === 4) return;
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.dataset.src = imagePath;
    img.alt = 'Wedding Gallery Image';
    img.loading = 'lazy';
    
    galleryItem.appendChild(img);
    galleryGrid.appendChild(galleryItem);
    imageObserver.observe(galleryItem);
});

// Preload adjacent images when hovering over a gallery item
let preloadTimeout;
const preloadImage = (src) => {
    const img = new Image();
    img.src = src;
};

galleryGrid.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    
    clearTimeout(preloadTimeout);
    preloadTimeout = setTimeout(() => {
        const index = Array.from(galleryGrid.children).indexOf(item);
        if (index > 0) preloadImage(galleryImages[index - 1]);
        if (index < galleryImages.length - 1) preloadImage(galleryImages[index + 1]);
    }, 100);
});

// Lightbox functionality
function openLightbox(imagePath) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const img = document.createElement('img');
    img.src = imagePath;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    
    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
    
    // Close lightbox events
    closeBtn.onclick = closeLightbox;
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    };
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

// Add lightbox styles
const style = document.createElement('style');
style.textContent = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .lightbox img {
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
    }
    
    .lightbox-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Calendar functionality
function createCalendar() {
    const calendarDays = document.querySelector('.calendar-days');
    const weddingDate = new Date(2025, 2, 22); // March 22, 2025
    const firstDay = new Date(2025, 2, 1);
    const lastDay = new Date(2025, 2, 31);
    let firstDayWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Adjust to make Monday the first day (0) - move Sunday to end of week
    firstDayWeek = firstDayWeek === 0 ? 6 : firstDayWeek - 1;

    // Clear previous calendar
    calendarDays.innerHTML = '';

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= 31; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const daySpan = document.createElement('span');
        daySpan.textContent = day;
        dayElement.appendChild(daySpan);

        if (day === 22) {
            dayElement.classList.add('wedding-day');
            dayElement.setAttribute('data-aos', 'zoom-in');
            dayElement.setAttribute('data-aos-delay', '500');
        }

        calendarDays.appendChild(dayElement);
    }
}

// Initialize calendar and animations
function initializeDateDisplay() {
    const dateElements = document.querySelectorAll('.date-display > div');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, entry.target.classList.contains('month-display') ? 0 : 
                   entry.target.classList.contains('day-display') ? 200 : 400);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    dateElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize calendar
createCalendar();
initializeDateDisplay();

// Calendar animation on scroll
const calendarContainer = document.querySelector('.calendar-container');
const weddingDay = document.querySelector('.wedding-day');

const calendarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            calendarContainer.classList.add('visible');
            
            // Add delay before highlighting the wedding day
            setTimeout(() => {
                weddingDay.classList.add('highlight');
            }, 1000);
            
            calendarObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '0px'
});

calendarObserver.observe(calendarContainer);

// RSVP Form handling
const rsvpForm = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');

function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${isError ? 'error' : 'success'}`;
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading message
    showMessage('Đang gửi thông tin...');
    
    // Disable submit button
    const submitButton = rsvpForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Đang gửi...';

    // Get form data
    const formData = new FormData(rsvpForm);
    const data = {
        timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        name: formData.get('name'),
        phone: formData.get('phone'),
        attending: formData.get('attending'),
        guests: formData.get('guests'),
        message: formData.get('message') || 'Không có lời nhắn'
    };

    try {
        // Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzPaRI_5DD8NcXfliSxTTj1ojro2x9T_xVumQByLeMFoQsKOi778s73UbdN1m4aD3z8BQ/exec';
        
        // Send data to Google Sheets
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Form submitted successfully');
        
        // Clear form
        rsvpForm.reset();
        
        // Show success message
        showMessage('Cảm ơn bạn đã xác nhận tham dự! Chúng tôi rất mong được gặp bạn trong ngày trọng đại.');
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi.', true);
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Gửi';
    }
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        background: var(--accent-color);
        color: white;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.error {
        background: #dc3545;
    }
`;
document.head.appendChild(notificationStyle);

// Map buttons
document.querySelectorAll('.map-button').forEach(button => {
    button.addEventListener('click', () => {
        const location = button.dataset.location || 'Wedding Venue';
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    });
});

// Fix 100vh issue on mobile browsers
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial set
setVH();

// Update on resize and orientation change
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

// Tối ưu scroll performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const items = document.querySelectorAll('.gallery-item');
            items.forEach((item) => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const scrolled = window.pageYOffset;
                    const speed = 0.02; // Giảm tốc độ parallax
                    const yPos = -(scrolled * speed);
                    item.style.transform = `translateY(${yPos}px)`;
                }
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Thêm lazy loading cho gallery
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item) => {
        imageObserver.observe(item);
    });
});