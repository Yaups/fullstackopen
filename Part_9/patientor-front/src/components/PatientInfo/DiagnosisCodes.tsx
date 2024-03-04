import { Diagnosis, Entry } from "../../types";

interface DiagnosisCodesProps {
  entry: Entry;
  diagnoses: Diagnosis[] | null;
}

const DiagnosisCodes = (props: DiagnosisCodesProps) => {
  if (!props.entry.diagnosisCodes || !props.diagnoses) return null;

  const diagnosisCodes = props.entry.diagnosisCodes;
  const diagnoses = props.diagnoses;

  return (
    <ul>
      {diagnosisCodes.map((code) => {
        const description = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            {code} {""}
            {description && description.name}
          </li>
        );
      })}
    </ul>
  );
};

export default DiagnosisCodes;
