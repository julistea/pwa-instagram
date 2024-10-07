const previewImageContainer = document.getElementById("preview-container");
const cameraContainer = document.getElementById("camera-container");
const btnOpenCamera = document.getElementById("btn-open-camera");
const btnUploadFile = document.getElementById("btn-upload-file");
const previewImg = document.getElementById("preview-image");
const inputImage = document.getElementById("input-image");

const reader = new FileReader();

function getIsCaptureSupported() {
  const isCaptureSupported = inputImage.capture !== undefined;
  console.log("isCaptureSupported", isCaptureSupported);
  return isCaptureSupported;
}

function getBase64Image() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.width;
  canvas.height = previewImg.height;
  ctx.drawImage(previewImg, 0, 0);

  return canvas.toDataURL("image/webp");
}

function handleOnChangeInputImage(event) {
  const file = event.target.files[0];

  reader.onload = (e) => {
    previewImg.src = e.target.result;
    cameraContainer.classList.add("hidden");
    previewImageContainer.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
}

function handleOnClickPublish() {
  const base64Image = getBase64Image();
  console.log("base64Image", base64Image);
  // Send base64Image to server
}

function handleOnClickRetake() {
  previewImg.src = "";
  previewImageContainer.classList.add("hidden");
  cameraContainer.classList.remove("hidden");
}

function init() {
  const isCaptureSupported = getIsCaptureSupported();

  if (!previewImageContainer.classList.contains("hidden")) {
    previewImageContainer.classList.add("hidden");
  }

  if (cameraContainer.classList.contains("hidden")) {
    cameraContainer.classList.remove("hidden");
  }

  if (isCaptureSupported) {
    const mobileDiv = document.getElementById("user-action-mobile");
    mobileDiv.classList.remove("hidden");

    btnOpenCamera.addEventListener("click", () => {
      inputImage.click();
    });
  } else {
    const desktopDiv = document.getElementById("user-action-desktop");
    desktopDiv.classList.remove("hidden");

    btnUploadFile.addEventListener("click", () => {
      inputImage.click();
    });
  }

  inputImage.addEventListener("change", handleOnChangeInputImage);

  const btnRetake = document.getElementById("btn-retake");
  const btnPublish = document.getElementById("btn-publish");

  btnRetake.addEventListener("click", handleOnClickRetake);
  btnPublish.addEventListener("click", handleOnClickPublish);
}

init();
