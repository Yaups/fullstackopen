import { useState, useEffect } from 'react'
import Entries from './components/Entries'
import AddEntryForm from './components/AddEntryForm'
import Filter from './components/Filter'
import Message from './components/Message'
import requests from './services/requests'


const App = () => {
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)
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
    event.preventDefault()
    let addable = true
    let updateNumberOnly = false
    const personNames = persons.map(person => person.name.trim().toLowerCase())
    if (personNames.includes(newName.trim().toLowerCase())) {
      if (window.confirm(`${newName.trim()} is already in the phone book.
 Would you like to replace the existing number with the new one?`)) {
        updateNumberOnly = true
      }
      else addable = false
    }
    if (newName.trim() === '') {
      broadcastMessage(`Please enter a name!`, 'errorMessage')
      addable = false
    }
    else if (newNumber.trim() === '') {
      broadcastMessage(
        `Please add a number for ${newName.trim()}!`
        , 'errorMessage')
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
          broadcastMessage(`Added ${newName.trim()} to the phonebook.`)
        })
      setNewName('')
      setNewNumber('')
    }
    else if (addable && updateNumberOnly) {
      const matchingPerson = persons.find(person =>
        person.name.trim().toLowerCase() === newName.trim().toLowerCase())
      const updatedPerson = { ...matchingPerson, number: newNumber }
      const id = updatedPerson.id
      requests
        .update(id, updatedPerson)
        .then(personToUpdate => {
          setPersons(persons.map(person =>
            person.id === id ? personToUpdate : person))
          broadcastMessage(`Updated number for ${updatedPerson.name}.`)
        })
        .catch((error) => {
          broadcastMessage(
            `${updatedPerson.name} has already been removed from the server!`,
            'errorMessage'
          )
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const broadcastMessage = (msg, messageType) => {
    const isError = messageType === 'errorMessage' ? true : false
    clearTimeout(timeoutId)
    setError(isError)
    setMessage(msg)
    const tid = setTimeout(() => {
      setMessage(null)
      setTimeoutId(null)
    }
      , 4000)
    setTimeoutId(tid)
  }

  const triggerRemoval = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      requests
        .remove(id)
        .catch(error => {
          broadcastMessage(
            `${name} was actually already deleted in the database!`,
            'errorMessage'
          )
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
      <Message error={error} message={message} />
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