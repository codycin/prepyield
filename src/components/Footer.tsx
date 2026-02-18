//Nothing special here again, just a footer.

type FooterProps = {
  darkMode: boolean;
};

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer
      className={`mt-5 py-3 text-center small ${
        darkMode
          ? "bg-dark text-light border-top border-secondary"
          : "bg-light text-muted border-top"
      }`}
    >
      <div className="fw-semibold">PrepYield</div>

      <div>Cooking yield calculator • Data stored locally in your browser</div>

      <div className="mt-1">
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/cody-cintron"
          target="_blank"
          rel="noopener noreferrer"
          className={darkMode ? "text-light text-decoration-underline" : ""}
        >
          Cody Cintron
        </a>
      </div>
    </footer>
  );
}
