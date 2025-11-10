"use client";

import { MdAutorenew } from "react-icons/md";
import useFormFactura from "./useFormFactura";
import { useEffect } from "react";

const FormFactura = () => {
  const {
    onSubmit2,
    dataFacturacion,
    handleOnChange2,
    catalagoCFDi,
    handleOnSelect2,
    getCatalagoCfdi,
    postalCodes2,
    loadingDataFacturacion,
  } = useFormFactura();

  useEffect(() => {
    getCatalagoCfdi();
  }, []);

  return (
    <div className="w-full">
      <span className="text-[#BB3D4B] text-xl font-bold">
        Datos de Facturación
      </span>
      <form className="w-[100%] my-3 mx-auto" onSubmit={onSubmit2}>
        <div className="grid grid-cols-[auto_auto] gap-2 items-center mt-2 relative">
          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              Razón social:
            </label>

            <input
              type="text"
              className="form-control"
              name="companyName"
              onChange={handleOnChange2}
              value={dataFacturacion?.companyName}
            />
          </div>

          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              RFC:
            </label>

            <input
              type="text"
              className="form-control"
              name="rfc"
              value={dataFacturacion?.rfc}
              onChange={handleOnChange2}
            />
          </div>
        </div>

        <div className="grid grid-cols-[auto_auto] gap-2 items-center mt-2 relative">
          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              Uso de CFDI:
            </label>

            <select
              name="CFDI"
              className="form-select"
              disabled={catalagoCFDi == null}
              onChange={handleOnSelect2}
              value={dataFacturacion.CFDI ?? ""}
            >
              {catalagoCFDi ? (
                <>
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {catalagoCFDi.usosCFDI.map((item) => (
                    <option key={item.clave} value={item.clave}>
                      {item.descripcion}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">Selecciona una opción</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              Régimen Fiscal:
            </label>

            <select
              name="taxRegimen"
              className="form-select"
              disabled={catalagoCFDi == null}
              onChange={handleOnSelect2}
              value={dataFacturacion.taxRegimen}
            >
              {catalagoCFDi ? (
                <>
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {catalagoCFDi.regimenesFiscales.map((item) => (
                    <option key={item.clave} value={item.clave}>
                      {item.descripcion}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">Selecciona una opción</option>
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[auto_auto] gap-2 items-center mt-2 relative">
          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              Método de pago:
            </label>

            <select
              name="methodPay"
              className="form-select"
              onChange={handleOnSelect2}
              value={dataFacturacion.methodPay ?? ""}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta_de_Credito">Tarjeta de credito</option>
              <option value="Tarjeta_de_Debito">Tarjeta de debito</option>
              <option value="transferencia_bancaria">
                Transferencia bancaria
              </option>
              {/* <option value="Mercado_Pago">Mercado Pago</option> */}
            </select>
          </div>
          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              Código Postal *:
            </label>
            <input
              type="number"
              className="form-control"
              name="codePostal"
              value={
                dataFacturacion?.codePostal == 0
                  ? ""
                  : dataFacturacion?.codePostal
              }
              onChange={handleOnChange2}
            />
          </div>
        </div>

        <div className="grid grid-cols-[auto_auto] gap-2 items-center mt-2 relative">
          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              Estado:
            </label>
            <select
              name="state"
              className="form-select"
              disabled={postalCodes2.length === 0}
              onChange={handleOnSelect2}
              value={dataFacturacion.state ?? ""}
            >
              <option value="">
                {postalCodes2.length > 0
                  ? postalCodes2[0].adminName1
                  : "Selecciona un estado"}
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="" className="text-[#808080] text-base text-end">
              Ciudad:
            </label>
            <select
              name="city"
              className="form-select"
              disabled={postalCodes2.length === 0}
              onChange={handleOnSelect2}
              value={dataFacturacion.city ?? ""}
            >
              {postalCodes2.length > 0 ? (
                <option value={postalCodes2[0].adminName3}>
                  {postalCodes2[0].adminName3}
                </option>
              ) : (
                <option value="">Selecciona una ciudad</option>
              )}
            </select>
          </div>
        </div>

        <div className={`grid grid-cols-[2fr] gap-2  mt-4 relative`}>
          <button
            type="submit"
            className="p-2 bg-[#BB3D4B] text-white font-bold mt-4"
            style={{ borderRadius: "10px" }}
            disabled={loadingDataFacturacion}
          >
            {loadingDataFacturacion ? (
              <MdAutorenew size={20} className="m-auto the-spinner" />
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormFactura;
