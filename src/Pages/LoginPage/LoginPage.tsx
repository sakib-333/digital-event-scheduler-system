import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useAuthInfo from "../../Hooks/useAuthInfo/useAuthInfo";
import SuccessSnackBar from "../../Alerts/SuccessSnackBar/SuccessSnackBar";
import ErrorSnackBar from "../../Alerts/ErrorSnackBar/ErrorSnackBar";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [isPassShowing, setIsPassShowing] = useState<boolean>(false);
  const { setUserLoading, signinUser } = useAuthInfo();
  const [showSuccSnkbar, setShowSuccSnkbar] = useState(false);
  const [showErrSnkbar, setShowErrSnkbar] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signinUser(data.email, data.password)
      .then(() => {
        setShowSuccSnkbar(true);
        reset();
      })
      .catch(() => setShowErrSnkbar(true))
      .finally(() => {
        if (setUserLoading) {
          setUserLoading(false);
        }
      });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          boxShadow: 3,
          padding: "32px",
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
          <Box sx={{ position: "relative" }}>
            <TextField
              {...register("password", { required: true })}
              type={isPassShowing ? "text" : "password"}
              label="Password"
              sx={{ width: "100%" }}
              id="outlined-size-small-password"
              size="small"
            />
            <button
              type="button"
              className="absolute right-4 top-2"
              onClick={() => setIsPassShowing((currState) => !currState)}
            >
              {isPassShowing ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
            </button>
          </Box>
          <Box>
            <Button type="submit" sx={{ width: "100%" }} variant="contained">
              Login
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
      {showSuccSnkbar && (
        <SuccessSnackBar
          showSuccSnkbar={showSuccSnkbar}
          setShowSuccSnkbar={setShowSuccSnkbar}
          message={"Login successful"}
        />
      )}
      {showErrSnkbar && (
        <ErrorSnackBar
          showErrSnkbar={showErrSnkbar}
          setShowErrSnkbar={setShowErrSnkbar}
          message={"Something went wrong"}
        />
      )}
    </div>
  );
};

export default LoginPage;
