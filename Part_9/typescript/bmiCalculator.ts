interface BmiInputValues {
  heightInCm: number;
  weightInKg: number;
}

export const parseArguments = (args: string[]): BmiInputValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      heightInCm: Number(args[2]),
      weightInKg: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateBmi = (heightInCm: number, weightInKg: number): string => {
  const heightInMetres: number = heightInCm / 100;
  const bmi: number = weightInKg / (heightInMetres ^ 2);

  if (bmi >= 30) {
    return 'Obese';
  }
  if (bmi > 25) {
    return 'Overweight';
  }
  return 'Healthy weight';
};

try {
  const { heightInCm, weightInKg } = parseArguments(process.argv);
  console.log(calculateBmi(heightInCm, weightInKg));
} catch (error: unknown) {
  let errorMessage = 'Encountered an error.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
