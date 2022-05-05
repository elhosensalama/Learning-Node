const [prevBtn, nextBtn] = [...document.querySelectorAll(".nav-btn")];
const bigWhiteScreen = document.querySelector(".big-white-screen");
const slides = [...document.querySelectorAll(".slide")];
const slidesCount = slides.length;
console.log(slidesCount);
let index = 0;

const startNavigation = () => {
    if (index == 0){
        prevBtn.classList.add('not-active');
        nextBtn.addEventListener('click', () => {
            nextBtn.textContent = 'Next';
            index++;
            console.log(slides[index]);
            
        });
    }
    else if (index == slidesCount) {
        nextBtn.classList.add('not-active');
    }
    else {
        prevBtn.classList.remove('not-active');
        nextBtn.classList.remove('not-active');
    }
};


if (bigWhiteScreen) {
    startNavigation();
}