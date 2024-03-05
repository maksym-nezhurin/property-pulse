import {Hero} from "@/components/Hero";
import {InfoBoxes} from "@/components/InfoBoxes";
import {Footer} from "@/components/Footer";
import {HomeProperties} from "@/components/HomeProperties";

export const metadata = {
  title: 'Main page',
  description: 'Main description'
}

export default async function Home() {
  return (
    <main className="">
      <Hero />
      <InfoBoxes />
      <HomeProperties />
      <Footer/>
    </main>
  );
}
