import { Alert, Snackbar } from "@mui/material";

interface SnackbarAlertProps {
  showSuccSnkbar: boolean;
  setShowSuccSnkbar: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}

const SuccessSnackBar = ({
  showSuccSnkbar,
  setShowSuccSnkbar,
  message = "",
}: SnackbarAlertProps) => {
  const handleClose = () => {
    setShowSuccSnkbar(false);
  };

  return (
    <div>
      <Snackbar
        open={showSuccSnkbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SuccessSnackBar;
