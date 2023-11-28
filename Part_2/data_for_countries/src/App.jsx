import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchBar = ({text, handleSearchChange}) => 
  <div>
    Search for a country: {''}
    <input value={text} onChange={handleSearchChange}/>
  </div>

const Countries = ({countries, searchText}) => {
  const numberOfVisibleCountries = countries.length

  if (searchText.trim() === '') {
    return (
      <li>Search for a country using the searchbar above.</li>
    )
  }
  if (numberOfVisibleCountries > 10) {
    return (
      <li>Too many results. Please refine your search.</li>
    )
  }
  else return (
    countries.map(country =>
      <Country
        key={country.cca3}
        country={country}
        numberOfVisibleCountries={numberOfVisibleCountries}
      />
    )
  )
}

const Country = ({country, numberOfVisibleCountries}) => {

  if (numberOfVisibleCountries !== 1) {
    return (
      <li>
        {country.name.common} {`(officially ${country.name.official})`}
      </li>
    )
  }

  else if (numberOfVisibleCountries === 1) {
    const flagStyle = {
      border: '2px solid #555',
      width: '10%',
      height: '10%'
    }
    const languages = []
    for (const language in country.languages)
      languages.push(country.languages[language])
    console.log(languages)
    const capitals = []
    for (const capital in country.capital)
      capitals.push(country.capital[capital])
    console.log(capitals)
    const capitalText = capitals.length === 1 ? 'Capital city: ' : 'Capital cities: '
    let capitalsToShow = ''
    capitals.forEach(capital => 
      capitalsToShow = capitalsToShow + capital + ', '
    )
    capitalsToShow = capitalsToShow.slice(0, -2)
    return (
      <div>
        <img 
          src={country.flags.svg} 
          style={flagStyle}
          alt={`Flag of ${country.name.common}`}
        />
        <h2>{country.name.common}</h2>
        <li><b>Officially known as: {''}</b> {country.name.official}</li>
        <li><b>Continent: {''}</b> {country.continents[0]}</li>
        <li>
          <b>{capitalText}</b>
          {capitalsToShow}
        </li>
        <li><b>Population: {''}</b> {country.population}</li>
        <h2>Languages spoken</h2>
        <ul>
          {languages.map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>
      </div>
    )
  }
}

function App() {

  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')

  const handleSearchChange = (event) => setSearchText(event.target.value)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
  }
  , [])

  return (
    <>
      <div>
        <SearchBar text={searchText} handleSearchChange={handleSearchChange}/>
      </div>
      <br/>
      <div>
        <Countries 
          countries={countries.filter(country =>
            country.name.common.toLowerCase()
              .includes(searchText.toLowerCase().trim())
          )}
          searchText={searchText}
        />
      </div>
    </>
  )
}

export default App