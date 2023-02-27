const load = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accuracy = parseFloat(urlParams.get('accuracy')).toFixed(0);
    document.getElementById('accuracy').innerText = accuracy;
}