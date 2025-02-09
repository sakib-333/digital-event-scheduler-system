import Heading from "../../../Components/Heading/Heading";
import createProfile from "../Assets/createProfile.svg";
import addEvents from "../Assets/addEvents.svg";
import viewEvents from "../Assets/viewEvents.svg";

const HowItWorks = () => {
  return (
    <div className="py-8">
      <Heading title={"How It Works"} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <img
            className="w-20 rounded-full border border-black p-2"
            src={createProfile}
          />
          <h1 className="font-bold">Create Profile</h1>
          <p className="text-xs">Create profile to continue further process.</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            className="w-20 rounded-full border border-black p-2"
            src={addEvents}
          />
          <h1 className="font-bold">Add Event</h1>
          <p className="text-xs">Add your event and wait for approval</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            className="w-20 rounded-full border border-black p-2"
            src={viewEvents}
          />
          <h1 className="font-bold">Viw Event</h1>
          <p className="text-xs">
            After approval of admin you can view your event
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
