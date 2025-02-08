import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          boxShadow: 3,
          paddingX: "32px",
          paddingY: "64px",
          maxWidth: "400px",
          width: "100%",
          borderRadius: "4px",
          border: "1px solid #fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Sign in
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ opacity: 0.7, textAlign: "center" }}
        >
          Welcome, please sign in to continue
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              {...register("email", { required: true })}
              label="Email"
              type="email"
              sx={{ width: "100%" }}
              id="outlined-size-small-email"
              size="small"
            />
          </Box>
          <Box>
            <TextField
              {...register("password", { required: true })}
              type="password"
              label="Password"
              sx={{ width: "100%" }}
              id="outlined-size-small-password"
              size="small"
            />
          </Box>
          <Box>
            <Button type="submit" sx={{ width: "100%" }} variant="contained">
              Submit
            </Button>
          </Box>
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            <span>Don't have an account? Register </span>{" "}
            <span className="text-[#00f] hover:underline">
              <Link to={"/register"}>here.</Link>
            </span>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
