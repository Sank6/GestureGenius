const gestureMap = {
    0: 'A', 1: 'B', 2: '?', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G',
    8: 'H', 9: 'I', 10: 'J', 11: 'K', 12: 'L', 13: 'M', 14: 'N', 15: 'O',
    16: 'P', 17: 'Q', 18: 'R', 19: 'S', 20: 'T', 21: 'U', 22: 'V',
    23: 'W',24: 'X',25: 'Y', 26: 'Z'
};

const load = async () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => document.getElementById('video').srcObject = stream)
        .catch(console.error);

    const handposeModel = await handpose.load();
    console.log('Handpose Model loaded');
    const aslModel = await tf.loadLayersModel('/model/model.json');
    console.log('ASL Model loaded');
    const webcam = await tf.data.webcam(document.getElementById('video'));
    console.log('Webcam loaded');

    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let letter = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById('img').src = `/images/${letter}.png`;
    document.getElementById('overlay-text').innerText = letter.toUpperCase();
    let time = Date.now();

    while (true) {
        const img = await webcam.capture();
        const predictions = await handposeModel.estimateHands(img);

        if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            const flatLandmarks = [].concat(...landmarks);
            const gesture = await predictGesture(aslModel, flatLandmarks);
            document.getElementById('prediction').innerText = gesture;

            if (gesture === letter.toUpperCase() && Date.now() - time > 500) {
                letter = "?";
                document.getElementById('reference-image').style.backgroundColor = '#62ae4e';
                document.getElementById('img').style.opacity = 0;
                time = Date.now();
                setTimeout(() => {
                    document.getElementById('img').style.opacity = 1;
                    letter = letters[Math.floor(Math.random() * letters.length)];
                    document.getElementById('img').src = `/images/${letter}.png`;
                    document.getElementById('overlay-text').innerText = letter.toUpperCase();
                }, 1000);
            } else if (Date.now() - time > 10000) {
                letter = "?";
                document.getElementById('bg-text').innerText = "✗";
                document.getElementById('reference-image').style.backgroundColor = '#a72b2b';
                document.getElementById('img').style.opacity = 0;
                time = Date.now();
                setTimeout(() => {
                    document.getElementById('img').style.opacity = 1;
                    document.getElementById('bg-text').innerText = "✓";
                    letter = letters[Math.floor(Math.random() * letters.length)];
                    document.getElementById('img').src = `/images/${letter}.png`;
                    document.getElementById('overlay-text').innerText = letter.toUpperCase();
                }, 1000);
            }
        }

        img.dispose();
        await tf.nextFrame();
    }
}

const predictGesture = async (model, hand) => {
    const prediction = await model.predict(tf.tensor2d([hand])).data();
    const max = prediction.indexOf(Math.max(...prediction));
    const gesture = gestureMap[max];
    return gesture;
}