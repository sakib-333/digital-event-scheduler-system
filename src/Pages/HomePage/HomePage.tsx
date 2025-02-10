import Banner from "./Banner/Banner";
import FAQs from "./FAQs/FAQs";
import HowItWorks from "./HowItWorks/HowItWorks";
import EventsCounter from "./SuccessCounter/EventsCounter";
import UpComingEvents from "./UpComingEvents/UpComingEvents";

const HomePage = () => {
  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
      <Banner />
      <UpComingEvents />
      <HowItWorks />
      <EventsCounter />
      <FAQs />
    </div>
  );
};

export default HomePage;
