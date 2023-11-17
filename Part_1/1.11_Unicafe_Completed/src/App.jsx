import { useState } from 'react'

const Statistics = ({totalFeedback, feedbackValues,
  feedbackTitles}) => {

  const numberOfDigits = (input) => input.toString().Length

  if (totalFeedback > 0)
    return (
      <table>
        <StatisticLine title={feedbackTitles[0]} 
        value={feedbackValues.good} 
        precision={numberOfDigits(feedbackValues.good)}
        />
        <StatisticLine title={feedbackTitles[1]} 
        value={feedbackValues.neutral} 
        precision={numberOfDigits(feedbackValues.neutral)}
        />
        <StatisticLine title={feedbackTitles[2]} 
        value={feedbackValues.bad} 
        precision={numberOfDigits(feedbackValues.bad)}
        />
        <StatisticLine title={"Total"} 
        value={totalFeedback} 
        precision={numberOfDigits(totalFeedback)}
        />
        <StatisticLine title={"Average Score (Good = 1, Neutral = 0, Bad = -1)"}
        value={(feedbackValues.good - feedbackValues.bad) / totalFeedback} 
        precision={3}
        />
        <StatisticLine title={"Percentage of all scores which were positive"} 
        value={feedbackValues.good / totalFeedback *  100} symbol={"%"}
        precision={3}
        />
      </table>
  )
  return <span>Please submit feedback to see statistics.</span>
}


const Heading = ({text}) => <h2>{text}</h2>

const Button = ({text, handleClick}) => { 
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({title, value, symbol, precision}) => 
<tbody>
  <tr>
    <th>{title}:</th>
    <td>{value.toPrecision(precision)}{symbol}</td>
  </tr>
</tbody>


function App() {
  const [feedbackValues, setFeedbackValue] = useState({good: 0, neutral:0, bad: 0})
  const totalFeedback = feedbackValues.good + 
    feedbackValues.neutral + feedbackValues.bad
  const titleText = "Welcome to the Unicafe feedback form. Please submit your feedback below:"
  const headingText = "Received Feedback and statistics:"
  const feedbackTitles = [
    "Good",
    "Neutral",
    "Bad"
  ]

  const handleGoodClick = () => {
    const updatedGood = feedbackValues.good + 1
    setFeedbackValue({...feedbackValues, good: updatedGood})
  }

  const handleNeutralClick = () => {
    const updatedNeutral = feedbackValues.neutral + 1
    setFeedbackValue({...feedbackValues, neutral: updatedNeutral})
  }

  const handleBadClick = () => {
    const updatedBad = feedbackValues.bad + 1
    setFeedbackValue({...feedbackValues, bad: updatedBad})
  }

  return (
    <>
      <Heading text={titleText} />
      <div>
        <Button text={feedbackTitles[0]} handleClick={handleGoodClick} />
        <Button text={feedbackTitles[1]} handleClick={handleNeutralClick} />
        <Button text={feedbackTitles[2]} handleClick={handleBadClick} />
      </div>
	  <br/>
      <div>
        <Heading text={headingText}/>
        <Statistics 
        totalFeedback={totalFeedback} 
        feedbackTitles={feedbackTitles}
        feedbackValues={feedbackValues}
        />
      </div>
    </>
  )
}

export default App
