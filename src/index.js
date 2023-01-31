'use strict';
import { fetchPhotos } from './js/pixabay';
import { Notify } from 'notiflix';
const notify = Notify.success;
const alert = Notify.failure;
const PER_PAGE = 40;

window.onload = () => {
  let pageCount = 1;
  let totalHits = 0;
  let searchQuery = '';

  document.querySelector('.search-fieldset').toggleAttribute('disabled');
  const searchForm = document.querySelector('#search-form');
  const galleryContainer = document.querySelector('.gallery');
  const expandButton = document.querySelector('.expand-button');

  const parseToPixabayQuery = searchText => {
    return searchText.replace(' ', '+');
  };

  const clearPhotos = () => {
    galleryContainer.innerHTML = '';
  };

  const getPhotoInfoElement = photo => {
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info');
    const infoKeys = ['Likes', 'Views', 'Comments', 'Downloads'];
    infoKeys.forEach(key => {
      const keyParagraph = document.createElement('p');
      keyParagraph.classList.add('info-item');
      const label = document.createElement('b');
      label.textContent = key;
      const content = document.createElement('span');
      content.textContent = photo[key.toLowerCase()];
      keyParagraph.appendChild(label);
      keyParagraph.appendChild(content);
      infoContainer.appendChild(keyParagraph);
    });
    return infoContainer;
  };

  const getPhotoElement = photo => {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('photo-card');
    const cardImage = document.createElement('img');
    cardImage.setAttribute('src', photo.webformatURL);
    cardImage.setAttribute('alt', `Picture with id: ${photo.id}`);
    cardImage.setAttribute('loading', 'lazy');
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(getPhotoInfoElement(photo));
    return cardContainer;
  };

  const loadPhotos = photos => {
    photos.forEach(photo => {
      galleryContainer.append(getPhotoElement(photo));
    });
  };

  const handleSearch = searchResult => {
    clearPhotos();
    totalHits = searchResult.totalHits;
    if (totalHits > 0) {
      notify(`Hooray! We found ${totalHits} images.`);
      pageCount++;
      if (totalHits > PER_PAGE) {
        expandButton.style.display = 'block';
      } else {
        expandButton.style.display = 'none';
      }
      loadPhotos(searchResult.hits);
    } else {
      expandButton.style.display = 'none';
      alert(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  };

  const handleExpand = expandResult => {
    if (totalHits - pageCount * PER_PAGE < 0) {
      expandButton.style.display = 'none';
      notify('There are no more pictures');
    }
    pageCount++;
    loadPhotos(expandResult.hits);
  };

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const searchText = e.target.elements['searchQuery'].value;
    if (searchText.length > 0) {
      pageCount = 1;
      totalHits = 0;
      searchQuery = parseToPixabayQuery(searchText);
      fetchPhotos(searchQuery, pageCount, PER_PAGE)
        .then(handleSearch)
        .catch(e => alert(`${e}`));
    } else {
      searchQuery = '';
      expandButton.style.display = 'none';
      clearPhotos();
    }
  });

  expandButton.addEventListener('click', () => {
    fetchPhotos(searchQuery, pageCount, PER_PAGE)
      .then(handleExpand)
      .catch(e => alert(`${e}`));
  });
};
