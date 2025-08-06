import "./login.css";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useLogin from "./useLogin";
import { ChangeEvent } from "react";

const Login = () => {
  const { onSubmit, formData, setFormData, loadingLogin } = useLogin();

  return (
    <div className="option-ingresar">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: event.target.value })
            }
            value={formData.email}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: event.target.value })
            }
            value={formData.password}
          />
        </div>
        <div
          className="br"
          style={{
            width: "80%",
            margin: "auto",
            height: "5px",
            border: "3px solid #fa7c04",
          }}
        ></div>
        <br />

        <a className="link-reset-pass" href="#">
          Olvide mi contraseña
        </a>

        <br />

        <div className="container-actions w-full flex flex-col items-center gap-3">
          <button
            className="bg-amber-300 shadow-amber-50 font-bold cursor-pointer p-2 w-35
            disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled={loadingLogin}
          >
            {loadingLogin ? (
              <div className="flex w-full justify-center items-center">
                <span
                  className="spinner-border spinner-border-sm flex items-center justify-center"
                  aria-hidden="true"
                ></span>
              </div>
            ) : (
              " Iniciar sesión"
            )}
          </button>
          <button className="bg-white shadow-amber-50 font-bold cursor-pointer p-2 w-35">
            Registrarse
          </button>
        </div>
      </form>

      <br />

      <div className="container-separator w-full flex flex-row items-center justify-between">
        <div className="separator"></div>
        <span>o</span>
        <div className="separator"></div>
      </div>

      <br />

      <div className="container-btn-auth flex flex-col items-center justify-center gap-1">
        <button>
          <FcGoogle size={24} />
          Iniciar sesión con Google
        </button>

        <button>
          <FaApple size={24} />
          Iniciar sesión con Apple
        </button>
      </div>
    </div>
  );
};

export default Login;
