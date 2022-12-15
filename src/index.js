import './css/styles.css';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(searchCountryByName, DEBOUNCE_DELAY))

function searchCountryByName() {
    const name = inputSearch.value.trim();
    if (name === '') {
        return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
    }

    fetchCountries(name)
        .then((countries) => {
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';

            if (countries.length === 1) {
                countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
                countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
               
            }
            
           
            else if (countries.length >= 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else {
                countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
            }

        })
        .catch((Error) => {
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
            Notiflix.Notify.failure('Oops, there is no country with that name')
})
    
}

function renderCountryInfo(countries) {
    const markup = countries
        .map(({ name, flags, capital, population, languages }) => {
            return `<ul class='country-list__info'>
            <h3 class='country-list__capital'><b>Capital: </b>${capital}</h3>
            <h3 class='country-list__population'><b>Population: </b>${population}</h3>
            <h3 class='country-list__languages'><b>Languages: </b>${Object.values(languages)}</h3>
            </ul>`;
        })
        .join('');
    return markup
}

function renderCountryList(countries) {
    const markup = countries
        .map(({ name, flags }) => {
            return `<li class='country-list__item'>
            <img class='country-list__flag' src='${flags.svg}' alt='Flag of ${name.official}'>
            <h2 class='country-list__name'>${name.official}</h2> 
        </li>`;
        })
        .join('');
    return markup;
}

