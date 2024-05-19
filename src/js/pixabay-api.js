import axios from 'axios';

export let per_page = 15;
const key = '42801696-74e6805803c5f99662f25fde0';
export async function searchServiceImg(imgSear, page = 1) {
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
    const {data} = await axios.get(`${BASE_URL}?${params}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}
