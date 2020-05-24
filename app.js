window.onload = init();

const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const metadataURL = "https://raw.githubusercontent.com/sakkshm/RecycleThis/master/metadata.json";
    const modelURL = "https://raw.githubusercontent.com/sakkshm/RecycleThis/master/model.json";
    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(500, 500, flip); // width, height, flip
    try {
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);
    } catch {
        alert("You denied access to the Camera!")
        document.getElementById("webcam-container").innerHTML = "<h2>You denied permission to access the Camera! </h2>"
    }
    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame 
    window.requestAnimationFrame(loop);
}

var allPredictions = [];
var typeOfTrash = ["Compost", "Recycle", "Landfill"];
// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    allPredictions = [];
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {

        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        console.log(classPrediction);
        allPredictions.push(prediction[i].probability.toFixed(2));

    }

    console.log(allPredictions)

    var maxProbability = Math.max(...allPredictions)
    var trash = typeOfTrash[allPredictions.indexOf(maxProbability.toString())];

    console.log(trash)

    document.getElementById("trash").innerHTML = trash;
    document.getElementById("trashType").innerHTML = trash;
    document.getElementById("probability").innerHTML = maxProbability * 100;

    $('#myModal').modal('show');
}