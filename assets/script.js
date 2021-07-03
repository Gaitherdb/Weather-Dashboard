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
                    renderCurrentWeather(data);

                })
            } else {
                alert('Error: ' + response.statusText)
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeatherMap.com');
        })

}

function searchApi5DayForecast(data) {
   var queryURL = " https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + APIKey;
   console.log(queryURL);
}
// function setLocalStorage() {

// }
function getLocalDate(data) {
    //gets local time, converts it into miliseconds and adds the product of seconds shifted from UTC and 1000 and converts it to UTC.
    var localDate = new Date((new Date().getTime()) + data.timezone * 1000).toUTCString();
    console.log(localDate);
    var date = localDate.split(' ');
    date.splice(-2);
    return date;
}

function convertTemp(K) {
    return (9 / 5) * (K - 273) + 32;
}
function getIcons(icon) {

    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
    return iconurl;
    
    {/* <div id="icon"><img id="wicon" src="" alt="Weather icon"></div> */ }
}
function MStoMPH(ms) {
	return ms * 2.236936;
}

function renderCurrentWeather(data) {
    console.log(data);
    var currentDate = getLocalDate(data);
    var temp = convertTemp(data.main.temp).toFixed(2);
    console.log(temp);
    var humidity = data.main.humidity;
    var icon = getIcons(data.weather[0].icon)
    var wind = MStoMPH(data.wind.speed).toFixed(2);


searchApi5DayForecast(data);


}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);



