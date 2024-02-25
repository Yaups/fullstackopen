export type ErrorMessage = string;

export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
}

export interface NewDiaryEntry {
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export interface EntryProps {
  entry: DiaryEntry;
}

export interface EntriesProps {
  entries: DiaryEntry[];
}

export interface EntryFormProps {
  entries: DiaryEntry[];
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export interface NotificationProps {
  errorMessage: ErrorMessage;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
