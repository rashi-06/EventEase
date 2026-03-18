import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-24 flex flex-col items-center text-center">
        
        {/* Badge */}
        <span className="mb-4 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          Discover, host, and book unforgettable events
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Find the right event, <br />
          <span className="text-primary">reserve your seat in minutes</span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-lg text-foreground/80">
          EventEase brings public events, personal bookings, organizer tools,
          and payments into one smooth booking experience.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/home/allEvents"
            className="rounded-lg bg-primary px-6 py-3 text-white font-medium hover:opacity-90 transition"
          >
            Explore Events
          </Link>

          <Link
            href="/auth/signup"
            className="rounded-lg border border-primary px-6 py-3 text-primary font-medium hover:bg-primary hover:text-white transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
