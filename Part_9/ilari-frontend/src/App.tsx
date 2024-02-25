import { useState, useEffect } from "react";
import { DiaryEntry, ErrorMessage } from "./types";
import Entries from "./components/Entries";
import diaryService from "./services/diaryService";
import EntryForm from "./components/EntryForm";
import Notification from "./components/Notification";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>("");

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
      {errorMessage !== "" && (
        <Notification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
      <EntryForm
        entries={entries}
        setEntries={setEntries}
        setErrorMessage={setErrorMessage}
      />
      <Entries entries={entries} />
    </div>
  );
};

export default App;
