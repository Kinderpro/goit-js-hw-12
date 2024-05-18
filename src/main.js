import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { creatMarkup } from './js/render-functions.js';
// import { searchServiceImg } from './js/pixabay-api.js';
import axios from 'axios';

let page;
let per_page = 15;
let totalHits = 1;

const key = '42801696-74e6805803c5f99662f25fde0';
let elem = document.querySelector('ul');
const refs = {
  formEl: document.querySelector('.form-search'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  readMore: document.querySelector('.read-more'),
};

refs.formEl.addEventListener('submit', onSearchImg);

async function onSearchImg(evt) {
  evt.preventDefault();
  page = 1;
  refs.readMore.classList.add('loader-none');
  const nameSearch = evt.target[0].value;
  localStorage.setItem('nameImg', JSON.stringify(nameSearch));
  const nameImgGet = localStorage.getItem('nameImg');
  const imgSear = JSON.parse(nameImgGet);
  refs.loader.classList.remove('loader-none');

  refs.gallery.innerHTML = '';
  await searchServiceImg(imgSear)
    .then(data => {
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
    })
    .catch(er => {
      refs.loader.classList.add('loader-none');
      console.log(er);
    });
}

async function onClickReadMore() {
  const nameInput = JSON.parse(localStorage.getItem('nameImg'));
  //   const nameInput = refs.formEl.elements[0].value;
  refs.loader.classList.remove('loader-none');
  refs.readMore.classList.add('loader-none');
  page += 1;

  await searchServiceImg(nameInput)
    .then(data => {
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
    })
    .catch(er => {
      console.log(er);
    });
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

async function searchServiceImg(imgSear) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key,
    q: imgSear,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: per_page,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
