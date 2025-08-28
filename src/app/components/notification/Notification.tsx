"use client";
import { Snackbar, Alert } from "@mui/material";

const Notification = ({ dataNotification }: { dataNotification: any }) => {
  return (
    <Snackbar
      open={dataNotification.open}
      autoHideDuration={1500}
      onClose={dataNotification.handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={dataNotification.handleClose}
        severity={dataNotification.type}
        sx={{
          backgroundColor: "white",
          color: "#333",
          boxShadow: 4,
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          minWidth: 280,
          maxWidth: 360,
          px: 2,
          py: 1.5,
          fontSize: "0.95rem",
          "& .MuiAlert-icon": {
            color: dataNotification.type == "success" ? "#2e7d32" : "#0288d1",
          },
        }}
        variant="outlined"
      >
        {dataNotification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
