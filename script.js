const API_KEY = "f3d61986aebd1478ab087addab6765d7";
        
        const weatherBox = document.getElementById("weather");
        const historyBox = document.getElementById("history");

        
        async function getWeather(city) {

            
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if (!res.ok) {
                alert("city not found");
                throw new Error("City not found");
            }
            const data = await res.json();
            return data;
        }

        
        document.getElementById("searchBtn").onclick = () => {
            const city = cityInput.value.trim();
            if (city) {
                search(city);
            }
        };

        
        function renderWeather(d) {
            weatherBox.innerHTML = `
        <div class="weather-item"><label>City</label><span>${d.name}, ${d.sys.country}</span></div>
        <div class="weather-item"><label>Temperature</label><span>${d.main.temp} °C</span></div>
        <div class="weather-item"><label>Weather</label><span>${d.weather[0].main}</span></div>
        <div class="weather-item"><label>Humidity</label><span>${d.main.humidity}%</span></div>
        <div class="weather-item"><label>Wind Speed</label><span>${d.wind.speed} m/s</span></div>
    `;
        }

        function saveHistory(city) {
            let history = JSON.parse(localStorage.getItem("history")) || [];
            history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
            history.unshift(city);
            history = history.slice(0, 5);
            localStorage.setItem("history", JSON.stringify(history));
        }

        
        function showHistory() {
            let history = JSON.parse(localStorage.getItem("history")) || [];
            historyBox.innerHTML = "";
            history.forEach(city => {
                const div = document.createElement("div");
                div.innerText = city;
                div.onclick = () => search(city);
                historyBox.appendChild(div);
            });
        }
        
        async function search(city) {
            weatherBox.innerHTML = "";
            try {
                const data = await getWeather(city);
                renderWeather(data);
                saveHistory(data.name); 
                showHistory();
            } catch (error) {
                weatherBox.innerHTML = `<p style="color:red">${error.message}</p>`;
            }
        }
       
        
        cityInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const city = cityInput.value.trim();
                if (city) {
                    search(city);
                }
            }
        });
        
        showHistory();
