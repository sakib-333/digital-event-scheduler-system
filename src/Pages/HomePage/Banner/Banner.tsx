import Carousel from "react-material-ui-carousel";
import bgImageOne from "../Assets/bgImageOne.svg";
import bgImageTwo from "../Assets/bgImageTwo.svg";
import bgImageThree from "../Assets/bgImageThree.svg";
import bgImageFour from "../Assets/bgImageFour.svg";
import bgImageFive from "../Assets/bgImageFive.svg";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
const Banner = () => {
  const items = [
    {
      id: "slide-1",
      name: "Plan Your Events with Ease",
      description:
        "Effortlessly schedule and manage all your events in one place. Stay organized, stay on top.",
      bgImage: bgImageOne,
    },
    {
      id: "slide-2",
      name: "Never Miss a Moment",
      description:
        "With our real-time scheduling system, never miss a key event again. Get alerts and reminders right on time!",
      bgImage: bgImageTwo,
    },
    {
      id: "slide-3",
      name: "Flexible & Customizable",
      description:
        "Tailor your event schedules to your needs. Flexible options for any type of event!",
      bgImage: bgImageThree,
    },
    {
      id: "slide-4",
      name: "Real-Time Updates",
      description:
        "Make last-minute changes with ease and notify everyone instantly with real-time updates.",
      bgImage: bgImageFour,
    },
    {
      id: "slide-4",
      name: "Seamless Integration",
      description:
        "Integrate with your favorite calendars and apps to keep all your events in sync.",
      bgImage: bgImageFive,
    },
  ];

  return (
    <div>
      <Carousel stopAutoPlayOnHover={false}>
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full min-h-[400px] text-white rounded-md text-center flex flex-col items-center justify-center space-y-4"
            style={{
              width: "100%",
              backgroundImage: `url(${item.bgImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "constian",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backgroundBlendMode: "darken",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              {item.name}
            </h1>
            <p className="max-w-md w-full opacity-70">{item.description}</p>

            <Link to={"/events"}>
              <Button variant="contained" color="success">
                See All Events
              </Button>
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
