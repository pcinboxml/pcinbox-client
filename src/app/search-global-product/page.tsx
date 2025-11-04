"use client";

const SearchGlobalProduct = () => {
  return (
    <div className="container flex">
      <aside className="border w-[250px] pt-4">
        <span className="text-[#BB3D4B] block mx-4 font-bold text-[20px]">
          Marcas
        </span>
        <ul>
          <li>
            <div className="flex items-end-safe border">
              <input
                type="radio"
                name="envio"
                // id="sucursal"
                className="mx-2"
                value="sucursal"
                //  checked={optionEnvio === "sucursal"}
                //  onChange={handleOnChangeOptionEnvio}
              />

              <label
                className="form-check-label"
                //htmlFor="sucursal"
              >
                <span
                  className="text-[#666666] text-sm"
                  style={{
                    display: "block",
                    marginBottom: "-4px",
                    marginLeft: "1px",
                  }}
                >
                  Marca 1
                </span>
              </label>
              <hr />
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SearchGlobalProduct;
