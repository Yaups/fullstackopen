const AddEntryForm = ({
    newName,
    newNumber,
    handleInputChange,
    handleNumberChange,
    addPerson }) => {
    return (
        <form>
            <div>
                Name: <input value={newName} onChange={handleInputChange} />
            </div>
            <div>
                Number: <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
                <button
                    type="submit"
                    onClick={addPerson}>
                    Add entry to phonebook
                </button>
            </div>
        </form>
    )
}

export default AddEntryForm