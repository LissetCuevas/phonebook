import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css';

const Notification = ({ message, type }) => {
  if(message === null){
    return null
  } 
  return(
    <div className={type}>
      {message}
    </div>
  )
}

const Filter = (props) =>( 
  <div>
    Filter shown with: <input value={props.filter} onChange={props.handleFilterChange}></input>
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div>
      Name: <input value={props.newName} onChange={props.handleNameChange}/>
    </div>
    <div>
      Number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
)

const Person = (props) => (
  <div key={props.person.name}>
    <b>{props.person.name}</b>: {props.person.number}
    <button onClick={() => props.deletePerson(props.person)}>
      delete
    </button>
  </div>
)

const Persons = (props) => (
  <div>
    {props.persons.map(person => 
      <Person 
        key={person.name} 
        person={person} 
        deletePerson={props.deletePerson}/>
    )}
  </div>
)

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')  
  const [ message, setMessage ] = useState(null)  
  const [ messageType, setmessageType ] = useState(null)  

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {      
        console.log(`Error loading persons (${error}).`)
      })
  },[])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name : newName,
      number : newNumber
    }
    if(nameIsUnique(newName)){
      personService
        .create(newPerson)
        .then(addedPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`${newPerson.name} added`)
          setmessageType('success')
          setTimeout(()=> {
            setMessage(null)
          },5000)
        })
        .catch(error => {      
          console.log(`Error adding new person (${error}).`)
        })
    }else if(window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with the new one?`)){
      personService
        .update(persons.find(person => person.name === newPerson.name).id,newPerson)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.name !== newPerson.name ? person : newPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`${newPerson.name} number updated`)
          setmessageType('success')
          setTimeout(()=> {
            setMessage(null)
          },5000)
        }) 
        .catch(error => {      
          console.log(`Error updating number (${error}).`)
        })
    }
  }

  const deletePerson = deletedPerson => {
    if(window.confirm(`Do you really want to delete ${deletedPerson.name}?`)){
      personService
        .deleteObj(deletedPerson.id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))   
          setMessage(`The person ${deletedPerson.name} was already deleted from server.`)
          setmessageType('error')
          setTimeout(()=> {
            setMessage(null)
          },5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const nameIsUnique = (newName) => {
    return persons.every(person => person.name !== newName)
  }

  const filteredPersons = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons 

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
        message={message}
        type={messageType}
      />
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange}
      />
      
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons 
        persons={filteredPersons}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App