import { useTheme } from "@mui/material";
import CountUp from "react-countup";
import Heading from "../../../Components/Heading/Heading";

const EventsCounter = () => {
  const {
    palette: { mode },
  } = useTheme();

  return (
    <div
      className={`py-8  ${
        mode === "light" ? "bg-[#cfd8dc]" : "bg-[#333333]"
      } px-4`}
    >
      <Heading title={"Events Counter"} />
      <div className="grid grid-cols-1 sm:grid-cols-3 justify-items-center">
        <div className="flex flex-col items-center">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            <CountUp start={0} end={110} duration={10} />
          </p>
          <h1>Total Events</h1>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            <CountUp start={0} end={30} duration={10} />
          </p>
          <h1>Up Coming Events</h1>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            <CountUp start={0} end={80} duration={10} />
          </p>
          <h1>Completed Events</h1>
        </div>
      </div>
    </div>
  );
};

export default EventsCounter;
