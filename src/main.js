import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { creatMarkup } from './js/render-functions.js';
import { searchServiceImg, per_page } from './js/pixabay-api.js';

let page = 1;
let elem = document.querySelector('ul');
const refs = {
  formEl: document.querySelector('.form-search'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  readMore: document.querySelector('.read-more'),
};

refs.formEl.addEventListener('submit', onSearchImg);
per_page;
async function onSearchImg(evt) {
  evt.preventDefault();
  page = 1;
  refs.readMore.classList.add('loader-none');
  const nameSearch = evt.target[0].value.trim();
  localStorage.setItem('nameImg', JSON.stringify(nameSearch));
  const nameImgGet = localStorage.getItem('nameImg');
  const imgSear = JSON.parse(nameImgGet);
  refs.loader.classList.remove('loader-none');

  refs.gallery.innerHTML = '';
  try {
    const data = await searchServiceImg(imgSear, page);

    if (data.totalHits < per_page) {
      refs.readMore.classList.add('loader-none');
      refs.loader.classList.add('loader-none');
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topCenter',
      });
      refs.gallery.innerHTML = creatMarkup(data.hits);
      lightbox.refresh();
      return;
    }
    if (creatMarkup(data.hits) == []) {
      refs.loader.classList.add('loader-none');
      refs.readMore.classList.add('loader-none');
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topCenter',
      });
      this.reset();
    } else {
      refs.readMore.addEventListener('click', onClickReadMore);
      refs.loader.classList.add('loader-none');
      refs.readMore.classList.remove('loader-none');
      refs.gallery.innerHTML = creatMarkup(data.hits);
      lightbox.refresh();

      this.reset();
    }
  } catch (er) {
    console.log(er);
  }
}

async function onClickReadMore() {
  const nameInput = JSON.parse(localStorage.getItem('nameImg'));
  refs.loader.classList.remove('loader-none');
  refs.readMore.classList.add('loader-none');
  page += 1;
  try {
    const data = await searchServiceImg(nameInput, page);
    refs.gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));
    let rect = elem.getBoundingClientRect();
    window.scrollBy({
      top: rect.bottom * 2,
      left: rect.x * 2,
      behavior: 'smooth',
    });
    refs.loader.classList.add('loader-none');
    lightbox.refresh();
    refs.readMore.classList.remove('loader-none');
    const totalPage = Math.ceil(data.totalHits / per_page);
    if (page >= totalPage) {
      refs.readMore.classList.add('loader-none');
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topCenter',
      });
    }
  } catch (er) {
    console.log(er);
  }
}

let lightbox = new SimpleLightbox('.gallery a', {
  animationSpeed: 1000,
  captionDelay: 250,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionText: 'description',
  history: false,
  swipeClose: true,
  close: true,
});
