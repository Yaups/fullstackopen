const Course = ({course}) => {
    return (
        <>
            <Header coursename={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

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

const Content = ({parts}) => {
    return (
    <div>
        {parts.map(part => 
        <Part
            partName={part.name}
            numberOfExercises={part.exercises}
            key={part.id}
        />
        )}
    </div>
    )
}

const Total = ({parts}) => {
    return (
    <div>
        <p>
        Number of exercises {' '}
        {parts.reduce((sum, part) => sum + part.exercises , 0)}
        </p>
    </div>
    )
}


export default Course