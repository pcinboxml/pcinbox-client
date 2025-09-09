"use client";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  stepConnectorClasses,
} from "@mui/material";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// PASOS
const steps = [
  { label: "Confirma tus productos" },
  { label: "Opciones de entrega" },
  { label: "Selecciona una forma de pago" },
  { label: "Finaliza tu orden" },
];

// CONECTOR PERSONALIZADO
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22, // alineación vertical
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#990000", // línea activa
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: "#990000", // línea completada
  },
}));

// ICONO PERSONALIZADO DEL PASO
const StepIconComponent = ({
  active,
  completed,
}: {
  active: any;
  completed: any;
}) => {
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: active || completed ? "#990000" : "#ccc",
        border: active || completed ? "2px solid #990000" : "",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Aquí va tu icono personalizado */}
      <img src="/caja_blanca_pcinbox.png" alt="step" width={18} />
    </Box>
  );
};

// COMPONENTE PRINCIPAL
const TimelineComponent = ({ activeStep }: { activeStep: any }) => {
  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<CustomConnector />}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={(props) => (
                <StepIconComponent
                  active={index === activeStep}
                  completed={index < activeStep}
                />
              )}
            >
              <Typography
                sx={{
                  mt: 2,
                  fontSize: "13px",
                  fontWeight: index === activeStep ? 700 : 400,
                  fontStyle: "italic",
                  color: index === activeStep ? "#990000" : "black",
                }}
              >
                Paso {index + 1}
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: index === activeStep ? 700 : 400,
                  fontStyle: "italic",
                  color: index === activeStep ? "#990000" : "black",
                }}
              >
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default TimelineComponent;
