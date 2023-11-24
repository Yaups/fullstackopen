const Entries = ({persons, triggerRemoval}) => {
    return (
        persons.map(person => 
            <Entry 
                name={person.name} 
                number={person.number} 
                key={person.id}
                triggerRemoval={() => triggerRemoval(person.id, person.name)}
            />
        )
    )
}

const Entry = ({name, number, triggerRemoval}) => {
    return (
        <li>
            {name}: {number} {''}
            <button onClick={triggerRemoval}>Delete entry</button>
        </li>
    )
}

export default Entries