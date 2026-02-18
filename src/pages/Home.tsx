//Home page component that displays the Hero and About sections.
import About from "../components/About";
import Hero from "../components/Hero";

type HeroPageProps = {
  darkMode: boolean;
};

export default function Home({ darkMode }: HeroPageProps) {
  return (
    <>
      <div className="container-fluid px-2 text-center mb-5">
        <Hero darkMode={darkMode} />
      </div>
      <section className="container mt-5">
        <About />
      </section>
    </>
  );
}
