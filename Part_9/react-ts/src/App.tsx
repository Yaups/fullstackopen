interface HeaderProps {
  courseName: string;
}

const Header = (props: HeaderProps) => <h1>{props.courseName}</h1>;

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

interface ContentProps {
  courseParts: CoursePart[];
}

interface PartProps {
  part: CoursePart;
}

const Content = (props: ContentProps) =>
  props.courseParts.map((part) => <Part key={part.name} part={part} />);

interface TotalProps {
  totalExercises: number;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: PartProps) => {
  const part: CoursePart = props.part;
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>
            <i>{part.description}</i>
          </li>
          <br />
        </div>
      );
    case "group":
      return (
        <div>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>Number of group project exercises: {part.groupProjectCount}</li>
          <br />
        </div>
      );
    case "background":
      return (
        <div>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>
            <i>{part.description}</i>
          </li>
          <li>Background material: {part.backgroundMaterial}</li>
          <br />
        </div>
      );
    case "special":
      return (
        <div>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>
            <i>{part.description}</i>
          </li>
          <li>Required skills: {part.requirements.join(", ")}</li>
          <br />
        </div>
      );
    default:
      return assertNever(part);
  }
};

const Total = (props: TotalProps) => (
  <p>Number of exercises {props.totalExercises}</p>
);

const App = () => {
  const courseName: string = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  const totalExercises: number = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
