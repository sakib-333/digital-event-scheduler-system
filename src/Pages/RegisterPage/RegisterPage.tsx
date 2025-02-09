import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import useAuthInfo from "../../Hooks/useAuthInfo/useAuthInfo";
import SuccessSnackBar from "../../Alerts/SuccessSnackBar/SuccessSnackBar";
import ErrorSnackBar from "../../Alerts/ErrorSnackBar/ErrorSnackBar";

type Inputs = {
  displayName: string;
  photoURL: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const [isPassShowing, setIsPassShowing] = useState<boolean>(false);
  const { setUserLoading, signupUser, updateUserProfile } = useAuthInfo();
  const [showSuccSnkbar, setShowSuccSnkbar] = useState(false);
  const [showErrSnkbar, setShowErrSnkbar] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signupUser(data.email, data.password)
      .then(() => {
        updateUserProfile({
          displayName: data.displayName,
          photoURL: data.photoURL,
        }).then(() => {
          setShowSuccSnkbar(true);
          reset();
        });
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
          Register
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ opacity: 0.7, textAlign: "center" }}
        >
          Welcome, please complete registration
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              {...register("displayName", { required: true })}
              label="Your full name"
              type="text"
              sx={{ width: "100%" }}
              id="outlined-size-small-displayName"
              size="small"
            />
          </Box>
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              {...register("email", { required: true })}
              label="Email address"
              type="email"
              sx={{ width: "100%" }}
              id="outlined-size-small-email"
              size="small"
            />
          </Box>
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              {...register("photoURL", { required: true })}
              label="Photo URL"
              type="text"
              sx={{ width: "100%" }}
              id="outlined-size-small-photoURL"
              size="small"
            />
          </Box>
          <Box sx={{ position: "relative" }}>
            <TextField
              {...register("password", {
                required: true,
                pattern: /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*\d)).{6,}$/,
              })}
              type={isPassShowing ? "text" : "password"}
              label="Password"
              sx={{ width: "100%" }}
              id="outlined-size-small-password"
              size="small"
            />
            {errors?.password && (
              <p className="text-justify text-red-400 text-xs">
                Must contain at least one uppercase, one lowercase, one number
                and length at least 6
              </p>
            )}
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
              register
            </Button>
          </Box>
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            <span>Already have an account? Login </span>{" "}
            <span className="text-[#00f] hover:underline">
              <Link to={"/login"}>here.</Link>
            </span>
          </Typography>
        </Box>
      </Box>
      {showSuccSnkbar && (
        <SuccessSnackBar
          showSuccSnkbar={showSuccSnkbar}
          setShowSuccSnkbar={setShowSuccSnkbar}
          message={"Registration successful"}
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

export default RegisterPage;
