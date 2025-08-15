"use client";

import "./configUser.css";

const ConfigUser = () => {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Ajustes</h1>
        <p className="page-subtitle">
          Personaliza tu experiencia y configura tus preferencias
        </p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">👤</div>
            <h2 className="card-title">Cuenta</h2>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Nombre de usuario</div>
              <div className="setting-description">
                Cambia tu nombre de usuario
              </div>
            </div>
            <input
              type="text"
              className="input-control"
              //value="usuario123"
              placeholder="Nombre de usuario"
            />
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Email</div>
              <div className="setting-description">
                Actualiza tu dirección de email
              </div>
            </div>
            <input
              type="email"
              className="input-control"
              //value="usuario@email.com"
              placeholder="Email"
            />
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Contraseña</div>
              <div className="setting-description">
                Cambiar contraseña actual
              </div>
            </div>
            <button className="btn btn-secondary">Cambiar</button>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">🎨</div>
            <h2 className="card-title">Apariencia</h2>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Tema oscuro</div>
              <div className="setting-description">Cambiar a modo oscuro</div>
            </div>
            <div
              className="toggle-switch"
              //onclick="toggleSwitch(this)"
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Idioma</div>
              <div className="setting-description">
                Selecciona tu idioma preferido
              </div>
            </div>
            <select defaultValue="es" className="select-control">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Tamaño de fuente</div>
              <div className="setting-description">
                Ajustar tamaño del texto
              </div>
            </div>
            <select defaultValue="small" className="select-control">
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">🔔</div>
            <h2 className="card-title">Notificaciones</h2>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Notificaciones push</div>
              <div className="setting-description">
                Recibir notificaciones en tiempo real
              </div>
            </div>
            <div
              className="toggle-switch active"
              //onclick="toggleSwitch(this)"
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Notificaciones por email</div>
              <div className="setting-description">
                Recibir resúmenes por correo
              </div>
            </div>
            <div
              className="toggle-switch active"
              //onclick="toggleSwitch(this)"
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Sonido</div>
              <div className="setting-description">
                Reproducir sonido en notificaciones
              </div>
            </div>
            <div
              className="toggle-switch"
              //onclick="toggleSwitch(this)"
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">🔒</div>
            <h2 className="card-title">Privacidad y Seguridad</h2>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Perfil público</div>
              <div className="setting-description">
                Hacer visible tu perfil a otros usuarios
              </div>
            </div>
            <div
              className="toggle-switch"
              //onclick="toggleSwitch(this)"
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Autenticación de dos factores</div>
              <div className="setting-description">
                Agregar capa extra de seguridad
              </div>
            </div>
            <button className="btn btn-secondary">Configurar</button>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Descargar mis datos</div>
              <div className="setting-description">
                Obtener copia de tu información
              </div>
            </div>
            <button className="btn">Descargar</button>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">⚙️</div>
            <h2 className="card-title">Sistema</h2>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Actualizaciones automáticas</div>
              <div className="setting-description">
                Instalar actualizaciones automáticamente
              </div>
            </div>
            <div
              className="toggle-switch active"
              //onclick="toggleSwitch(this)"
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Datos de uso</div>
              <div className="setting-description">
                Compartir datos para mejorar el servicio
              </div>
            </div>
            <div
              className="toggle-switch"
              //onclick="toggleSwitch(this)"
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Restablecer configuración</div>
              <div className="setting-description">
                Volver a la configuración por defecto
              </div>
            </div>
            <button className="btn btn-danger">Restablecer</button>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">💬</div>
            <h2 className="card-title">Soporte</h2>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Centro de ayuda</div>
              <div className="setting-description">
                Encuentra respuestas a tus preguntas
              </div>
            </div>
            <button className="btn btn-secondary">Visitar</button>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Contactar soporte</div>
              <div className="setting-description">
                Obtén ayuda directa de nuestro equipo
              </div>
            </div>
            <button className="btn btn-secondary">Contactar</button>
          </div>
          <div className="setting-option">
            <div className="setting-info">
              <div className="setting-label">Reportar problema</div>
              <div className="setting-description">
                Informar sobre errores o bugs
              </div>
            </div>
            <button className="btn btn-secondary">Reportar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigUser;
