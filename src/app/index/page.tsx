"use client";
import "./index.css";
import { CreditCard, Phone, Shield, Truck } from "lucide-react";
import useIndex from "./useIndex";
import Carousel from "../components/carousel/Carousel";
import Card from "../components/card/Card";
import { useEffect } from "react";
import Skeleton from "../components/skeleton/Skeleton";
import PaginationComponent from "../components/pagination/PaginationComponent";

const Index = () => {
  const {
    getListProducts,
    dataProducts,
    loadingProducts,
    MARCAS,
    changePagination,
    currentPage,
    itemsPerPage,
    sectionRef,
  } = useIndex();

  useEffect(() => {
    getListProducts();
  }, []);

  return (
    <section>
      {/*Carrusel */}

      <div className="img">
        <img src="/pcgamer.jpg" alt="" />
      </div>

      <div className="tema">
        <span>Tenemos lo más destacado en Gaming!</span>
      </div>

      <div className="container-products-destacados">
        <Card />
      </div>
    </section>
  );
};

export default Index;

// <section>
//       <div>
//         <div className="banner-container">
//           <div className="banner-slide">{/* <Carousel /> */}</div>
//         </div>
//       </div>

//       <main className="main-content">
//         {/* Productos Destacados */}

//         {!loadingProducts ? (
//           <>
//             <br />
//             <Skeleton />
//             <br />
//           </>
//         ) : (
//           <section className="section" ref={sectionRef}>
//             <h2 className="section-title">Productos destacados</h2>
//             <div className="products-grid">
//               {dataProducts && dataProducts.length > 0
//                 ? dataProducts
//                     .slice(
//                       (currentPage - 1) * itemsPerPage,
//                       currentPage * itemsPerPage
//                     )
//                     .map((product: any) => {
//                       return <Card key={product.id} currentProduct={product} />;
//                     })
//                 : null}
//             </div>
//             <div className="w-full mt-2 flex justify-center">
//               <PaginationComponent
//                 count={Math.ceil(dataProducts.length / itemsPerPage)}
//                 page={currentPage}
//                 onChange={changePagination}
//               />
//             </div>
//           </section>
//         )}

//         {/* Servicios */}
//         <section className="services">
//           <h2 className="section-title">¿Por qué elegir PCInbox?</h2>
//           <div className="services-grid">
//             <div className="service-item">
//               <div className="service-icon">
//                 <Truck size={30} />
//               </div>
//               <h3 className="service-title">Envío gratis</h3>
//               <p className="service-description">
//                 Envío gratuito en pedidos superiores a $999. Recibe tus
//                 productos en 24-48 horas.
//               </p>
//             </div>

//             <div className="service-item">
//               <div className="service-icon">
//                 <Shield size={30} />
//               </div>
//               <h3 className="service-title">Garantía extendida</h3>
//               <p className="service-description">
//                 Todos nuestros productos incluyen garantía extendida y soporte
//                 técnico especializado.
//               </p>
//             </div>

//             <div className="service-item">
//               <div className="service-icon">
//                 <CreditCard size={30} />
//               </div>
//               <h3 className="service-title">Pagos seguros</h3>
//               <p className="service-description">
//                 Compra con total seguridad. Aceptamos todas las tarjetas y
//                 métodos de pago.
//               </p>
//             </div>

//             <div className="service-item">
//               <div className="service-icon">
//                 <Phone size={30} />
//               </div>
//               <h3 className="service-title">Soporte 24/7</h3>
//               <p className="service-description">
//                 Nuestro equipo de expertos está disponible las 24 horas para
//                 ayudarte.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Marcas Destacadas */}
//         <section className="section">
//           <h2 className="section-title">Marcas que confiamos</h2>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
//               gap: "20px",
//               padding: "30px 0",
//             }}
//           >
//             {MARCAS.map((marca) => (
//               <div
//                 key={marca.id}
//                 className="flex justify-center gap-2 items-center p-1"
//                 style={{
//                   background: "white",
//                   padding: "25px",
//                   borderRadius: "10px",
//                   textAlign: "center",
//                   border: "1px solid #e7e7e7",
//                   cursor: "pointer",
//                   transition: "all 0.3s",
//                   fontWeight: "bold",
//                   color: "#333",
//                 }}
//                 onMouseEnter={(e: any) => {
//                   e.target.style.transform = "translateY(-5px)";
//                   e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
//                   e.target.style.borderColor = "#f74928";
//                 }}
//                 onMouseLeave={(e: any) => {
//                   e.target.style.transform = "translateY(0)";
//                   e.target.style.boxShadow = "none";
//                   e.target.style.borderColor = "#e7e7e7";
//                 }}
//               >
//                 <img
//                   src={marca.img}
//                   width={50}
//                   height={50}
//                   className="object-contain"
//                 />
//                 {marca.name}
//               </div>
//             ))}
//           </div>
//         </section>

//         <div
//           style={{ height: "2px", width: "100%", border: "1px solid #ccc" }}
//         ></div>

//         <section className="section">
//           <h2 className="section-title">Lo mas vendido</h2>
//         </section>

//         <div
//           style={{ height: "2px", width: "100%", border: "1px solid #ccc" }}
//         ></div>

//         <section className="section">
//           <h2 className="section-title">Categorías destacadas</h2>
//         </section>

//         {/* Newsletter */}
//         <section
//           style={{
//             background: "linear-gradient(135deg, #f74928, #ff6b47)",
//             borderRadius: "15px",
//             padding: "50px 40px",
//             textAlign: "center",
//             color: "white",
//             margin: "40px 0",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "28px",
//               fontWeight: "bold",
//               marginBottom: "15px",
//             }}
//           >
//             ¡No te pierdas nuestras ofertas!
//           </h2>
//           <p
//             style={{
//               fontSize: "18px",
//               marginBottom: "30px",
//               opacity: "0.95",
//             }}
//           >
//             Suscríbete y recibe descuentos exclusivos, nuevos productos y
//             ofertas especiales
//           </p>

//           <div
//             style={{
//               display: "flex",
//               maxWidth: "500px",
//               margin: "0 auto",
//               gap: "15px",
//             }}
//           >
//             <input
//               type="email"
//               placeholder="Tu correo electrónico"
//               style={{
//                 flex: 1,
//                 padding: "15px 20px",
//                 border: "none",
//                 borderRadius: "25px",
//                 fontSize: "16px",
//                 outline: "none",
//                 background: "white",
//                 color: "black",
//               }}
//             />
//             <button
//               style={{
//                 background: "white",
//                 color: "#f74928",
//                 border: "none",
//                 padding: "15px 30px",
//                 borderRadius: "25px",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 transition: "transform 0.3s",
//               }}
//               //onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
//               //onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//             >
//               Suscribirse
//             </button>
//           </div>
//         </section>
//       </main>
//     </section>
