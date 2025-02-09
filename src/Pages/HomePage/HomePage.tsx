import Banner from "./Banner/Banner";
import EventsCounter from "./SuccessCounter/EventsCounter";
import UpComingEvents from "./UpComingEvents/UpComingEvents";

const HomePage = () => {
  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
      <Banner />
      <UpComingEvents />
      <EventsCounter />
    </div>
  );
};

export default HomePage;
