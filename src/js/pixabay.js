'use strict';
const API_KEY = '33237959-956d2abb27c8bf621410aa4ab';

const QUERY_BEGINING = `https://pixabay.com/api/?key=${API_KEY}&q=`;
const QUERY_ENDING = '&image_type=photo&orientation=horizontal&safesearch=true';

const fetchPhotos = async (searchString, page, perPage) => {
  const ending = `&page=${page}&per_page=${perPage}`;
  const connectionResult = await fetch(
    `${QUERY_BEGINING}${searchString}${QUERY_ENDING}${ending}`
  );
  if (!connectionResult.ok) {
    throw new Error(
      `Oops, there is some error. Error status is: ${connectionResult.status}`
    );
  } else {
    return connectionResult.json();
  }
};

export { fetchPhotos };
