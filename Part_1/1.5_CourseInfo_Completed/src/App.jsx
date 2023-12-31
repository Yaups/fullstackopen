
const Part = ({ partName, numberOfExercises }) => {
  return (
    <div>
      <p>{partName} {numberOfExercises}</p>
    </div>
  )
}

const Header = ({ coursename }) => {
  return (
    <div>
      <h1>{coursename}</h1>
    </div>
  )
}

const Content = props => {
  return (
    <div>
      <Part partName={props.parts[0].name} 
      numberOfExercises={props.parts[0].exercises}
      />
      <Part partName={props.parts[1].name} 
      numberOfExercises={props.parts[1].exercises}
      />
      <Part partName={props.parts[2].name} 
      numberOfExercises={props.parts[2].exercises}
      />
    </div>
  )
}

const Total = props => {
  return (
    <div>
      <p>
        Number of exercises {' '}
        {props.parts[0].exercises + props.parts[1].exercises + 
        props.parts[2].exercises}
      </p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header coursename={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App