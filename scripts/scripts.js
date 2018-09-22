//API key: 210776d9

//http://www.omdbapi.com/?apikey=210776d9&[searchparameters]

//feature idea: News API to check for stories about film

const bodyElement = document.querySelector("body");
const searchTextElement = document.querySelector(".search__text");
const searchResultsElement = document.querySelector(".results");
const filmDisplayElement = document.querySelector(".film-container");
const modal = document.querySelector(".modal");
const displaySearchButton = document.querySelector(".search__display-bar");
const searchBarElement = document.querySelector(".nav__search");
const homeNavBar = document.querySelector(".nav__home");

bodyElement.addEventListener("submit", event => {
  event.preventDefault();
  if (event.target.matches(".search")) {
    modal.style.display = "block";
    apiUrls.updateURL("s", searchTextElement.value);
    apiUrls.fetchResults(apiUrls.getURL());
  }
});

//closest instead of matches, pay attention in case of bugs
bodyElement.addEventListener("click", event => {
  if (event.target.closest(".search__result")) {
    modal.style.display = "none";
    searchResultsElement.innerHTML = "";
    filmDisplayElement.innerHTML = "";
    toggleNavBar();
    apiUrls.updateMovieURL("i", event.target.dataset.id);
    apiUrls.fetchMovie(apiUrls.getMovieURL());
  }
  if (event.target.matches(".search__display-bar")) {
    toggleNavBar();
  }
});

//look into actual toggle functionality with BEM
function toggleNavBar() {
  if (homeNavBar.style.display === "flex") {
    searchBarElement.style.display = "flex";
    homeNavBar.style.display = "none";
  } else {
    searchBarElement.style.display = "none";
    homeNavBar.style.display = "flex";
  }
}

const apiUrls = {
  searchParameters: {
    s: "",
    type: "",
    page: ""
  },

  movieParameters: {
    i: "",
    plot: ""
  },

  updateURL: function(parameter, update) {
    this.searchParameters[parameter] = `&${parameter}=${update}`;
  },

  updateMovieURL: function(parameter, update) {
    this.movieParameters[parameter] = `&${parameter}=${update}`;
  },

  getURL: function() {
    const customURL = `http://www.omdbapi.com/?apikey=210776d9${
      this.searchParameters.s
    }`;
    return customURL;
  },

  getMovieURL: function() {
    return `http://www.omdbapi.com/?apikey=210776d9${this.movieParameters.i}&plot=long`;
  },

  fetchResults: function(apiURL) {
    fetch(apiURL)
      .then(response => response.json())
      .then(body => {
        if (body.hasOwnProperty("Error")) {
          //TODO: needs to be filled out
          console.log("error");
        } else {
          body.Search.forEach(result => {
            searchResultsElement.appendChild(searchTemplate(result));
          });
        }
      });
  },

  fetchMovie: function(apiURL) {
    fetch(apiURL)
      .then(response => response.json())
      .then(body => {
        console.log(body)
        filmDisplayElement.appendChild(fullFilmTemplate(body));
      });
  },


  fetchNews: function(apiURL){
    fetch(apiURL)
      .then(response => response.json())
      .then(body => {

      })
  }
};

const pageHandlers = {};

function searchTemplate(result) {
  const searchResultElement = document.createElement("div");
  const template = `
    <div class="search__result" data-id=${result.imdbID}>
      <img class="result__poster" src=${result.Poster} data-id=${result.imdbID}/>
      <h4 class="result__title" data-id=${result.imdbID}>${result.Title}</h4>
      <h5 class="result__year" data-id=${result.imdbID}>(${result.Year})</h5>
      <h5 class="result__type" data-id=${result.imdbID}>${result.Type}</h5>
    </div>
  `;
  searchResultElement.innerHTML = template;
  return searchResultElement;
}

function fullFilmTemplate(result) {
  const filmInfoElement = document.createElement("div");
  const template = `
    <div class="film-display">
      <div class="film-display__header">
        <h2>${result.Title} </h2>
        <h2>(${result.Year})</h2>
      </div>
      <div class="film-display__info">
        <img class="film-display__poster" src=${result.Poster}/>
        <div class="film-display__key-facts"
          <span>${result.Genre} | ${result.Runtime} | ${result.Rated}</span>
          <span> Director: ${result.Director}</span>
          <span> Written By: ${result.Writer}</span>
        </div>
      </div>
      <span class="film-display__cast"><strong>Cast:</strong> ${result.Actors}<span>
      <p>${result.Plot}<p>
      <div class="film-display__ratings">
        <h5>Ratings & Awards</h5>
        <span>${result.Awards}</span>
        <span>${result.Ratings[0].Source}: ${result.Ratings[0].Value}</span>
        <span>${result.Ratings[1].Source}: ${result.Ratings[1].Value}</span>
        <span>${result.Ratings[2].Source}: ${result.Ratings[2].Value}</span>
      </div>
      <div class="film-display__misc">
      <h5>Miscellaneous</h5>
      <span>Released: ${result.Released}, Box Office: ${result.BoxOffice}. DVD: ${result.DVD}</span>
      <span>${result.Country} | ${result.Language} | ${result.Production} </span>
      <span> ${result.Website}</span>
      </div>
    </div>
  `;
  filmInfoElement.innerHTML = template;
  return filmInfoElement;
}
