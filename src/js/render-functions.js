export function creatMarkup(arr) {
    return arr
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<li class="card">
        <a href="${largeImageURL}"><img class="img-card" src="${webformatURL}" alt="${tags}" title="${tags}" ></a>
        <div class="description"><p>Likes: ${likes}</p> <p>Views: ${views}</p>
        <p>Comments: ${comments}</p>
        <p>Downloads: ${downloads}</p></li>
   </div>`
      )
      .join('');

  }