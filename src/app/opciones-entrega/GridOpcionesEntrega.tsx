// "use client";

// import { MdAutorenew } from "react-icons/md";
// import PostalCodeLookupI from "../interfaces/geonames/postalCodeLookupJSON/postalCodeLookupJSON.interface";
// import { DataSendI } from "../interfaces/perfil/perfil.interface";

// const GridOpcionesEntrega = (
//   dataAddress: DataSendI,
//   handleOnChange: any,
//   postalCodes: PostalCodeLookupI[],
//   handleOnSelect: any,
//   registerAddress: any,
//   loadingRegisterAddress: boolean,
//   styles: any
// ) => {
//   const htmlFormAddress = (
//     <div className="w-full flex justify-end">
//       <div className="w-[600px] max-h-[500px] min-h-[400px] overflow-y-auto px-3">
//         <span className="text-[#BB3D4B] text-xl font-bold">Datos de Envío</span>

//         <form className="w-[100%] my-3 mx-auto">
//           <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
//             <label htmlFor="" className="text-[#808080] text-base text-end">
//               Calle:
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               name="street"
//               value={dataAddress?.street}
//               onChange={handleOnChange}
//             />
//           </div>

//           <div className="grid grid-cols-[auto_auto] gap-2 items-end justify-end mt-4 relative">
//             <div
//               className="flex justify-center"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2 block">
//                 Número Ext:
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="noExt"
//                 value={dataAddress?.noExt}
//                 onChange={handleOnChange}
//               />
//             </div>
//             <div
//               className="flex justify-center"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Interior: (opcional)
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="noInt"
//                 value={dataAddress?.noInt}
//                 onChange={handleOnChange}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
//             <label htmlFor="" className="text-[#808080] text-base text-end">
//               Código Postal:
//             </label>

//             <input
//               type="number"
//               name="codePostal"
//               className="form-control"
//               onChange={handleOnChange}
//               value={
//                 dataAddress?.codePostal == 0 ? "" : dataAddress?.codePostal
//               }
//             />
//           </div>

//           <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
//             <label htmlFor="" className="text-[#808080] text-base text-end">
//               Colonia:
//             </label>

//             <select
//               name="cologne"
//               className="form-select"
//               disabled={postalCodes.length == 0}
//               onChange={handleOnSelect}
//               value={dataAddress.cologne ?? ""}
//             >
//               {postalCodes && postalCodes.length > 0 ? (
//                 <>
//                   <option value="">Selecciona una colonia</option>
//                   {postalCodes.map((pCodes) => (
//                     <option key={pCodes.placeName} value={pCodes.placeName}>
//                       {pCodes.placeName}
//                     </option>
//                   ))}
//                 </>
//               ) : (
//                 <option value="">Selecciona una colonia</option>
//               )}
//             </select>
//           </div>

//           <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
//             <label htmlFor="" className="text-[#808080] text-base text-end">
//               Estado:
//             </label>

//             <select
//               name="state"
//               className="form-select"
//               disabled={postalCodes.length === 0}
//               onChange={handleOnSelect}
//               value={dataAddress.state ?? ""}
//             >
//               <option value="">
//                 {postalCodes.length > 0
//                   ? postalCodes[0].adminName1
//                   : "Selecciona un estado"}
//               </option>
//             </select>
//           </div>

//           <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
//             <label htmlFor="" className="text-[#808080] text-base text-end">
//               Ciudad:
//             </label>
//             <select
//               name="city"
//               className="form-select"
//               disabled={postalCodes.length === 0}
//               onChange={handleOnSelect}
//               value={dataAddress.city ?? ""}
//             >
//               {postalCodes.length > 0 ? (
//                 <option value={postalCodes[0].adminName3}>
//                   {postalCodes[0].adminName3}
//                 </option>
//               ) : (
//                 <option value="">Selecciona una ciudad</option>
//               )}
//             </select>
//           </div>

//           <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
//             <label htmlFor="" className="text-[#808080] text-base text-end">
//               Teléfono 1:
//             </label>

//             <input
//               type="text"
//               className="form-control"
//               name="phone1"
//               onChange={handleOnChange}
//               value={dataAddress?.phone1}
//             />
//           </div>

//           <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
//             <label htmlFor="" className="text-[#808080] text-base text-end">
//               Teléfono 2: <br /> (opcional)
//             </label>

//             <input
//               type="text"
//               className="form-control"
//               name="phone2"
//               onChange={handleOnChange}
//               value={dataAddress?.phone2}
//             />
//           </div>

//           <div
//             className={`grid grid-cols-[auto] gap-2 items-center mt-4 relative ${styles.containerBtnGuardar1}`}
//           >
//             <button
//               type="button"
//               onClick={() => {
//                 registerAddress(dataAddress);
//               }}
//               disabled={loadingRegisterAddress}
//               className="p-2 bg-[#BB3D4B] text-white font-bold mt-4"
//               style={{ borderRadius: "10px" }}
//             >
//               {loadingRegisterAddress ? (
//                 <MdAutorenew size={20} className="m-auto the-spinner" />
//               ) : (
//                 "Guardar"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   return {
//     htmlFormAddress,
//   };
// };

// export default GridOpcionesEntrega;
