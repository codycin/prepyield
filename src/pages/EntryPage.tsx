//EntryPage component that displays the list of entries.
//It receives the darkMode prop to pass down to the Entries component for consistent styling.
import Entries from "../components/Entries";

type EntryPageProps = {
  darkMode: boolean;
};

export default function EntryPage({ darkMode }: EntryPageProps) {
  return (
    <div className="text-center">
      <Entries darkMode={darkMode} />
    </div>
  );
}
