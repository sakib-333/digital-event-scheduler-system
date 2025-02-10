import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import EventDefaultLogo from "/EventDefaultLogo.png";

const EventCard = () => {
  return (
    <Card
      sx={{ maxWidth: 345 }}
      data-aos="zoom-in"
      data-aos-easing="ease"
      data-aos-once="false"
      data-aos-duration="1000"
    >
      <CardMedia
        sx={{ height: 140 }}
        image={EventDefaultLogo}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Event
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", textAlign: "justify" }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ab
          nobis temporibus. Suscipit sequi velit minus repellat molestiae? Sint
          ex.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Details</Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
