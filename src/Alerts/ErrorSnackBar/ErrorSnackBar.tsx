import { Alert, Snackbar } from "@mui/material";

interface SnackbarAlertProps {
  showErrSnkbar: boolean;
  setShowErrSnkbar: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}

const ErrorSnackBar = ({
  showErrSnkbar,
  setShowErrSnkbar,
  message = "",
}: SnackbarAlertProps) => {
  const handleClose = () => {
    setShowErrSnkbar(false);
  };

  return (
    <div>
      <Snackbar
        open={showErrSnkbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ErrorSnackBar;
