const initialState = ''

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FILTER': {
      return action.payload
    }
    default: {
      return state
    }
  }
}

export const applyFilter = text => ({
  type: 'FILTER',
  payload: text
})

export default filterReducer