interface ExerciseAnalysis {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface CalculatorInputs {
  target: number;
  dailyHours: number[];
}

const hasNan = (array: number[]): boolean => {
  return isNaN(array.reduce((a, b) => a + b, 0));
};

export const parseArguments = (args: string[]): CalculatorInputs => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const dailyHours: number[] = [];
  for (let i: number = 0; i < args.length - 1; i++) {
    dailyHours[i] = Number(args[i + 1]);
  }

  if (!isNaN(Number(args[0])) && !hasNan(dailyHours)) {
    return {
      target: Number(args[0]),
      dailyHours,
    };
  } else {
    throw new Error('Malformatted parameters');
  }
};

export const calculateExercises = (
  target: number,
  dailyHours: number[]
): ExerciseAnalysis => {
  const trainingDays: number = dailyHours.filter((hours) => hours > 0).length;

  const average: number =
    dailyHours.reduce((a, b) => a + b, 0) / dailyHours.length;

  let rating: number;
  let ratingDescription: string;
  if (average >= target) {
    rating = 3;
    ratingDescription = 'Target reached! Keep at it!';
  } else if (average >= target / 2) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better!';
  } else {
    rating = 1;
    ratingDescription = 'Not very good, try better next time!';
  }

  return {
    periodLength: dailyHours.length,
    trainingDays,
    success: average >= target ? true : false,
    rating,
    ratingDescription,
    target,
    average,
  };
};

/*
const main = (): void => {
  try {
    const { target, dailyHours } = parseArguments(process.argv);
    console.log(calculateExercises(target, dailyHours));
  } catch (error: unknown) {
    let errorMessage = 'Encountered an error.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
};

main();
*/
