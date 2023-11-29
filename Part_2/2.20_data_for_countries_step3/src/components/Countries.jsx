import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countries, hasSearched }) => {
    const numberOfVisibleCountries = countries.length

    if (!hasSearched) {
        return (
            <li>Search for a country using the searchbar above.</li>
        )
    }
    if (numberOfVisibleCountries > 10) {
        return (
            <li>Too many results. Please refine your search.</li>
        )
    }
    return (
        countries.map(country =>
            <Country
                key={country.cca3}
                country={country}
                numberOfVisibleCountries={numberOfVisibleCountries}
            />
        )
    )
}


const Country = ({ country, numberOfVisibleCountries }) => {

    const [isShowable, setShowable] = useState(false)

    useEffect(() => {
        if (numberOfVisibleCountries === 1) setShowable(true)
        else setShowable(false)
    }
        , [numberOfVisibleCountries])

    const [weatherInfo, setWeatherInfo] = useState(null)
    useEffect(() => {
        if (!isShowable) return
        const api_key = import.meta.env.VITE_SOME_KEY
        const lat = Object.keys(country.capitalInfo).length !== 0 ?
            country.capitalInfo.latlng[0] : 82.86
        const lon = Object.keys(country.capitalInfo).length !== 0 ?
            country.capitalInfo.latlng[1] : 135
        axios
            .get(`https://api.openweathermap.org/\
data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
            .then(response => {
                setWeatherInfo(response.data)
            })
            .catch(error => {
                console.log(`Warning: Connection to the \
weather server cannot be established. Consider checking the API key.`)
            })
    }, [country, isShowable])

    const [capitals, setCapitals] = useState([])
    useEffect(() => {
        if (!isShowable) return
        if (country.capital) {
            setCapitals(Object.values(country.capital))
        }
        else {
            setCapitals([country.name.common])
        }
    }
        , [country, isShowable])

    const [languages, setLanguages] = useState([])
    useEffect(() => {
        if (!isShowable) return
        if (country.languages) {
            setLanguages(Object.values(country.languages))
        }
        else {
            setLanguages(['None!'])
        }
    }
        , [country, isShowable])

    if (!isShowable) {
        return (
            <li>
                {country.name.common} {`(officially ${country.name.official}) `}
                <button
                    onClick={() => setShowable(true)}>
                    Show info
                </button>
            </li>
        )
    }

    return (
        <div>
            <br />
            <hr />
            <br />
            <img
                src={country.flags.svg}
                style={{
                    border: '2px solid #555',
                    width: '10%',
                    height: '10%'
                }}
                alt={`Flag of ${country.name.common}`}
            />
            <h2>{country.name.common}</h2>
            <li><b>Officially known as: {''}</b> {country.name.official}</li>
            <li><b>Continent: {''}</b> {country.continents[0]}</li>
            <li>
                <b>{capitals.length === 1 ? 'Capital city: ' : 'Capital cities: '}</b>
                {capitals.join(', ')}
            </li>
            <li><b>Population: {''}</b> {country.population}</li>
            <h2>Languages spoken</h2>
            <ul>
                {languages.map(language =>
                    <li key={language}>{language}</li>
                )}
            </ul>
            <h2>Current weather in {capitals[0]}</h2>
            <WeatherInfo weatherInfo={weatherInfo} />
            <br />
            <hr />
            <br />
        </div>
    )
}


const WeatherInfo = ({ weatherInfo }) => {
    if (!weatherInfo) return <li>Waiting on weather info...</li>
    return (
        <div>
            <img
                src={`https://openweathermap.org\
/img/wn/${weatherInfo.weather[0].icon}@2x.png`}
                alt='Weather icon'
                width={'100 %'}
                height={'100 %'}
            />
            <li>
                {`Current temperature: ${(weatherInfo.main.temp - 273)
                    .toPrecision(3)} °C`}
            </li>
            <li>{`Humidity: ${weatherInfo.main.humidity}%`}</li>
            <li>{`Wind speed: ${weatherInfo.wind.speed} m/s`}</li>
        </div>
    )
}

export default Countries