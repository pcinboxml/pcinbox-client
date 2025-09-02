// "use client";

// import useService from "../services/useService";
// import SidebarMiCuenta from "./../components/sidebar-mi-cuenta/SidebarMiCuenta";
// import styles from "./mi-cuenta.module.css";

// const MiCuenta = () => {
//   const { onRouterLink } = useService();

//   return (
//     <section className={styles.section}>
//       <div className="w-[20%] border">
//         <SidebarMiCuenta />
//       </div>

//       <div className="w-[80%] border p-3">
//         <div className="containerCar w-[45%] border flex p-2">
//           <div className="containerPhoto w-[50%] h-[100%]">
//             <div className="border p-2 relative">
//               <div
//                 className="capa absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
//                 style={{ background: "rgba(255,255,255,0.4)" }}
//               >
//                 <button
//                   className="p-2 bg-[#A67845] text-[white] w-[70%]"
//                   style={{ fontWeight: "bold" }}
//                 >
//                   Foto
//                 </button>
//               </div>
//               <img
//                 src="/user.jpeg"
//                 width="150"
//                 height="150"
//                 style={{ objectFit: "contain" }}
//               />
//             </div>
//           </div>

//           <div className="containerData flex flex-col items-center p-2">
//             <span
//               className="block text-center"
//               style={{ fontWeight: "bold", color: "#BB3D4B" }}
//             >
//               ¡Termina tu perfil!
//             </span>

//             <p className="text-center mt-2">
//               Por favor completa tus datos para empezar
//             </p>

//             <button
//               className="p-2 bg-[#A67845] text-[white] w-[150px]"
//               style={{ fontWeight: "bold" }}
//               onClick={() => onRouterLink("/mi-cuenta")}
//             >
//               Perfil
//             </button>
//           </div>
//         </div>

//         <div className="container-datos-personales mt-3">
//           <span className="text-[#BB3D4B] text-xl font-bold">
//             Datos Personales
//           </span>

//           <form className="mt-3 w-[45%]">
//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Nombre(s):
//               </label>
//               <input type="text" className="form-control" />
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Apellido(s):
//               </label>
//               <input type="text" className="form-control" />
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Email:
//               </label>
//               <input type="email" className="form-control" />
//             </div>
//           </form>
//         </div>

//         <div className="container-datos-envio" style={{ marginTop: "70px" }}>
//           <span className="text-[#BB3D4B] text-xl font-bold">
//             Datos de Envío
//           </span>

//           <form className=" w-[45%]">
//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Calle:
//               </label>
//               <input type="text" className="form-control" />
//             </div>

//             <div className="input-group my-3 flex justify-center flex-nowrap">
//               <div
//                 className="flex justify-center"
//                 style={{ alignItems: "flex-end" }}
//               >
//                 <label htmlFor="" className="text-[#808080] text-base mx-2">
//                   Número:
//                 </label>
//                 <input type="text" className="form-control" />
//               </div>
//               <div
//                 className="flex justify-center"
//                 style={{ alignItems: "flex-end" }}
//               >
//                 <label htmlFor="" className="text-[#808080] text-base mx-2">
//                   Interior:
//                 </label>
//                 <input type="text" className="form-control" />
//               </div>
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Código Postal
//               </label>

//               <input type="text" className="form-control" />
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Colonia
//               </label>

//               <input type="text" className="form-control" />
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Estado
//               </label>

//               <input type="text" className="form-control" />
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Ciudad
//               </label>

//               <input type="text" className="form-control" />
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Teléfono 1
//               </label>

//               <input type="text" className="form-control" />
//             </div>

//             <div
//               className="input-group my-3 flex justify-center items-end"
//               style={{ alignItems: "flex-end" }}
//             >
//               <label htmlFor="" className="text-[#808080] text-base mx-2">
//                 Teléfono 2
//               </label>

//               <input type="text" className="form-control" />
//             </div>

//             <button
//               className="w-[100%] p-2 bg-[#BB3D4B] text-white font-bold"
//               style={{ borderRadius: "10px" }}
//             >
//               Guardar
//             </button>
//           </form>
//         </div>
//         {/* <div className="containerCard w-[45%]">
//           <div className={`${styles.headerCard} border flex justify-center`}>
//             ¡Completa tu perfil!
//           </div>

//           <div className="bodyCard w-[100%] border flex flex-col items-center mt-2 p-2">
//             <div className={styles.containerImg}>
//               <div className={styles.opaco}>
//                 <button
//                   className={styles.btnChangeFoto}
//                   onClick={() => onRouterLink("/perfil")}
//                 >
//                   Cambiar foto
//                 </button>
//               </div>
//               <img
//                 src="/user.jpeg"
//                 className="w-[100%] h-[150px] object-contain"
//               />
//             </div>
//             <br />
//             <br />
//             <p className={styles.description}>Completa tu información</p>

//             <button className={styles.btnPerfil}>Mi perfil</button>
//           </div>
//         </div> */}
//       </div>
//     </section>
//   );
// };

// export default MiCuenta;
