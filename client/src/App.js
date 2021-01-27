import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <form className="d-flex">
      <input value={props.filter} onChange={props.handleFilterChange} className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
    </form>  
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div className="mb-3">
      <label className="form-label">Name</label> 
      <input className="form-control" value={props.newName} onChange={props.handleNameChange}/>
    </div>
    <div className="mb-3">
      <label className="form-label">Number</label>
      <input className="form-control" pattern="^[0-9]{3,45}$" value={props.newNumber} onChange={props.handleNumberChange}/>
    </div>
    <div>
      <button type="submit" className="btn btn-primary">Save</button>
    </div>
  </form>
)

const Person = (props) => (
  <div key={props.person.name}>
    <p>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
      </svg>
      <b>{props.person.name}</b>: {props.person.number}
      <button onClick={() => props.deletePerson(props.person)} className="btn-close" aria-label="Delete User" id="close-CSS"></button>
    </p>
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
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <h3>Phonebook</h3>
          <Filter 
            filter={filter} 
            handleFilterChange={handleFilterChange}
          />
        </div>
      </nav>
      <div className ="row">
        <div className="col main-div">
          <Notification 
            message={message}
            type={messageType}
          />
          <h4>Add/Edit contact</h4>
          <p>*To edit contact enter current name and new number</p>
          <PersonForm 
            addPerson={addPerson}
            newName={newName} 
            handleNameChange={handleNameChange}
            newNumber={newNumber}
            handleNumberChange={handleNumberChange}
          />
        </div>
        <div className="col-5 main-div">
          <h4>Numbers</h4>
          <Persons 
            persons={filteredPersons}
            deletePerson={deletePerson}
          />
        </div>
      </div>
    </div>
  )
}

export default App
