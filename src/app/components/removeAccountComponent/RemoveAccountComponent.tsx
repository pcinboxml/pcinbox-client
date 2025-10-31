"use client";

import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { useEffect, useState } from "react";
import { MdAutorenew } from "react-icons/md";

const RemoveAccountComponent = () => {
  const [pass, setPass] = useState<string>("");
  const [loadingRemoveAccount, setLoadingRemoveAccount] =
    useState<boolean>(false);
  const [authGoogle, setAuthGoogle] = useState<boolean | null>(null);

  const { requestPost } = useService();
  const { setDataModal } = useTheContext();

  useEffect(() => {
    if (
      localStorage.getItem("authGoogle") &&
      localStorage.getItem("authGoogle") == "true"
    ) {
      setAuthGoogle(true);
    } else if (
      localStorage.getItem("authGoogle") &&
      localStorage.getItem("authGoogle") == "false"
    ) {
      setAuthGoogle(false);
    }
  }, []);

  const handleOnRemoveAccount = async () => {
    if (authGoogle == false && (pass.trim() == "" || pass.trim().length == 0)) {
      return;
    }
    try {
      setLoadingRemoveAccount(true);
      const resp = await requestPost(
        {
          pass: pass,
        },
        "/user/removeAccount"
      );
      if (resp.status == 200) {
        setLoadingRemoveAccount(false);

        setDataModal({
          isOpen: true,
          title: "Correcto",
          message: "Cuenta eliminada correctamente",
          type: "success",
          showActions: true,
          onClose: () => {
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("lastname");
            localStorage.removeItem("authGoogle");
            localStorage.removeItem("idUser");
            window.location.href = "/principal";
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("lastname");
            localStorage.removeItem("authGoogle");
            localStorage.removeItem("idUser");
            window.location.href = "/principal";
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error) {
      setLoadingRemoveAccount(false);
    }
  };

  return (
    <form
      className="px-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <span className="block my-2 text-center">
        ¿Estas seguro de {authGoogle ? "desvincular" : "eliminar"} tu cuenta?
        esto no se puede deshacer
      </span>
      {authGoogle == false ? (
        <input
          type="password"
          value={pass}
          onChange={(event) => setPass(event.target.value)}
          className="w-[100%] border p-1"
          placeholder="Confirma tu contraseña:"
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              await handleOnRemoveAccount();
            }
          }}
        />
      ) : null}

      <div className="w-full flex justify-evenly gap-2 mt-3">
        <button
          onClick={() => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }}
          className="cursor-pointer w-[auto] p-2 rounded text-black font-bold border"
        >
          Cancelar
        </button>
        <button
          disabled={loadingRemoveAccount}
          type="button"
          onClick={async () => {
            await handleOnRemoveAccount();
          }}
          className="cursor-pointer w-[auto] p-2 rounded text-white font-bold bg-[#bb3d4b]"
        >
          {loadingRemoveAccount ? (
            <MdAutorenew size={20} className="m-auto the-spinner" />
          ) : (
            <>Eliminar cuenta</>
          )}
        </button>
      </div>
    </form>
  );
};

export default RemoveAccountComponent;
