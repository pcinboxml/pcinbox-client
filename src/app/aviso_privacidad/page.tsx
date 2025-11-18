"use client";
import "./avisoprivacidad.css";

const AvisoPrivacidad = () => {
  const lastUpdated = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        marginTop: "-150px",
      }}
    >
      <div className="privacy-container">
        <header className="privacy-header">
          <h1>Aviso de Privacidad</h1>
          <p className="last-updated">Última actualización: {lastUpdated}</p>
        </header>

        <section className="privacy-section">
          <h2>Introducción</h2>
          <p>
            El presente Aviso de Privacidad establece las políticas y
            procedimientos aplicables al tratamiento de datos personales y
            constituye un elemento integral de los Términos y Condiciones que
            rigen el uso de este sitio web{" "}
            <a
              href="https://www.pcinbox.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="privacy-link"
            >
              www.pcinbox.com.mx
            </a>
            .
          </p>
          <p>
            Este Aviso de Privacidad contempla en todo momento los principios de
            licitud, consentimiento, información, calidad, finalidad, lealtad,
            proporcionalidad y responsabilidad en el tratamiento de los datos
            personales, conforme al Artículo 6° de la{" "}
            <strong>
              Ley Federal de Protección de Datos Personales en Posesión de los
              Particulares
            </strong>
            .
          </p>
        </section>

        <section className="privacy-section">
          <h2>Responsable del Tratamiento de Datos</h2>
          <p>
            De acuerdo con lo establecido en el presente Aviso y con fundamento
            en los artículos 15 y 16 de la Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares, se hace de su
            conocimiento que:
          </p>
          <p className="responsible">
            <strong>PCINBOX</strong>, con domicilio ubicado en: <br />
            Blvd. Juan Alonso de Torres Pte. 1917, Local 01, Unión Comunitaria
            de León, C.P. 37239, León de los Aldama, Guanajuato, México.
          </p>
          <p>
            Es el responsable del tratamiento, uso y protección de sus datos
            personales.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Información de Carácter Personal que PCINBOX Puede Recabar</h2>
          <p>
            PCINBOX podrá recopilar la siguiente información de carácter
            personal del titular:
          </p>
          <ul className="privacy-list">
            <li>
              <strong>Datos de identificación:</strong> Nombre, apellidos, fecha
              de nacimiento, RFC, CURP, número de cliente y credenciales de
              acceso a su cuenta.
            </li>
            <li>
              <strong>Datos de contacto:</strong> Domicilio, teléfono fijo y/o
              móvil, correo electrónico y cualquier otro medio de localización
              proporcionado.
            </li>
            <li>
              <strong>Datos de facturación y transacciones:</strong> Información
              fiscal, historial de compras, métodos y referencias de pago, así
              como comprobantes relacionados con operaciones comerciales.
            </li>
            <li>
              <strong>Datos de envío y entrega:</strong> Dirección de entrega,
              persona autorizada para recibir pedidos y registros asociados al
              proceso logístico.
            </li>
            <li>
              <strong>Datos de navegación y uso del sitio:</strong> Dirección
              IP, tipo de dispositivo, identificadores técnicos, cookies y
              preferencias de usuario dentro del sitio web.
            </li>
            <li>
              <strong>Datos de soporte y comunicación:</strong> Mensajes
              enviados mediante formularios, chats, correo electrónico u otros
              medios de contacto con PCINBOX.
            </li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Finalidades del Tratamiento de la Información Personal</h2>
          <p>
            PCINBOX llevará a cabo el tratamiento de la información personal del
            titular para las siguientes finalidades primarias, indispensables
            para la prestación de los servicios contratados y el cumplimiento de
            la relación jurídica establecida:
          </p>
          <ol className="privacy-list">
            <li>
              <strong>Gestionar operaciones de compraventa:</strong> Registrar,
              validar y procesar pedidos; efectuar cargos; emitir facturación y
              comprobantes fiscales; y administrar cualquier trámite inherente a
              las transacciones comerciales.
            </li>
            <li>
              <strong>Coordinar procesos de envío y entrega:</strong> Preparar,
              documentar, enviar y entregar los productos adquiridos, así como
              llevar a cabo el seguimiento logístico correspondiente.
            </li>
            <li>
              <strong>Proporcionar asistencia y soporte al titular:</strong>{" "}
              Atender solicitudes de información, aclaraciones, quejas,
              devoluciones, garantías, soporte técnico y cualquier gestión
              relacionada con el servicio contratado.
            </li>
            <li>
              <strong>Administrar cuentas y accesos de usuario:</strong> Crear,
              actualizar y mantener perfiles de usuario, gestionar credenciales
              de acceso y asegurar la correcta funcionalidad del portal.
            </li>
            <li>
              <strong>
                Garantizar la operación técnica y seguridad del sitio web:
              </strong>{" "}
              Monitorear el comportamiento del sitio, prevenir actividades no
              autorizadas, fortalecer mecanismos de seguridad informática y
              administrar herramientas de análisis y funcionamiento.
            </li>
            <li>
              <strong>Cumplir con obligaciones legales y regulatorias:</strong>{" "}
              Atender requerimientos de autoridades competentes, conservar
              información conforme a disposiciones aplicables y ejecutar actos
              necesarios para el cumplimiento de la normatividad vigente.
            </li>
          </ol>

          <p className="secondary-purposes">
            Asimismo, de manera adicional y sujeta al{" "}
            <strong>consentimiento expreso del titular</strong>, PCINBOX podrá
            llevar a cabo las siguientes finalidades secundarias:
          </p>
          <ul className="privacy-list">
            <li>
              <strong>
                Envío de comunicaciones comerciales y promocionales:
              </strong>{" "}
              Proporcionar información sobre productos, servicios, promociones,
              descuentos, campañas y novedades relacionadas con la actividad
              comercial de PCINBOX.
            </li>
            <li>
              <strong>Análisis estadísticos y de mejora continua:</strong>{" "}
              Evaluar hábitos de consumo, preferencias y comportamientos de
              navegación con el propósito de optimizar la calidad de los
              servicios y mejorar la experiencia del titular.
            </li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Transferencia de Datos Personales</h2>
          <p>
            PCINBOX podrá realizar transferencias de datos personales a terceros
            únicamente en los siguientes supuestos y conforme a lo previsto por
            la Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares:
          </p>
          <ol className="privacy-list">
            <li>
              <strong>Autoridades competentes:</strong> Cuando la transferencia
              sea necesaria para cumplir requerimientos, órdenes o mandatos
              emitidos por autoridad competente, o para el ejercicio de acciones
              legales que deriven del vínculo jurídico con el titular.
            </li>
            <li>
              <strong>Proveedores y prestadores de servicios:</strong> A
              terceros que actúen como aliados comerciales o proveedores de
              servicios para PCINBOX, exclusivamente con el propósito de llevar
              a cabo funciones necesarias para el cumplimiento de las
              finalidades primarias, tales como servicios logísticos,
              paquetería, facturación, procesamiento de pagos, verificación de
              identidad, almacenamiento o administración de información.
            </li>
            <li>
              <strong>Sociedades filiales o relacionadas:</strong> Únicamente
              cuando sea indispensable para la operatividad interna, la
              continuidad del servicio o la gestión administrativa o comercial
              de PCINBOX.
            </li>
          </ol>
          <p>
            En todos los casos, dichos terceros asumirán las mismas obligaciones
            de protección, confidencialidad y resguardo previstas en el presente
            Aviso de Privacidad. Cualquier transferencia distinta a las aquí
            señaladas requerirá del{" "}
            <strong>consentimiento expreso del titular</strong>.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Medidas de Seguridad</h2>
          <p>
            PCINBOX adopta y mantiene medidas de seguridad administrativas,
            técnicas y físicas necesarias para garantizar la integridad,
            confidencialidad y disponibilidad de los datos personales, con el
            fin de evitar su daño, pérdida, alteración, destrucción, uso
            indebido, acceso no autorizado o tratamiento indebido.
          </p>
          <p>Estas medidas incluyen, entre otras:</p>
          <ul className="privacy-list">
            <li>Control de accesos y autenticación.</li>
            <li>
              Sistemas de monitoreo y detección de actividades no autorizadas.
            </li>
            <li>Protocolos de cifrado y almacenamiento seguro.</li>
            <li>
              Restricción interna del acceso a la información únicamente al
              personal que requiera conocerla.
            </li>
            <li>
              Supervisión y evaluación periódica de los sistemas de seguridad.
            </li>
          </ul>
          <p className="disclaimer">
            No obstante lo anterior, PCINBOX no puede garantizar la
            invulnerabilidad absoluta de los sistemas informáticos, por lo que
            el titular reconoce y acepta las limitaciones inherentes a cualquier
            sistema tecnológico.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Derechos ARCO y Mecanismos para su Ejercicio</h2>
          <p>
            El titular tiene derecho a{" "}
            <strong>Acceder, Rectificar, Cancelar y Oponerse</strong> (ARCO) al
            tratamiento de sus datos personales, así como a revocar el
            consentimiento previamente otorgado.
          </p>
          <p>
            Para ejercer estos derechos, el titular podrá presentar una
            solicitud formal a través del siguiente medio:
          </p>
          <ul className="privacy-list">
            <li>
              <strong>Correo electrónico de contacto:</strong>{" "}
              <a href="mailto:contacto@pcinbox.com.mx" className="privacy-link">
                contacto@pcinbox.com.mx
              </a>
            </li>
            <li>
              <strong>Domicilio:</strong> Blvd. Juan Alonso de Torres Pte. 1917,
              Local 01, Unión Comunitaria de León, C.P. 37239, León de los
              Aldama, Guanajuato, México.
            </li>
          </ul>
          <p>La solicitud deberá incluir al menos:</p>
          <ul className="privacy-list">
            <li>Nombre completo del titular.</li>
            <li>
              Documentos que acrediten su identidad o representación legal.
            </li>
            <li>Descripción clara del derecho que desea ejercer.</li>
            <li>
              Cualquier información que facilite la localización de los datos
              personales.
            </li>
          </ul>
          <p>
            PCINBOX dará respuesta dentro del plazo legal establecido y conforme
            a los procedimientos previstos por la LFPDPPP.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Limitación del Uso y Divulgación de Datos Personales</h2>
          <p>
            Con el fin de garantizar la adecuada protección de los datos
            personales del titular, PCINBOX pone a su disposición mecanismos
            para limitar el uso y divulgación de dicha información.
          </p>
          <p>
            El titular podrá solicitar la limitación del uso de sus datos
            personales a través de los siguientes medios:
          </p>
          <ul className="privacy-list">
            <li>
              <strong>Correo electrónico autorizado:</strong>{" "}
              <a href="mailto:contacto@pcinbox.com.mx" className="privacy-link">
                contacto@pcinbox.com.mx
              </a>
            </li>
            <li>
              <strong>Escrito presentado en el domicilio oficial:</strong> Blvd.
              Juan Alonso de Torres Pte. 1917, Local 01, Unión Comunitaria de
              León, C.P. 37239, León de los Aldama, Guanajuato, México.
            </li>
          </ul>
          <p>
            Dichas solicitudes podrán referirse a la suspensión de envíos
            promocionales, restricción de comunicaciones comerciales o
            limitación en el procesamiento de los datos para finalidades no
            esenciales. PCINBOX atenderá dichas solicitudes en los plazos
            previstos por la legislación aplicable y adoptará las medidas
            necesarias para registrar su restricción.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Uso de Cookies, Web Beacons y Otras Tecnologías</h2>
          <p>
            PCINBOX emplea tecnologías de rastreo estándar en su sitio web,
            tales como cookies, web beacons, etiquetas de seguimiento e
            identificadores digitales, con el propósito de mejorar la
            experiencia del usuario y optimizar el funcionamiento del portal.
          </p>
          <p>Estas tecnologías permiten, entre otros aspectos:</p>
          <ul className="privacy-list">
            <li>Identificar el comportamiento del usuario en el sitio.</li>
            <li>Analizar preferencias de navegación y contenido consultado.</li>
            <li>Realizar mediciones de desempeño y funcionamiento.</li>
            <li>Facilitar el acceso a funciones personalizadas.</li>
            <li>Recordar sesiones y configuraciones del usuario.</li>
          </ul>
          <p>
            El titular puede deshabilitar total o parcialmente el uso de estas
            tecnologías mediante la configuración de su navegador. Sin embargo,
            dicha desactivación podría afectar el desempeño del sitio o la
            disponibilidad de ciertas funciones.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Modificaciones al Aviso de Privacidad</h2>
          <p>
            PCINBOX se reserva el derecho de modificar, actualizar o
            complementar en cualquier momento el contenido del presente Aviso de
            Privacidad, ya sea por:
          </p>
          <ul className="privacy-list">
            <li>Cambios legislativos o regulatorios.</li>
            <li>
              Ajustes internos en políticas o prácticas de tratamiento de datos.
            </li>
            <li>Requerimientos operativos, comerciales o tecnológicos.</li>
          </ul>
          <p>
            Cualquier modificación será publicada en el sitio web oficial de
            PCINBOX, y en su caso, notificada al titular mediante los medios de
            contacto proporcionados, cuando así lo exija la normatividad
            vigente.
          </p>
          <p className="disclaimer">
            El uso continuo del sitio web y servicios posteriores a la
            publicación de la actualización implica la aceptación plena y tácita
            de las modificaciones realizadas.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Consentimiento del Titular</h2>
          <p>
            Al proporcionar sus datos personales por cualquier medio (físico,
            digital o verbal), el titular reconoce haber leído y aceptado los
            términos del presente Aviso de Privacidad, otorgando su
            consentimiento para el tratamiento de la información conforme a las
            finalidades descritas.
          </p>
          <p>
            Cuando se trate de datos financieros, sensibles o transferencias no
            necesarias, PCINBOX recabará el consentimiento expreso del titular a
            través de los mecanismos correspondientes.
          </p>
        </section>

        <footer className="privacy-footer">
          <p>
            © {new Date().getFullYear()} PCINBOX. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AvisoPrivacidad;
