import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputRef = document.getElementById('search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const country = e.target.value.trim();

  if (!country) {
    e.target.value = '';
    clearMarkup(countryInfoRef);
    clearMarkup(countryListRef);
    return;
  }

  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        displayMarkup(data);
      }
    })
    .catch(error => {
      if (error.message === '404') {
        clearMarkup(countryInfoRef);
        clearMarkup(countryListRef);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}

function displayMarkup(data) {
  if (data.length === 1) {
    const markup = data.reduce(
      (markup, country) => markup + createMarkupForCounty(country),
      ''
    );
    clearMarkup(countryListRef);
    countryInfoRef.innerHTML = markup;
  } else {
    const list = data.reduce(
      (markup, country) => markup + createMarkupForCounties(country),
      ''
    );
    clearMarkup(countryInfoRef);
    countryListRef.innerHTML = list;
  }
}

function createMarkupForCounties({ name, flags }) {
  return `<li><img src =${flags.svg} alt='flags of ${name.official}' width=60 height=40/><p>${name.official}</p></li>`;
}

function createMarkupForCounty({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  return `<img src =${flags.svg} alt='flags of ${
    name.official
  }' width=100% height=80/> <p>${name.official}</p>
	<ul class="porps"><li>Capital: ${capital}</li><li>Population: ${population}</li><li>Languages: ${Object.values(
    languages
  )}</li>
	</ul>`;
}

function clearMarkup(element) {
  return (element.innerHTML = '');
}
