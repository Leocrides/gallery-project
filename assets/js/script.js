document.addEventListener('DOMContentLoaded', () =>{
    const gallery = document.querySelector('.gallery');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const thumbnailsContainer = document.querySelector('.thumbnails');

    let currentIndex = 0;
    const images = document.querySelectorAll('.gallery-img');
    const totalImages = images.length;

    function updateGallery(){
        gallery.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateThumbnails()
    }

    function nextImage(){
        currentIndex = (currentIndex + 1) % totalImages;
        updateGallery()
    }

    function prevImage(){
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateGallery();
    }

    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    images.forEach((img, index) =>{
        const thumbnail = document.createElement('img');
        thumbnail.src = img.src;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.classList.add('thumbnail');
        thumbnail.addEventListener('click', () =>{
            currentIndex = index;
            updateGallery()
        });
        thumbnailsContainer.appendChild(thumbnail);
    });

    function updateThumbnails(){
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if(index === currentIndex){
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', e =>{
        touchStartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener('touchend', e =>{
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe()
    });

    function handleSwipe(){
        if(touchStartX - touchEndX > 50){
            nextImage()
        }
        if(touchEndX - touchStartX > 50){
            prevImage()
        }
    }
    updateGallery()
    
    async function translatePage(language){
        try{
            const response = await fetch(`assets/lang/${language}.json`);
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const translations = await response.json();
            
            document.querySelectorAll('[data-i18n-key]').forEach(element =>{
                const key = element.getAttribute('data-i18n-key');
                if(translations[key]){
                    if(element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'){
                        element.placeholder = translations[key]
                    } else {
                        element.innerHTML = translations[key]
                    }
                }
            });
        } catch (e) {
            console.error('Error loading translations', e)
        }
    }
    const userLanguage = navigator.language || navigator.userLanguage;
    const language = userLanguage.startsWith('en') ? 'en' : 'pt';
    translatePage(language);
});