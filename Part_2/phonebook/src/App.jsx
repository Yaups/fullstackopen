import { useState, useEffect } from 'react'
import Entries from './components/Entries'
import AddEntryForm from './components/AddEntryForm'
import Filter from './components/Filter'
import requests from './services/requests'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    requests
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
    }   
  , [])

  const addPerson = (event) => {
    let addable = true
    let updateNumberOnly = false
    event.preventDefault()
    if (persons.map(person => person.name.trim().toLowerCase()).includes(newName.trim().toLowerCase())) {
      if (window.confirm(`${newName.trim()} is already in the phone book. Would you like to replace the existing number with the new one?`)) {
        updateNumberOnly = true
      }
        else addable = false
    }
    if (newName.trim() === '') {
      alert(`Please enter a name!`)
      addable = false
    }
    else if (newNumber.trim() === '') {
      alert(`Please add a number for ${newName.trim()}!`)
      addable = false
    }
    if (addable && !updateNumberOnly) {
      const newPerson = {
        name: newName.trim(), 
        number: newNumber.trim(), 
      }
      requests
        .create(newPerson)
        .then(personToAdd => {
          setPersons(persons.concat(personToAdd))
        })
      setNewName('')
      setNewNumber('')
    }
    else if (addable && updateNumberOnly) {
      const matchingPerson = persons.find(person => person.name.trim().toLowerCase() === newName.trim().toLowerCase())
      const updatedPerson = {...matchingPerson, number: newNumber}
      const id = updatedPerson.id
      requests
        .update(id, updatedPerson)
        .then(personToUpdate => {
          setPersons(persons.map(person => person.id === id ? updatedPerson : person))
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const triggerRemoval = (id, name) => {
    if(window.confirm(`Do you really want to delete ${name}?`)) {
      requests
        .remove(id)
        .catch(error => {
          alert(`${name} has already been deleted!`)
        })
        setPersons(persons.filter((person) => person.id !== id))
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
          triggerRemoval={triggerRemoval}
        />
      </ul>
    </div>
  )
}

export default App