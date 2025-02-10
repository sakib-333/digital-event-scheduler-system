import { Box, Button, TextField, Typography } from "@mui/material";
import Heading from "../../Components/Heading/Heading";
import SendIcon from "@mui/icons-material/Send";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  senderName: string;
  senderEmail: string;
  emailSubject: string;
  message: string;
};

const ContactPage = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };
  return (
    <div
      data-aos="zoom-in"
      data-aos-easing="ease"
      data-aos-once="false"
      data-aos-duration="800"
    >
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Heading title={"Contact"} />
        <Typography
          variant="subtitle1"
          sx={{
            color: "text.secondary",
            maxWidth: "500px",
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          Please feel free to post your questions, comments and suggestions. We
          are eager to assist you and serve you better.
        </Typography>
        <Box sx={{ marginTop: "10px" }}>
          <TextField
            label="Your Name"
            {...register("senderName", { required: true })}
            type="text"
            sx={{ width: "100%" }}
            id="outlined-size-small-name"
            size="small"
          />
        </Box>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              label="Your Email"
              type="email"
              {...register("senderEmail", { required: true })}
              sx={{ width: "100%" }}
              id="outlined-size-small-email"
              size="small"
            />
          </Box>
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              label="Email Subject"
              {...register("emailSubject", { required: true })}
              type="text"
              sx={{ width: "100%" }}
              id="outlined-size-small-email-subject"
              size="small"
            />
          </Box>
        </div>
        <Box sx={{ marginTop: "10px" }}>
          <TextField
            label="Your message"
            {...register("message", { required: true })}
            type="text"
            sx={{ width: "100%" }}
            id="outlined-size-small-message"
            multiline
            rows={5}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: "100%" }}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ContactPage;
