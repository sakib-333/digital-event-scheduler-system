import { InputLabel, MenuItem, Select } from "@mui/material";
import EventCard from "../../Components/EventCard/EventCard";

const events = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const EventsPage = () => {
  return (
    <div className="p-4 flex flex-col sm:flex-row gap-4">
      <div className="max-w-[200px] min-h-fit h-full w-full space-y-4">
        <div>
          <InputLabel id="demo-select-small-label">Status</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="Category"
            defaultValue={""}
            sx={{ width: "100%", height: "35px" }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value={"upComing"}>Up Coming</MenuItem>
            <MenuItem value={"running"}>Running</MenuItem>
            <MenuItem value={"finished"}>Finished</MenuItem>
          </Select>
        </div>
        <div>
          <InputLabel id="demo-select-small-label">Category</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="Category"
            defaultValue={""}
            sx={{ width: "100%", height: "35px" }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value={"upComing"}>Exams</MenuItem>
            <MenuItem value={"running"}>Feast</MenuItem>
            <MenuItem value={"finished"}>Tour</MenuItem>
            <MenuItem value={"finished"}>Game</MenuItem>
            <MenuItem value={"finished"}>Others</MenuItem>
          </Select>
        </div>
      </div>
      <div className="w-full grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {events.map((event) => (
          <EventCard key={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
