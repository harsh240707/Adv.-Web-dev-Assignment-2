
const API_KEY = "0133cc5316757ac730cc46ae342334e4";

const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#city");
const weatherInfo = document.querySelector(".info");
const historyContainer = document.querySelector("#historyList");
const consoleBox = document.querySelector("#consoleLog");

let searchHistory = JSON.parse(sessionStorage.getItem("searchHistory")) || [];

function log(message){
    const p = document.createElement("p");
    p.textContent = message;
    consoleBox.appendChild(p);
}

function clearConsole(){
    consoleBox.innerHTML = "";
}

form.addEventListener("submit", function(event){

    console.log("Submit Clicked");
    event.preventDefault();

    const city = cityInput.value.trim();

    if(city === ""){
        showError("Please enter a city name");
        return;
    }

    getWeather(city);
});

async function getWeather(city){

    clearConsole();

    log(" Sync Start");

    try{

        log(" Async Start fetching");

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)

        
        .then(response => {
            log(" Promise resolved (Microtask)");
            return response.json();
        })

        .then(data => {

            console.log("Data Received:", data);

            if(data.cod === 200){

                displayWeather(data);
                saveHistory(data.name);

                log("✅ Data received");

            } else {
                showError("City not found");
                log("❌ Invalid city");
            }

        })

        .catch(error => {
            console.log("Fetch Error:", error);
            log("❌ Promise rejected");
            showError("Network error occurred");
        });

        
        setTimeout(()=>{
            log(" setTimeout (Macrotask)");
        },0);

    }catch(error){

        console.log("Try Catch Error:", error);
        log("❌ Try-Catch Error");
        showError("Something went wrong");

    }

    log(" Sync End");
    log("📌 Event Loop: Microtasks run before Macrotasks");
}

function displayWeather(data){

    const temp = (data.main.temp - 273.15).toFixed(1);

    weatherInfo.innerHTML = `
        <h3>Weather Info</h3>
        <p><strong>City:</strong> ${data.name}</p>
        <p><strong>Temperature:</strong> ${temp} °C</p>
        <p><strong>Condition:</strong> ${data.weather[0].main}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
    `;
}

function showError(message){

    weatherInfo.innerHTML = `
        <h3>Weather Info</h3>
        <p class="error">${message}</p>
    `;
}

function saveHistory(city){

    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        sessionStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    renderHistory();
}
function renderHistory(){
    historyContainer.innerHTML = "";

    const history = JSON.parse(sessionStorage.getItem("searchHistory")) || [];

    history.forEach(city => {

        const btn = document.createElement("button");
        btn.textContent = city;

        btn.addEventListener("click", function(){
            log(`🔁 Re-fetching: ${city}`);
            getWeather(city);
        });

        historyContainer.appendChild(btn);
    });
}
function demoPromise(){

    console.log("Promise Demo Start");

    fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(res => res.json())
    .then(data => console.log("Promise Data:", data))
    .catch(err => console.log("Promise Error:", err));

    console.log("Promise Demo End");
}
demoPromise();
renderHistory();