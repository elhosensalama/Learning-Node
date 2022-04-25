const spinner = document.getElementById("spinner");

const hide = (element, time) => {
    setTimeout(() => {
        element.style.display = "none";
    }, time * 1000);
};

if (spinner) {
    hide(spinner, 2);
}

const searchBox = document.querySelector(".search-box");

if (searchBox) {
    searchBox.addEventListener("click", (e) => {
        const elemtent = [...e.target.classList];
        if (elemtent[0] == "icofont-search") {
            document.querySelector(".search-box input").toggleAttribute("class");
            document.querySelector(".search-box i").style.border = "none";
            document.querySelector(".search-box input").style.animation = " 0.5s fadeIn 1 linear";
        }
    });
}

const headerBody = document.querySelector(".header-body");
if (headerBody) {
    let headerHeight = document.querySelector("header");
    let navHeight = document.querySelector("nav");
    headerBody.style.height = `${headerHeight.clientHeight - navHeight.clientHeight}px`;
    const left = document.querySelector(".header-body .left");
    const right = document.querySelector(".header-body .right");
    if (left && right) {
        left.style.height = `${headerHeight.clientHeight - navHeight.clientHeight}px`;
        right.style.height = `${headerHeight.clientHeight - navHeight.clientHeight}px`;
    }
}

const notActiveBtn = document.querySelector("a.not-active");
if (notActiveBtn) {
    notActiveBtn.addEventListener("click", (e) => {
        e.preventDefault();
    });
}

const terminals = [...document.querySelectorAll(".terminal")];
if (terminals) {
    terminals.forEach((term) => {
        const terminalHead = `
            <div class="terminal-head center">
                <div class="left-icon">
                    <i class="icofont-plus-square icon-squre"></i>
                </div>
                <div class="middle">elhosen@elhosen-fedora ~</div>
                <div class="right-icons">
                    <i class="icofont-search-1 icon-squre"></i>
                    <i class="icofont-navigation-menu icon-squre"></i>
                    <i class="icofont-minus"></i>
                    <i class="icofont-square"></i>
                    <i class="icofont-square floating-squre"></i>
                    <i class="icofont-close"></i>
                </div>
            </div>`;
        term.insertAdjacentHTML("afterbegin", terminalHead);
    });
}

const editors = [...document.querySelectorAll(".editor")];
if (editors) {
    editors.forEach((editor) => {
        const fileName = editor.getAttribute("data-file");
        const editorHead = `
            <div class="editor-head center">
                <div class="left-side">
                    <i class="icofont-disc"></i>
                    <i class="icofont-disc"></i>
                    <i class="icofont-disc"></i>
                </div>
                <div class="middle-side">
                    ${fileName}
                </div>
                <div class="right-side"></div>
            </div>`;
        editor.insertAdjacentHTML("afterbegin", editorHead);
    });
}

const qooutes = [...document.querySelectorAll(".qooute")];
if (qooutes) {
    qooutes.forEach((qooute) => {
        const content = qooute.getAttribute("data-content");
        const qoouteHTML = `<i class="icofont-rounded-double-left orangee"></i> ${content} <i class="icofont-rounded-double-right orangee"></i>`;
        qooute.insertAdjacentHTML("afterbegin", qoouteHTML);
    });
}

// Slider
let slideIndex = 0;
let slideIndex2 = 0;
const dots = document.querySelectorAll(".dot");
const dots2 = document.querySelectorAll(".dot2");

const startSyncSlider = document.getElementById("startSyncSlider");
const startAsyncSlider = document.getElementById("startAsyncSlider");

if (startSyncSlider) {
    startSyncSlider.addEventListener("click", (e) => {
        showSlides(1);
        startSyncSlider.style.display = "none";
    });
}
if (startAsyncSlider) {
    startAsyncSlider.addEventListener("click", (e) => {
        showSlides(2);
        startAsyncSlider.style.display = "none";
    });
}
// Thumbnail image controls

function currentSlide(slide, n) {
    if (slide == 1) showSlides(1, (slideIndex = n));
    else showSlides(2, (slideIndex2 = n));
}

function showSlides(slide) {
    let i, slides;
    if (slide == 1) slides = document.getElementsByClassName("mySlides");
    else slides = document.getElementsByClassName("mySlides2");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slide == 1) {
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 0;
            slides[0].style.display = "block";
            startSyncSlider.style.display = "inline";
            dots.forEach((dot) => {
                dot.classList.remove("active");
                console.log(dot);
            });
            dots[0].classList.add("active");
            return ;
            return ;
        }
        dots.forEach((dot) => {
            dot.classList.remove("active");
            console.log(dot);
        });
        dots[slideIndex - 1].classList.add("active");
        slides[slideIndex - 1].style.display = "block";
        setTimeout( () => {showSlides(1)}, 2000); // Change image every 2 seconds    
    } else {
        slideIndex2++;
        if (slideIndex2 > slides.length) {
            slideIndex2 = 0;
            slides[0].style.display = "block";
            startAsyncSlider.style.display = "inline";
            dots2.forEach((dot) => {
                dot.classList.remove("active");
                console.log(dot);
            });
            dots2[0].classList.add("active");
            return ;
        }
        dots2.forEach((dot) => {
            dot.classList.remove("active");
            console.log(dot);
        });
        dots2[slideIndex2 - 1].classList.add("active");
        slides[slideIndex2 - 1].style.display = "block";
        setTimeout(() => {showSlides(2)}, 2000); // Change image every 2 seconds
    }
}
