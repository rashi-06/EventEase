const HeroSection = () => {
  return (
    <section className="bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-24 flex flex-col items-center text-center">
        
        {/* Badge */}
        <span className="mb-4 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          Build Faster with Confidence
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Craft modern web experiences <br />
          <span className="text-primary">with clean UI</span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg text-foreground/80">
          A scalable, theme-aware UI foundation built with Tailwind CSS,
          CSS variables, and modern React best practices.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="rounded-lg bg-primary px-6 py-3 text-white font-medium hover:opacity-90 transition">
            Get Started
          </button>

          <button className="rounded-lg border border-primary px-6 py-3 text-primary font-medium hover:bg-primary hover:text-white transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
