import { useState, useEffect } from 'react'
import Entries from './components/Entries'
import AddEntryForm from './components/AddEntryForm'
import Filter from './components/Filter'
import axios from 'axios'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        setPersons(response.data)
      })
    }   
  , [])

  const addPerson = (event) => {
    let addable = true
    event.preventDefault()
    if (persons.map(person => person.key).includes(newName.trim().toLowerCase())) {
      alert(`${newName.trim()} is already in the phone book!`)
      addable = false
    }
    else if (newName.trim() === '') {
      alert(`Please enter a name!`)
      addable = false
    }
    else if (newNumber.trim() === '') {
      alert(`Please add a number for ${newName.trim()}!`)
      addable = false
    }
    if (addable) {
      setPersons(persons.concat({
        name: newName, 
        number: newNumber, 
        key: newName.trim().toLowerCase()
      }))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleInputChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setNewFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <span>Filter names inlcuding: </span>
      <Filter
        newFilter={newFilter}
        handleFilterChange={handleFilterChange}
      />
      <h2>Add an entry to the phone book:</h2>
      <AddEntryForm
        newName={newName}
        newNumber={newNumber}
        handleInputChange={handleInputChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Saved numbers:</h2>
      <ul>
        <Entries 
          persons={persons.filter(person => 
            person.name.toLowerCase().includes(newFilter.toLowerCase()))}
        />
      </ul>
    </div>
  )
}

export default App