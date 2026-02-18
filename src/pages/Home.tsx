//Home page component that displays the Hero and About sections.
import About from "../components/About";
import Hero from "../components/Hero";

type HeroPageProps = {
  darkMode: boolean;
};

export default function Home({ darkMode }: HeroPageProps) {
  return (
    <>
      <div className="container-fluid px-2 text-center">
        <Hero darkMode={darkMode} />
      </div>
      <About />
    </>
  );
}
