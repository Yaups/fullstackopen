import { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import Entries from "./components/Entries";
import diaryService from "./services/diaryService";
import EntryForm from "./components/EntryForm";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const initialiseEntries = async (): Promise<void> => {
      const initialEntries: DiaryEntry[] =
        await diaryService.getAllDiaryEntries();
      setEntries(initialEntries);
    };
    initialiseEntries();
  }, []);

  return (
    <div>
      <EntryForm entries={entries} setEntries={setEntries} />
      <Entries entries={entries} />
    </div>
  );
};

export default App;
