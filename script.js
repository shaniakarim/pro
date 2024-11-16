const apiKey = 'b9c8aac403f16628beacd26b45cd892c';
const body = document.getElementById('body');

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
    renderFavoriteCities();
    applySavedDarkMode();
});

// Fetch current weather
async function getWeather() {
    const city = document.getElementById('city-input').value || 'Stockholm';
    const unit = document.getElementById('temp-unit').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            displayWeather(data, unit);
            changeThemeBasedOnWeather(data.weather[0].main);
        } else {
            alert('City not found.');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

// Display current weather
function displayWeather(data, unit) {
    const tempUnitSymbol = unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K';
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleString();
    document.getElementById('temperature').textContent = `${data.main.temp} ${tempUnitSymbol}`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('wind-speed').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

// Fetch and display 24-hour forecast
async function get24HourForecast() {
    const city = document.getElementById('city-input').value || 'Stockholm';
    const unit = document.getElementById('temp-unit').value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            display24HourForecast(data.list.slice(0, 8), unit);
        } else {
            alert('Error fetching forecast.');
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function display24HourForecast(forecast, unit) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    forecast.forEach(hourData => {
        const hourElem = document.createElement('div');
        const time = new Date(hourData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const tempUnitSymbol = unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K';
        hourElem.innerHTML = `
            <p>${time} - ${hourData.main.temp} ${tempUnitSymbol}, ${hourData.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" alt="Icon">
        `;
        forecastDiv.appendChild(hourElem);
    });

    document.getElementById('forecast-info').style.display = 'block';
}

// Manage favorites
const favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];

// Add a favorite city
function addFavoriteCity() {
    const city = document.getElementById('favorite-city-input').value.trim();
    if (city && !favoriteCities.includes(city)) {
        favoriteCities.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
        renderFavoriteCities();
    }
    document.getElementById('favorite-city-input').value = '';
}

// Render favorite cities
function renderFavoriteCities() {
    const favoriteList = document.getElementById('favorite-cities-list');
    favoriteList.innerHTML = '';
    favoriteCities.forEach((city) => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.classList.add('favorite-city-item');
        listItem.addEventListener('click', () => {
            document.getElementById('city-input').value = city;
            getWeather();
        });
        favoriteList.appendChild(listItem);
    });
}

// Toggle dark mode
function toggleDarkMode() {
    const isDark = document.getElementById('darkModeToggle').checked;
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
    saveDarkModePreference(isDark);
}

// Apply saved dark mode preference
function applySavedDarkMode() {
    const isDark = JSON.parse(localStorage.getItem('darkMode'));
    document.getElementById('darkModeToggle').checked = isDark;
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
}

// Dynamic themes based on weather
function changeThemeBasedOnWeather(weather) {
    if (weather.toLowerCase().includes('rain')) {
        body.style.backgroundColor = '#5DADE2';
    } else if (weather.toLowerCase().includes('cloud')) {
        body.style.backgroundColor = '#AED6F1';
    } else if (weather.toLowerCase().includes('clear')) {
        body.style.backgroundColor = '#85C1E9';
    } else {
        body.style.backgroundColor = '#f0f0f0';
    }
}
