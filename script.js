const scroll = () => {
    if (window.scrollY > 0 && window.scrollY < window.innerHeight) {
        document.getElementById('header').style.left = `calc(50% - ${window.scrollY * 0.6}px)`;
        document.getElementById('header').style.transform = `translate(-50%, -50%) scale(${1 - window.scrollY * 0.0005})`;
        document.getElementById('carousel').style.left = window.innerHeight - window.scrollY + 'px';
    }

    if (window.scrollY > 0)
        document.getElementById('header').style.background = "none";
    else
        document.getElementById('header').style.background = "#f5f5f5";
}

const load = () => {
    scroll();
    window.addEventListener('scroll', scroll);
}

