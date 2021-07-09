var searchFormEl = document.querySelector('#search-form');
var searchInputVal = document.querySelector('#input-city');
var currentWeather = document.querySelector('#currentWeather');
var fiveDayForecast = document.querySelector('#fiveDayForecast');
var SH = document.querySelector('#searchHistory');

const APIKey = "92421b7f2bf12b73f6e7c38295c935c0";
var DateTime = luxon.DateTime;
var cities = [];

renderLocalStorage();

SH.addEventListener("click", function (event) {
    var element = event.target;
    //if you click a saved search history btn
    if (element.matches(".cityBtn")) {
        searchSavedCity(element.textContent);
        console.log(element.textContent);
    }
})
function searchSavedCity(city) {
    fiveDayForecast.textContent = '';
    searchInputVal.value = '';
    currentWeather.textContent = '';
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
function handleSearchFormSubmit(event) {
    event.preventDefault();
    var city = searchInputVal.value.trim();

    if (!city) {
        alert('You need a search input value!');
        return;
    }
    else {
        fiveDayForecast.textContent = '';
        searchInputVal.value = '';
        currentWeather.textContent = '';
        searchApiCurrentDay(city);
    }
}

function searchApiCurrentDay(city) {

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    addLocalStorage(data.name);
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
function addLocalStorage(name) {
    localStorage.getItem("searchHistory");
    //adds the city to the array of saved searches
    cities.push(name);
    //limits the saved search to 6 buttons
    var searchHistoryCap = document.querySelectorAll(".citybtn");
    if (searchHistoryCap.length > 5) {
        cities.splice(0, 1);
    }
    var searchHistory = document.createElement("button");
    searchHistory.classList.add("citybtn");
    // searchHistory.setAttribute("data-name", name);
    searchHistory.textContent = name;
    SH.appendChild(searchHistory);
    //saves array of 6 cities to local storage
    localStorage.setItem("searchHistory", JSON.stringify(cities));
}
function renderLocalStorage() {
    var savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
        cities = JSON.parse(savedHistory);
        for (i = 0; i < cities.length; i++) {
            var searchHistory = document.createElement("button");
            searchHistory.classList.add("citybtn");
            // searchHistory.setAttribute("data-name", cities[i]);
            searchHistory.textContent = cities[i];
            SH.appendChild(searchHistory);
        }

    }
}

function renderCurrentWeather(data) {
    console.log(data);

    var icon = getIcons(data.weather[0].icon);
    var temp = convertTemp(data.main.temp).toFixed(2);
    var wind = MStoMPH(data.wind.speed).toFixed(2);
    var humidity = data.main.humidity;

    var div = document.createElement("div");
    div.id = "header";
    var h1 = document.createElement("h1");
    h1.classList.add("currentDayHeader");
    dateHeader = document.createElement("h1");
    dateHeader.classList.add("currentDayHeader");
    var img = document.createElement("img");
    img.classList.add("currentDayHeader");
    img.src = icon;
    img.alt = "Weather Icon";
    var ul = document.createElement("ul");
    ul.classList.add("todayList");
    var tempList = document.createElement("li");
    var windList = document.createElement("li");
    var humidityList = document.createElement("li");
    h1.textContent = data.name + " ";
    tempList.textContent = "Temp: " + temp + " ℉";
    windList.textContent = "Wind: " + wind + " MPH";
    humidityList.textContent = "Humidity: " + humidity + " %";
    currentWeather.appendChild(div);
    div.appendChild(h1);
    div.appendChild(dateHeader);
    div.appendChild(img);
    currentWeather.appendChild(ul);
    ul.appendChild(tempList);
    ul.appendChild(windList);
    ul.appendChild(humidityList);

    searchApi5DayForecast(data);
}

function getLocalDate(data) {
    var local = DateTime.local();
    var rezoned = local.setZone(data.timezone);
    var format = rezoned.toFormat("'('M'/'d'/'y')'");
    dateHeader.textContent = format;
}

function getIcons(icon) {
    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
    return iconurl;
}
function convertTemp(K) {
    return (9 / 5) * (K - 273) + 32;
}
function MStoMPH(ms) {
    return ms * 2.236936;
}
function searchApi5DayForecast(currentData) {
    var queryURL = " https://api.openweathermap.org/data/2.5/onecall?lat=" + currentData.coord.lat + "&lon=" + currentData.coord.lon + "&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getUVI(data);
                    render5DayForecast(data);
                    getLocalDate(data);


                })
            } else {
                alert('Error: ' + response.statusText)
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeatherMap.com');
        })
}

function getUVI(data) {
    var currentUVI = data.current.uvi;
    var uviList = document.createElement("li");
    uviList.classList.add("UVI");
    var uviNum = document.createElement("li");
    uviNum.classList.add("UVI");
    uviNum.id = "UVIndex";
    uviList.textContent = "UV Index: ";
    uviNum.textContent = currentUVI;
    var ul = document.querySelector(".todayList");
    if (currentUVI <= 2) {
        uviNum.classList.add("uvGreen");
    }
    else if (currentUVI <= 5) {
        uviNum.classList.add("uvYellow");
    }
    else if (currentUVI <= 7) {
        uviNum.classList.add("uvOrange");
    }
    else {
        uviNum.classList.add("uvRed");
    }
    ul.appendChild(uviList);
    ul.appendChild(uviNum);
}

function render5DayForecast(data) {
    console.log(data);

    for (i = 0; i < 5; i++) {
        var div = document.createElement("div");
        div.classList.add("dailyDiv");
        fiveDayForecast.appendChild(div);
        var dailyDiv = document.querySelectorAll(".dailyDiv");

        var local = DateTime.local();
        var rezoned = local.setZone(data.timezone);
        var addDay = rezoned.plus({ days: i + 1 })
        var newDate = addDay.toFormat("M'/'d'/'y");
        var icon = getIcons(data.daily[i].weather[0].icon);
        var temp = convertTemp(data.daily[i].temp.max).toFixed(2);
        var wind = MStoMPH(data.daily[i].wind_speed).toFixed(2);
        var humidity = data.daily[i].humidity;

        var futureDate = document.createElement("h1");
        futureDate.classList.add('dailyDate');
        futureDate.textContent = newDate;
        var img = document.createElement("img");
        img.src = icon;
        img.alt = "Weather Icon";
        var ul = document.createElement("ul");
        var tempList = document.createElement("li");
        var windList = document.createElement("li");
        var humidityList = document.createElement("li");
        tempList.textContent = "Temp: " + temp + " ℉";
        windList.textContent = "Wind: " + wind + " MPH";
        humidityList.textContent = "Humidity: " + humidity + " %";

        dailyDiv[i].appendChild(futureDate);
        dailyDiv[i].appendChild(img);
        dailyDiv[i].appendChild(ul);
        ul.appendChild(tempList);
        ul.appendChild(windList);
        ul.appendChild(humidityList);
    }
}



searchFormEl.addEventListener('submit', handleSearchFormSubmit);



