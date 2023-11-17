import { useState } from 'react'

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Anecdote = ({text}) => {
  return (
    <span>
      {text}
    </span>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [upvotes, addUpvote] = useState(new Uint16Array(8))
  const [hasVoted, setHasVoted] = useState(false)

  const randomInt = maxPlusOne => Math.floor(Math.random() * maxPlusOne)

  const indexOfMaximumValue = inputArray => {
    const maxValue = Math.max(...inputArray)
    return inputArray.indexOf(maxValue)
  }

  const newAnecdote = () => {
    let random = randomInt(anecdotes.length)
    while (random == selected) {
      random = randomInt(anecdotes.length)
    }
    setSelected(random)
    setHasVoted(false)
  }

  const upvoteCurrentAnecdote = () => {
    if (!hasVoted) {
      const newUpvotes = [...upvotes]
      newUpvotes[selected]++
      addUpvote(newUpvotes)
      setHasVoted(true)
    }
    else console.log("Already voted!")
  }

  return (
    <>
      <h2>Daily Anecdote</h2>
      <Anecdote text={anecdotes[selected]} />
      <br/>
      <br/>
      <li>The current anecdote has a score of {upvotes[selected]}.</li>
      <br/>
      <div>
        <Button text={"Generate Random Anecdote"} handleClick={newAnecdote} />
        <Button text={"Upvote This Anecdote"} handleClick={upvoteCurrentAnecdote} />
      </div>
      <br/>
      <h2>Below is the anecdote with the most votes:</h2>
      <Anecdote text={anecdotes[indexOfMaximumValue(upvotes)]} />
    </>
  )
}

export default App