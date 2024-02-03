import Hero from "@/components/Hero/Hero";
import { Navbar } from "@/components/shared/Navbar";

const Page = () => {
  return (
    <main className="mx-auto w-full overflow-hidden">
      <Navbar />
      <Hero />
    </main>
  );
};

export default Page;
