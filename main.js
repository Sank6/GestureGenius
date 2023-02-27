
const load = async () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('video');
            video.srcObject = stream;
        })
        .catch(error => {
            console.log('Unable to access camera:', error);
        });

    const model = await tf.loadLayersModel('/model.json');
    const webcam = await tf.data.webcam(document.getElementById('video'));
    const prediction = document.getElementById('prediction');
    
    while (true) {
        const img = await webcam.capture();
        const processedImg = tf.tidy(() => {
            return img.expandDims(0).toFloat().div(127).sub(1);
        });
        const result = await model.predict(processedImg).data();
        const output = result[0] > result[1] ? '👍' : '👎';
        prediction.innerText = `Prediction: ${output}`;
        img.dispose();
        await tf.nextFrame();
    }
}

