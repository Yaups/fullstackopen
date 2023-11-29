import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import SearchBar from './components/SearchBar'

function App() {

  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')

  const handleSearchChange = event => setSearchText(event.target.value)

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
        <SearchBar text={searchText} handleSearchChange={handleSearchChange} />
      </div>
      <br />
      <div>
        <Countries
          countries={countries.filter(country =>
            country.name.common.toLowerCase()
              .includes(searchText.toLowerCase().trim())
          )}
          hasSearched={searchText.trim() !== ''}
        />
      </div>
    </>
  )
}

export default App