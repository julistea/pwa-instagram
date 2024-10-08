const API_URL_ENDPOINT =
  "https://67034ce9bd7c8c1ccd40fc40.mockapi.io/api/v1/publicacion";

const defaultCard = document.getElementById("reel-item-default");

const publicationComponent = ({ id, titulo, imagen, fecha }) => `<article
            id="reel-item-${id}-${fecha.slice(0, -4)}"
            class="box-content w-72 md:w-96 p-4 border border-slate-300 shadow-md"
          >
            <figure class="mb-2">
              <figcaption class="mb-2 text-slate-700">
                ${titulo}
              </figcaption>
              <picture class="image-wrapper">
                <img
                  src="${imagen}"
                  alt="Publicación: ${titulo}"
                  class="image-preview w-72 h-[384px] md:w-96 md:h-[512px]"
                />
              </picture>
            </figure>
            <p><span class="text-slate-500 font-light">${fecha}</span></p>
          </article>`;

const dividerComponent = '<hr class="bg-slate-200 mx-12 my-4 shadow-md" />';

async function getPublications() {
  const response = await fetch(API_URL_ENDPOINT);
  const publications = await response.json();
  return publications;
}

function drawPublications(cards) {
  const reel = document.getElementById("reel-container");
  reel.innerHTML = cards.join(dividerComponent);
}

async function init() {
  const publications = await getPublications();

  if (!publications.length) {
    defaultCard.classList.remove("hidden");
    return;
  }

  const publicationsCards = publications.map(publicationComponent);

  drawPublications(publicationsCards);
}

init();
