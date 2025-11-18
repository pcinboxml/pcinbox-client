"use client";
import "./terminoscondiciones.css";

const TerminosCondiciones = () => {
  const currentDate = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        marginTop: "-150px",
      }}
    >
      <div className="terms-container">
        <header className="terms-header">
          <h1>Términos y Condiciones</h1>
          <p className="last-updated">Última actualización: {currentDate}</p>
        </header>

        <section className="terms-section">
          <h2>Precios e Información del Producto</h2>
          <p>
            Los precios exhibidos en esta plataforma se encuentran expresados en
            moneda nacional e incluyen el Impuesto al Valor Agregado (I.V.A.).
            Las imágenes, descripciones, características técnicas,
            especificaciones y precios de los productos tienen un carácter
            meramente ilustrativo y pueden ser modificados, actualizados o
            sustituidos en cualquier momento sin previo aviso. PCINBOX no
            garantiza que la información publicada coincida de manera absoluta
            con el producto físicamente entregado, sin perjuicio de que este
            cumpla con la funcionalidad, categoría y calidad ofrecidas.
          </p>
          <p>
            Todos los productos disponibles se encuentran sujetos a inventario,
            disponibilidad del proveedor y condiciones de existencias al momento
            de la compra. El stock publicado en el sitio web puede variar debido
            a actualizaciones operativas o logísticas, sin que ello genere
            responsabilidad alguna para PCINBOX.
          </p>
        </section>

        <section className="terms-section">
          <h2>Métodos de Compra</h2>
          <p>
            Las compras podrán formalizarse exclusivamente a través de los
            siguientes medios autorizados:
          </p>
          <ol className="terms-list">
            <li>
              <strong>Venta presencial:</strong> Acudiendo a cualquiera de las
              sucursales oficiales o puntos de atención autorizados por PCINBOX:
              <br />
              <em>
                Blvd. Juan Alonso de Torres Pte. 1917, Local 01, Unión
                Comunitaria de León, C.P. 37239, León de los Aldama, Guanajuato,
                México
              </em>
            </li>
            <li>
              <strong>Venta en línea:</strong> Mediante la generación de un
              pedido a través del sitio web oficial de PCINBOX:{" "}
              <a
                href="https://www.pcinbox.com.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="terms-link"
              >
                www.pcinbox.com.mx
              </a>
            </li>
            <li>
              <strong>Venta por cotización:</strong> A través de una propuesta
              formal solicitada y enviada vía correo electrónico por nuestro
              equipo comercial.
            </li>
          </ol>
          <p>
            PCINBOX se reserva el derecho de aceptar, validar o rechazar
            cualquier pedido que no cumpla con los requisitos operativos,
            administrativos o comerciales establecidos.
          </p>
        </section>

        <section className="terms-section">
          <h2>Reservas de Derecho de Rechazo</h2>
          <p>PCINBOX podrá rechazar un pedido en los siguientes casos:</p>
          <ul className="terms-list">
            <li>
              El usuario incumpla, contravenga o no acepte los presentes
              Términos y Condiciones.
            </li>
            <li>
              El usuario no cubra el monto total y exacto correspondiente a la
              operación realizada.
            </li>
            <li>
              Por error técnico, operativo o involuntario del sistema, el precio
              o costo total sea calculado incorrectamente y el usuario se niegue
              a cubrir la diferencia.
            </li>
            <li>
              El pago sea identificado como fraudulento, sospechoso o sujeto a
              contracargo por la institución financiera.
            </li>
            <li>
              El producto adquirido se encuentre agotado en inventario y no sea
              posible su reposición en un plazo razonable.
            </li>
            <li>
              Se publiquen precios, promociones o descuentos no autorizados que
              causen perjuicio comercial a PCINBOX.
            </li>
            <li>
              El usuario incurra en actitudes ofensivas, agresiones verbales o
              físicas hacia el personal de PCINBOX, en cualquier canal de
              atención.
            </li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>Opciones de Pago</h2>
          <h3>Transferencia Electrónica</h3>
          <p>
            <strong>Beneficiario:</strong> Lizbeth Ordaz Camacho
            <br />
            <strong>Número de Cuenta BBVA:</strong> 0477163533
            <br />
            <strong>CLABE Interbancaria:</strong> 012225004771635337
          </p>

          <h3>Tarjeta de Débito o Crédito</h3>
          <p>
            Los pagos se realizan mediante la pasarela segura{" "}
            <strong>Openpay</strong>. Aceptamos:
          </p>
          <div className="payment-logos">
            <span className="payment-icon">Visa</span>
            <span className="payment-icon">Mastercard</span>
            <span className="payment-icon">American Express</span>
          </div>

          <h3>Pago en Efectivo</h3>
          <p>
            Mediante una referencia de pago, puedes liquidar en cualquier tienda
            afiliada: Wal-Mart, Bodega Aurrera, Súper Farmacias Guadalajara,
            Farmacia del Ahorro, entre otras.
          </p>

          <h3>Link de Pago</h3>
          <p>
            Para clientes que deseen formalizar su compra a través de una
            cotización formal, asistidos vía electrónica (medio de venta
            autorizado en el apartado 3).
          </p>

          {/* <p className="disclaimer">
            Para la gestión y procesamiento de los pagos, PCINBOX utiliza los
            servicios de <strong>Openpay</strong>, una plataforma certificada
            con estándares de seguridad bancaria. Al realizar una compra,
            aceptas que la operación será procesada por Openpay, bajo sus{" "}
            <a
              href="https://www.openpay.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="terms-link"
            >
              Términos y Condiciones y Política de Privacidad
            </a>
            .{" "}
            <strong>
              PCINBOX no almacena, registra ni tiene acceso a datos financieros
              del usuario
            </strong>{" "}
            (números de tarjeta, códigos de seguridad, etc.). Toda la
            // información sensible es gestionada exclusivamente por Openpay.
          </p> */}
        </section>

        <footer className="terms-footer">
          <p>
            © {new Date().getFullYear()} PCINBOX. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};
export default TerminosCondiciones;
