"use client";

const PasswordStrengthBar = ({ strength }: { strength: string }) => {
  const getBarColor = () => {
    switch (strength) {
      case "weak":
        return "bg-red-500 w-1/3";
      case "medium":
        return "bg-orange-400 w-2/3";
      case "strong":
        return "bg-blue-500 w-full";
      default:
        return "bg-gray-300 w-0";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="mt-2 h-2 w-full bg-gray-200 rounded">
        <div
          className={`h-2 rounded transition-all duration-300 ${getBarColor()}`}
        ></div>
      </div>
      {strength ? (
        <div>
          <span style={{ color: "#808080", fontSize: "14px" }}>
            Nivel de contraseña:{" "}
          </span>
          <span
            style={{
              marginLeft: "5px",
              color:
                strength == "weak"
                  ? "red"
                  : strength == "medium"
                  ? "orange"
                  : strength == "strong"
                  ? "blue"
                  : "",
            }}
          >
            {strength == "weak" ? (
              <>
                Debil
                <span
                  style={{
                    color: "grey",
                    fontSize: "12px",
                    marginLeft: "5px",
                    fontWeight: "100",
                  }}
                >
                  Te recomendamos aumentar la seguridad de tu contraseña.
                </span>
              </>
            ) : strength == "medium" ? (
              "Media"
            ) : strength == "strong" ? (
              "Fuerte"
            ) : (
              ""
            )}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default PasswordStrengthBar;
