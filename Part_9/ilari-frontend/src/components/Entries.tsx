import { EntriesProps, EntryProps, DiaryEntry } from "../types";

const Entries = (props: EntriesProps) => (
  <div>
    <h2>Diary Entries:</h2>
    {props.entries.map((entry) => (
      <Entry key={entry.id} entry={entry} />
    ))}
  </div>
);

const Entry = (props: EntryProps) => {
  const entry: DiaryEntry = props.entry;
  return (
    <div>
      <h3>{entry.date}</h3>
      <li>Weather conditions: {entry.weather}</li>
      <li>Visibility: {entry.visibility}</li>
    </div>
  );
};

export default Entries;
