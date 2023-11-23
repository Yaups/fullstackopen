const Entries = ({persons}) => {
    return (
        persons.map(person => 
            <Entry 
                name={person.name} 
                number={person.number} 
                key={person.name.toLowerCase().trim()}
            />
        )
    )
}

const Entry = ({name, number}) => {
    return (
        <li>
            {name}: {number}
        </li>
    )
}

  export default Entries