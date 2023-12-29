import { useState } from 'react'

const Togglable = props => {

  const [visible, setVisible] = useState(false)

  const style = { display: visible ? '' : 'none' }

  return (
    <div>
      <div style={style}>
        {props.children}
      </div>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'Cancel' : props.buttonText}
      </button>
    </div >
  )
}

export default Togglable