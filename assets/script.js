var searchFormEl = document.querySelector('#search-form');
var searchInputVal = document.querySelector('#input-city');
var currentDay = document.querySelector('#currentDay');
var fiveDayForecast = document.querySelector('#fiveDayForecast');
var APIKey = "92421b7f2bf12b73f6e7c38295c935c0";




function handleSearchFormSubmit(event) {
    event.preventDefault();
    var city = searchInputVal.value.trim();
    if (!city) {
        alert('You need a search input value!');
        return;
    }
    else {
        searchApiCurrentDay(city);
        currentDay.textContent = '';
        fiveDayForecast.textContent = '';
        searchInputVal.value = '';
    }
}

function searchApiCurrentDay(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    renderWeather(data);
                    
                })
             } else {
                    alert('Error: ' + response.statusText)
                }
            })
        .catch(function (error) {
            alert('Unable to connect to OpenWeatherMap');
        })
        
}
// function setLocalStorage() {

// }
function getLocalDate(data) {
    var localDate = new Date((new Date().getTime())+data.timezone*1000).toUTCString();
    var date = localDate.split(' ');
    date.splice(-2);
    return date;
}

function renderWeather(data) {
console.log(data);
var currentDate = getLocalDate(data);
console.log(currentDate);



}
searchFormEl.addEventListener('submit', handleSearchFormSubmit);

