// Initialize AOS when the page content has loaded
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,  // Animation duration
        once: true,      // Animation should happen only once while scrolling down
        mirror: false    // Disable animations on scroll back up
    });
});

const apiKey = '524e7639f7db962d50b175dc66132873'; // OpenWeatherMap API key
let isCelsius = true; // Temperature unit state (true = Celsius, false = Fahrenheit)

// Function to fetch weather using coordinates (latitude, longitude)
function fetchWeatherByCoords(lat, lon) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.main) throw new Error('Invalid data received');
            updateWeatherDisplay(data);
        })
        .catch(error => {
            alert('Unable to retrieve weather data.');
            console.error('Fetch error:', error);
        });
}

// Function to fetch weather 
function fetchWeather(city = 'Lusaka') {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.main) throw new Error('Invalid data received');
            updateWeatherDisplay(data);
        })
        .catch(error => {
            alert('City not found. Please try again.');
            console.error('Fetch error:', error);
        });
}

// Function to update the weather display with new data
function updateWeatherDisplay(data) {
    const { main, weather, wind, sys, name, dt } = data;
    const temp = isCelsius ? main.temp : (main.temp * 9 / 5) + 32;
    const currentTime = new Date(dt * 1000).toLocaleTimeString();

    document.getElementById('weather').innerHTML = `
        <h3>${name}</h3>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
        <p>Temperature: ${Math.round(temp)}°${isCelsius ? 'C' : 'F'}</p>
        <p id="current-time">Time: ${currentTime}</p>
    `;

    // Update additional weather details
    document.getElementById('wind-speed').innerText = `Wind Speed: ${wind.speed} m/s`;
    document.getElementById('humidity').innerText = `Humidity: ${main.humidity} %`;
    document.getElementById('sunrise').innerText = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
    document.getElementById('sunset').innerText = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;

    // Change background image based on the weather condition
    changeBackground(weather[0].main);
}

// Function to change the background image based on the weather condition
function changeBackground(weatherCondition) {
    const currentSection = document.getElementById('current');
    const normalizedCondition = weatherCondition.toLowerCase();
    let backgroundImage;

    switch (normalizedCondition) {
        case 'clear':
            backgroundImage = 'url("./img/clearSky.jpg")';
            break;
        case 'clouds':
            backgroundImage = 'url("./img/clouds.jpg")';
            break;
        case 'rain':
            backgroundImage = 'url("./img/rainy.jpg")';
            break;
        case 'snow':
            backgroundImage = 'url("./img/snowy.jpg")';
            break;
        case 'drizzle':
            backgroundImage = 'url("./img/drizzle.jpg")';
            break;
        case 'thunderstorm':
            backgroundImage = 'url("./img/thunders.jpg")';
            break;
        default:
            backgroundImage = 'url("./img/default.jpg")';
    }

    currentSection.style.backgroundImage = backgroundImage;
}

// Event listener for the search button to get the weather for a specific city
document.getElementById('search').addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a valid city name.');
    }
});

// Event listener to toggle between Celsius and Fahrenheit
document.getElementById('toggle-temp').addEventListener('click', () => {
    isCelsius = !isCelsius;
    document.getElementById('toggle-temp').innerText = `Convert to °${isCelsius ? 'F' : 'C'}`;
    const tempElement = document.querySelector('#weather p:nth-of-type(2)');
    const tempValue = parseFloat(tempElement.innerText.match(/-?\d+(\.\d+)?/)[0]);
    const newTemp = isCelsius ? (tempValue - 32) * 5 / 9 : (tempValue * 9 / 5) + 32;
    tempElement.innerText = `Temperature: ${Math.round(newTemp)}°${isCelsius ? 'C' : 'F'}`;
});

// Burger menu toggle for mobile navigation
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});

// Get user's location and fetch weather for their coordinates
navigator.geolocation.getCurrentPosition(
    position => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude), 
    () => fetchWeather('London') // Fallback to default city if geolocation fails
);
