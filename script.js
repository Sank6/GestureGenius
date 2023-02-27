const scroll = () => {
    if (window.scrollY > 0 && window.scrollY < window.innerHeight) {
        document.getElementById('header').style.position = 'fixed';
        document.getElementById('header').style.top = '50%';
        document.getElementById('header').style.left = `calc(50% - ${window.scrollY * 0.6}px)`;
        document.getElementById('header').style.transform = `translate(-50%, -50%) scale(${1 - window.scrollY * 0.0005})`;
        document.getElementById('carousel').style.left = window.innerHeight - window.scrollY + 'px';

        document.getElementById('icon').style.opacity = 1 - window.scrollY * 0.004;
    }

    if (window.scrollY > window.innerHeight) {
        document.getElementById('header').style.position = 'absolute';
        document.getElementById('header').style.top = `calc(100vh + 50%)`;
    }
}

const load = () => {
    scroll();
    window.addEventListener('scroll', scroll);
}

