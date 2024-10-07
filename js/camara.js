const API_URL_ENDPOINT =
  "https://67034ce9bd7c8c1ccd40fc40.mockapi.io/api/v1/publicacion";

const previewImageContainer = document.getElementById("preview-container");
const cameraContainer = document.getElementById("camera-container");
const btnOpenCamera = document.getElementById("btn-open-camera");
const btnUploadFile = document.getElementById("btn-upload-file");
const previewImg = document.getElementById("preview-image");
const inputImage = document.getElementById("input-image");
let originalSource = null;

const reader = new FileReader();

function getIsCaptureSupported() {
  const isCaptureSupported = inputImage.capture !== undefined;
  return isCaptureSupported;
}

function getBase64Image() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const publishImg = document.createElement("img");
  publishImg.src = originalSource;
  const fullWidth = publishImg.width;
  const fullHeight = publishImg.height;

  publishImg.width = 600;
  publishImg.height = (600 * fullHeight) / fullWidth;
  canvas.width = publishImg.width;
  canvas.height = publishImg.height;

  ctx.drawImage(publishImg, 0, 0);

  return canvas.toDataURL("image/webp");
}

function handleOnChangeInputImage(event) {
  const file = event.target.files[0];

  reader.onload = (e) => {
    originalSource = e.target.result;
    previewImg.src = originalSource;
    cameraContainer.classList.add("hidden");
    previewImageContainer.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
}

function handleOnClickPublish() {
  try {
    const base64Image = getBase64Image();
    fetch(API_URL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: "Título de la imagen",
        imagen: base64Image,
        fecha: new Date().toLocaleString(),
      }),
    });
    alert("Imagen publicada con éxito");
    window.location.href = "index.html";
  } catch (error) {
    alert("Error al publicar la imagen");
  }
}

function handleOnClickRetake() {
  originalSource = null;
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

    navigator.mediaDevices.getUserMedia({
      video: {
        aspectRatio: 3 / 4, // aspect ratios may not be exactly accurate
      },
    });

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
