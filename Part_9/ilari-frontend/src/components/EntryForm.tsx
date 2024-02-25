import {
  EntryFormProps,
  NewDiaryEntry,
  Visibility,
  Weather,
  ErrorMessage,
} from "../types";
import diaryService from "../services/diaryService";
import { useState } from "react";

const EntryForm = (props: EntryFormProps) => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>("");
  const [date, setDate] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newDiaryEntry: NewDiaryEntry = {
      date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment,
    };

    try {
      const newEntryToAdd = await diaryService.postDiaryEntry(newDiaryEntry);
      props.setEntries(props.entries.concat(newEntryToAdd));

      setDate("");
      setVisibility("");
      setWeather("");
      setComment("");
    } catch (error: unknown) {
      const verifiedMessage: ErrorMessage = diaryService.verifyError(error);
      setErrorMessage(verifiedMessage);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const notification = () => <h4 style={{ color: "red" }}>{errorMessage}</h4>;

  return (
    <div>
      <h2>Add a new entry:</h2>
      {errorMessage !== "" && notification()}
      <form onSubmit={handleSubmit}>
        Date:{" "}
        <input
          type="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <br />
        Visibility: Great{" "}
        <input
          type="radio"
          name="visibility"
          value={visibility}
          onChange={() => setVisibility("great")}
        />{" "}
        Good{" "}
        <input
          type="radio"
          name="visibility"
          value={visibility}
          onChange={() => setVisibility("good")}
        />{" "}
        Ok{" "}
        <input
          type="radio"
          name="visibility"
          value={visibility}
          onChange={() => setVisibility("ok")}
        />{" "}
        Poor{" "}
        <input
          type="radio"
          name="visibility"
          value={visibility}
          onChange={() => setVisibility("poor")}
        />{" "}
        <br />
        Weather: Sunny{" "}
        <input
          type="radio"
          name="weather"
          value={weather}
          onChange={() => setWeather("sunny")}
        />{" "}
        Rainy{" "}
        <input
          type="radio"
          name="weather"
          value={weather}
          onChange={() => setWeather("rainy")}
        />{" "}
        Cloudy{" "}
        <input
          type="radio"
          name="weather"
          value={weather}
          onChange={() => setWeather("cloudy")}
        />{" "}
        Stormy{" "}
        <input
          type="radio"
          name="weather"
          value={weather}
          onChange={() => setWeather("stormy")}
        />{" "}
        Windy{" "}
        <input
          type="radio"
          name="weather"
          value={weather}
          onChange={() => setWeather("windy")}
        />{" "}
        <br />
        Comment:{" "}
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <br />
        <button>Add</button>
      </form>
    </div>
  );
};

export default EntryForm;
