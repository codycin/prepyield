{
  /*About component, nothing special*/
}
export default function About() {
  return (
    <div className="container py-4">
      <h1 className="h3 mb-3 fw-semibold text-center">About PrepYield</h1>

      <p className="text-center lead">
        PrepYield is a lightweight tool for tracking food weight before and
        after cooking, helping you understand cooking yield and moisture loss.
      </p>

      <h2 className="h5 mt-4">Why PrepYield?</h2>
      <p>
        Cooking can significantly change the weight of food due to water loss,
        fat rendering, and trimming. PrepYield makes those changes visible so
        you can cook more consistently, portion accurately, and better
        understand real-world yields.
      </p>

      <h2 className="h5 mt-4">What it does</h2>
      <ul>
        <li>Calculates cooking yield and loss percentages</li>
        <li>Supports metric and imperial units</li>
        <li>Stores entries locally in your browser</li>
        <li>Works fully offline once loaded</li>
      </ul>

      <h2 className="h5 mt-4">What it doesn’t do</h2>
      <ul>
        <li>Track calories or nutrition</li>
        <li>Assume cooking methods or temperatures</li>
        <li>Sync data across devices</li>
      </ul>

      <h2 className="h5 mt-4">Usage Notes</h2>
      <ul>
        <li>Add shortcut to homescreen for best experience</li>
        <li>
          Enter raw and cooked weights in the same units (e.g., grams or ounces)
        </li>
        <li>Results are calculated based on the data you enter</li>
      </ul>

      <h2 className="h5 mt-4">Data notes</h2>
      <p>
        Results vary depending on cooking method, cut of meat, fat content, and
        preparation. PrepYield reflects the data you enter—it does not apply
        predefined yield assumptions.
      </p>

      <h2 className="h5 mt-4">Open source</h2>
      <p>
        PrepYield was created by{" "}
        <a
          href="https://linkedin.com/in/cody-cintron"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cody Cintron
        </a>{" "}
        as a personal project and is open source on{" "}
        <a
          href="https://github.com/codycin/prepyield"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        . Feedback, issues, and contributions are welcome.
      </p>
    </div>
  );
}
