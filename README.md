# Soniq - Online Radio Station

Aplicación de radio online multigénero construida con **Clean Architecture** y Node.js.

## Características
- **Arquitectura Limpia**: Separación estricta entre Dominio, Infraestructura y Presentación.
- **Streaming Asíncrono**: Gestión de buffers y estados de red.
- **Interfaz Premium**: Diseño minimalista con Glassmorphism y animaciones fluidas.
- **Tres Géneros**: Rock, Electrónica y Blues con emisoras reales.

## Instalación y Uso
1. Instalar dependencias: \`npm install\`
2. Iniciar servidor: \`npm start\`
3. Abrir en el navegador: \`http://localhost:3000\`

## Estructura
- \`/src/core\`: Lógica de negocio (Entidad Player).
- \`/src/network\`: Capa de infraestructura para streaming.
- \`/src/ui\`: Interfaz de usuario (HTML/CSS/JS).
