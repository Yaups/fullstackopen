import axios from "axios";
import { DiaryEntry, NewDiaryEntry, ErrorMessage } from "../types";

const baseUrl: string = "http://localhost:3000/api/diaries";

const getAllDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

const postDiaryEntry = async (
  newDiaryEntry: NewDiaryEntry
): Promise<DiaryEntry> => {
  const response = await axios.post<DiaryEntry>(baseUrl, newDiaryEntry);
  return response.data;
};

const verifyError = (error: unknown): ErrorMessage => {
  if (axios.isAxiosError(error)) {
    if (error.response !== undefined) return error.response.data;
  }

  return "Unknown Error";
};

export default { getAllDiaryEntries, postDiaryEntry, verifyError };
