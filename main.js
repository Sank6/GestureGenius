const gestureMap = {
    0: 'A', 1: 'B', 2: '?', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G',
    8: 'H', 9: 'I', 10: 'J', 11: 'K', 12: 'L', 13: 'M', 14: 'N', 15: 'O',
    16: 'P', 17: 'Q', 18: 'R', 19: 'S', 20: 'T', 21: 'U', 22: 'V',
    23: 'W', 24: 'X', 25: 'Y', 26: 'Z'
};

const letters = 'abcdefghijklmnopqrstuvwxyz';
let letter = letters[Math.floor(Math.random() * letters.length)];
let time = Date.now();

// Mastery map for every letter
const masteryMap = {
    'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0, 'I': 0,
    'J': 0, 'K': 0, 'L': 0, 'M': 0, 'N': 0, 'O': 0, 'P': 0, 'Q': 0, 'R': 0, 'S': 0,
    'T': 0, 'U': 0, 'V': 0, 'W': 0, 'X': 0, 'Y': 0, 'Z': 0
};
const masteryCount = 2;
let roundTime = 10; // second

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


    document.getElementById('img').src = `/images/${letter}.png`;
    document.getElementById('overlay-text').innerText = letter.toUpperCase();

    while (true) {
        const img = await webcam.capture();
        const predictions = await handposeModel.estimateHands(img);

        if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            const flatLandmarks = [].concat(...landmarks)
            const gesture = await predictGesture(aslModel, flatLandmarks);
            document.getElementById('prediction').innerText = gesture;
            if (gesture === letter.toUpperCase() && Date.now() - time > 1500)
                success();
            else if (Date.now() - time > (roundTime * 1000))
                fail();
        }
        img.dispose();
        timer();
        await tf.nextFrame();
    }
}

const success = () => {
    let successLetter = letter.toUpperCase();
    if (masteryMap[successLetter] === masteryCount) masteredCard()
    masteryMap[successLetter] += 1;
    letter = "?";
    document.getElementById('reference-image').style.backgroundColor = '#62ae4e';
    document.getElementById('img').style.opacity = 0;
    document.getElementById('bg-text').innerText = "✓";
    time = Date.now();
    console.log(masteryMap);
    setTimeout(() => {
        document.getElementById('img').style.opacity = 1;
        const deck = [];
        for (let i = 0; i < 26; i++) {
            for (let j = masteryMap[letters[i].toUpperCase()]; j <= masteryCount; j++) deck.push(letters[i]);
        }
        letter = deck[Math.floor(Math.random() * deck.length)];
        time = Date.now();
        if (masteryMap[letter.toUpperCase()] < masteryCount) { // Show the next letter
            document.getElementById('img').src = `/images/${letter}.png`;
            document.getElementById('overlay-text').innerText = letter.toUpperCase();
        } else if (masteryMap[letter.toUpperCase()] === masteryCount) {
            document.getElementById('img').src = `/images/blank.png`;
            document.getElementById('reference-image').style.backgroundColor = '#eee';
            document.getElementById('overlay-text').innerText = letter.toUpperCase();
        } else alert("AAAAA");
    }, 1000);
}

const fail = () => {
    if (masteryMap[letter.toUpperCase()] > 0) masteryMap[letter.toUpperCase()] -= 1;
    letter = "?";
    document.getElementById('bg-text').innerText = "✗";
    document.getElementById('reference-image').style.backgroundColor = '#a72b2b';
    document.getElementById('img').style.opacity = 0;
    time = Date.now();
    setTimeout(() => {
        document.getElementById('img').style.opacity = 1;
        letter = letters[Math.floor(Math.random() * letters.length)];
        document.getElementById('img').src = `/images/${letter}.png`;
        document.getElementById('overlay-text').innerText = letter.toUpperCase();
        time = Date.now();
    }, 1000);
}

let masteredCount = 0;
const masteredCard = () => {
    masteredCount ++;
    document.getElementById('mastered-images-container').innerHTML += `<img src="/images/${letter}.png" class="mastered-image" style="top: calc(65% - ${masteredCount * 5}px)">`;
}

const predictGesture = async (model, hand) => {
    const prediction = await model.predict(tf.tensor2d([hand])).data();
    const max = prediction.indexOf(Math.max(...prediction));
    const gesture = gestureMap[max];
    return gesture;
}

const timer = () => {
    let t = ((Date.now() - time)) / (roundTime * 10);
    console.log(t);
    document.getElementById('timer').style.width = `${t}%`;
    if (t > 75) document.getElementById('timer').style.backgroundColor = '#a72b2b';
    else if (t > 50) document.getElementById('timer').style.backgroundColor = '#f5a623';
    else document.getElementById('timer').style.backgroundColor = '#62ae4e';
}