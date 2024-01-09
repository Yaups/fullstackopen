import { applyFilter } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = event => {
    const filterText = event.target.value
    dispatch(applyFilter(filterText))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      <b>Filter by text (case insensitive) {''}</b> <input onChange={handleChange} />
    </div>
  )
}

export default Filter