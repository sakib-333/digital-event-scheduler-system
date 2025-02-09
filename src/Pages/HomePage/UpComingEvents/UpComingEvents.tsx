import EventCard from "../../../Components/EventCard/EventCard";
import Heading from "../../../Components/Heading/Heading";

const events = [1, 2, 3, 4, 5, 6];

const UpComingEvents = () => {
  return (
    <div className="py-8">
      <Heading title={"Up Coming Events"} />
      <div className="w-10/12 mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {events.map((event) => (
          <EventCard key={event} />
        ))}
      </div>
    </div>
  );
};

export default UpComingEvents;
