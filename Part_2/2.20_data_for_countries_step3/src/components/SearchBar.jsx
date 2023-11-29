const SearchBar = ({ text, handleSearchChange }) => (
    <div>
        Search for a country: {''}
        <input value={text} onChange={handleSearchChange} />
    </div>
)

export default SearchBar