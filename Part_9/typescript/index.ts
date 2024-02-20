import express from 'express';
import * as bmiCalculator from './bmiCalculator';
import * as exerciseCalculator from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  try {
    const queryArray: string[] = [
      req.query['height'] as string,
      req.query['weight'] as string,
    ];

    const { heightInCm, weightInKg } = bmiCalculator.parseArguments(queryArray);

    res.status(200).json({
      weight: weightInKg,
      heightInCm: heightInCm,
      bmi: bmiCalculator.calculateBmi(heightInCm, weightInKg),
    });
  } catch (error: unknown) {
    let errorMessage = 'Encountered an error.';

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    res.status(400).json({ error: errorMessage });
  }
});

app.post('/exercises', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!req.body.target || !req.body.daily_exercises) {
      throw new Error('Missing parameters');
    }

    const queryArray: string[] = [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.body.target as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...(req.body.daily_exercises as string[]),
    ].flat();

    const { target, dailyHours } =
      exerciseCalculator.parseArguments(queryArray);

    res
      .status(200)
      .json(exerciseCalculator.calculateExercises(target, dailyHours));
  } catch (error: unknown) {
    let errorMessage = 'Encountered an error.';

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    res.status(400).json({ error: errorMessage });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
