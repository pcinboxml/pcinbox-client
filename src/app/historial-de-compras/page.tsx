"use client";

import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import style from "./historial-de-compras.module.css";

const HistoryShop = () => {
  return (
    <section
      style={{
        width: "80%",
        margin: "30px auto",
        display: "flex",
      }}
    >
      <div className="w-[280px] border ">
        <SidebarMiCuenta />
      </div>
      <div className="w-[80%] border p-3">
        <span
          className="text-[#bb3d4b]"
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "10px",
            marginTop: "10px",
            display: "block",
          }}
        >
          Historial de compras
        </span>

        <div className="w-full flex justify-center items-center gap-3 flex-wrap">
          <div className="flex gap-1 items-center">
            <label htmlFor="state" className="flex shrink-0 text-[#808080]">
              Estado del pedido:
            </label>
            <select
              className="form-select"
              id="state"
              defaultValue={"allState"}
            >
              <option value="allState">Todos los estados</option>
              <option value="entregado">Entregado</option>
              <option value="enviado">Enviado</option>
              <option value="procesando">Procesando</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="flex gap-1 items-center">
            <label htmlFor="periodo" className="flex shrink-0 text-[#808080]">
              Período:
            </label>
            <select
              className="form-select"
              id="periodo"
              defaultValue={"todoTiempo"}
            >
              <option value="todoTiempo">Todo el tiempo</option>
              <option value="1">Ultimos 30 días</option>
              <option value="2">Ultimos 3 meses</option>
              <option value="3">Ultimo año</option>
            </select>
          </div>

          <div className="flex gap-1 items-center">
            <label htmlFor="state" className="flex shrink-0 text-[#808080]">
              Buscar producto:
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>

        <div className="my-5 flex flex-col">
          <div className={style.orderCard} data-status="delivered">
            <div className={style.orderHeader}>
              <div className={style.orderInfo}>
                <div className={style.orderNumber}>Pedido #ML-2024-001234</div>
                <div className={style.orderDate}>
                  Realizado el 15 de septiembre, 2024
                </div>
              </div>
              <div
                className={`${style.status} ${style.statusDelivered} p-2 rounded`}
              >
                Entregado
              </div>
              <div className={style.orderTotal}>$1,299.00</div>
            </div>
            <div className={style.orderItems}>
              <div className={style.item}>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center"
                  alt="Audífonos Bluetooth"
                  className={style.itemImage}
                />
                <div className={style.itemDetails}>
                  <div className={style.itemName}>
                    Audífonos Bluetooth Sony WH-1000XM4
                  </div>
                  <div className={style.itemVariant}>
                    Color: Negro, Cancelación de ruido
                  </div>
                  <div className={style.itemMeta}>
                    <div className={style.itemQuantity}>Cantidad: 1</div>
                    <div className={style.itemPrice}>$1,299.00</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.orderActions}>
              <a href="#" className="btn btn-secondary">
                Ver detalles
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryShop;
