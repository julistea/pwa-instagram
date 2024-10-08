const API_URL_ENDPOINT =
  "https://67034ce9bd7c8c1ccd40fc40.mockapi.io/api/v1/publicacion";

const previewImageContainer = document.getElementById("preview-container");
const cameraContainer = document.getElementById("camera-container");
const btnOpenCamera = document.getElementById("btn-open-camera");
const btnUploadFile = document.getElementById("btn-upload-file");
const previewImg = document.getElementById("preview-image");
const inputImage = document.getElementById("input-image");
const inputTitle = document.getElementById("input-title");

const reader = new FileReader();

function getIsCaptureSupported() {
  const isCaptureSupported = inputImage.capture !== undefined;
  return isCaptureSupported;
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

function postImage({ titulo, imagen }) {
  const url = new URL(API_URL_ENDPOINT);
  url.searchParams.append("sortBy", "fecha");
  url.searchParams.append("order", "desc");
  fetch(API_URL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo,
      imagen,
      fecha: new Date().toLocaleString(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.hasOwnProperty("id")) {
        alert("Imagen publicada con éxito");
        window.location.href = "index.html";
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      alert("Ocurrió un error al publicar la imagen");
    });
}

function handleOnClickPublish() {
  try {
    const title = inputTitle.value;
    if (!title) {
      alert("Por favor, ingrese un título");
      return;
    }

    if (!navigator.onLine) {
      alert("No hay conexión a internet, inténtalo más tarde");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const publishImg = new Image();
    publishImg.onload = () => {
      const expectedWidth = 450;
      const expectedHeight =
        (450 * previewImg.naturalHeight) / previewImg.naturalWidth;
      publishImg.width = expectedWidth;
      publishImg.height = expectedHeight;
      canvas.width = expectedWidth;
      canvas.height = expectedHeight;

      ctx.drawImage(publishImg, 0, 0, expectedWidth, expectedHeight);

      postImage({ titulo: title, imagen: canvas.toDataURL("image/webp") });
    };
    publishImg.src = previewImg.src;
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al publicar la imagen");
  }
}

function handleOnClickRetake() {
  previewImg.src = "";
  previewImageContainer.classList.add("hidden");
  cameraContainer.classList.remove("hidden");
}

function updatePublishButtonState() {
  const publishBtn = document.getElementById("btn-publish");

  if (navigator.onLine) {
    publishBtn.disabled = false;
    publishBtn.textContent = "Publicar";
  } else {
    publishBtn.disabled = true;
    publishBtn.textContent = "Sin conexión";
  }
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

    updatePublishButtonState();

    window.addEventListener("online", updatePublishButtonState);
    window.addEventListener("offline", updatePublishButtonState);

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
