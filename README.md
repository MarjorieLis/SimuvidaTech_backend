# SimuVidaTech
*Una herramienta educativa para visualizar el impacto ambiental de los dispositivos electrónicos*

## Descripción del proyecto

SimuVidaTech es una aplicación web desarrollada como proyecto académico para las materias de **Ecología y Medio Ambiente Tecnológico** e **Interfaces y Multimedia** de la Universidad Internacional del Ecuador.

El sistema permite a los usuarios:
- Registrar sus dispositivos electrónicos (teléfonos y laptops)
- Visualizar el impacto ambiental a lo largo del ciclo de vida del dispositivo
- Tomar decisiones informadas en las etapas críticas de uso y fin de vida
- Recibir retroalimentación visual inmediata sobre el impacto de sus decisiones
- Descargar un informe con los resultados de su simulación

## Objetivos académicos

### Ecología y Medio Ambiente Tecnológico
- Visualizar el impacto ambiental de los dispositivos electrónicos en sus 5 etapas: extracción, fabricación, uso, transporte y fin de vida
- Promover la conciencia sobre la huella ecológica de la tecnología
- Fomentar decisiones sostenibles en el consumo y disposición de dispositivos

### Interfaces y Multimedia
- Aplicar principios de diseño minimalista: interfaces planas, colores contrastantes y tipografía legible
- Implementar visualizaciones de datos interactivas y significativas
- Crear una experiencia de usuario intuitiva que guíe al usuario a través del ciclo de vida del producto
- Demostrar cómo el diseño de interfaces puede influir en comportamientos sostenibles

## Tecnologías utilizadas

### Frontend
- **React.js**: Framework principal para componentes reutilizables y gestión de estado
- **Tailwind CSS**: Sistema de diseño para implementar principios de interfaz minimalista
- **Recharts**: Biblioteca para visualización de datos ambientales (CO₂, agua, residuos)
- **jsPDF + html2canvas**: Generación de informes multimedia descargables

### Backend
- **Node.js + Express**: Servidor API RESTful ligero y eficiente
- **MySQL**: Base de datos relacional para almacenamiento persistente
- **JWT (JSON Web Tokens)**: Autenticación segura sin estado

### Herramientas de desarrollo
- **VS Code**: Editor principal con extensiones para React y Tailwind
- **Git + GitHub**: Control de versiones y gestión del código fuente
- **MySQL Workbench**: Diseño y gestión de la base de datos

## Principios de diseño aplicados

### Minimalismo funcional
- **Interfaces planas**: Sin sombras ni texturas innecesarias
- **Colores contrastantes**: Verde esmeralda (#047857) sobre fondo oscuro para accesibilidad
- **Tipografía legible**: Jerarquía clara y tamaños apropiados para diferentes niveles de información
- **Microinteracciones**: Feedback visual inmediato en botones y selecciones

### Visualización de datos
- **Gráficos de barras**: Comparación clara entre categorías de impacto
- **Indicadores progresivos**: Barras de puntuación ecológica que muestran el progreso
- **Iconografía semántica**: Emojis y símbolos que refuerzan el significado de cada etapa

### Experiencia de usuario
- **Flujo guiado**: El usuario avanza secuencialmente por las 5 etapas del ciclo de vida
- **Retroalimentación inmediata**: El impacto ambiental se actualiza en tiempo real según las decisiones
- **Acciones claras**: Botones con verbos de acción y direccionalidad (→ Siguiente)

## Repositorios del proyecto

El código fuente del proyecto está dividido en dos repositorios:

- **Frontend (React + Tailwind CSS)**  
  [https://github.com/MarjorieLis/SimuvidaTech_fronted.git](https://github.com/MarjorieLis/SimuvidaTech_fronted.git)

- **Backend (Node.js + Express + MySQL)**  
  [https://github.com/MarjorieLis/SimuvidaTech_backend.git](https://github.com/MarjorieLis/SimuvidaTech_backend.git)

## Cómo ejecutar el proyecto

### Requisitos previos
- Node.js v18+
- MySQL 8.0+
- Git

### Instalación paso a paso

#### 1. Clonar los repositorios
```bash
git clone https://github.com/MarjorieLis/SimuvidaTech_fronted.git
git clone https://github.com/MarjorieLis/SimuvidaTech_backend.git
```
#### 2. Configurar la base de datos
-- Crear base de datos
CREATE DATABASE simuvidatech;

#### 3. Configurar variables de entorno
- Crear archivo .env en la carpeta SimuvidaTech_backend/:
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=simuvidatech
JWT_SECRET=tu_secreto_jwt
PORT=5000

#### 4. Instalar dependencias y ejecutar
- Backend:
cd SimuvidaTech_backend
npm install
npm start

- Frontend:
cd SimuvidaTech_fronted
npm install
npm run dev

#### 5. Acceder a la aplicación
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Flujo de la aplicación
1. Inicio público: Explorar teléfonos o laptops sin registro
2. Autenticación: Registro/Login para funcionalidades completas
3. Registro de dispositivo: Formulario con datos técnicos
4. Simulación del ciclo de vida:
- Etapas informativas: Extracción, Fabricación, Transporte
- Etapas interactivas: Uso (duración), Fin de vida (disposición)
5. Resultados: Impacto ambiental visualizado + recomendaciones personalizadas
6. Exportación: Descarga de informe PDF con todos los datos
7. Gestión: Lista de dispositivos propios con opción de eliminación

### Enfoque pedagógico
La aplicación demuestra cómo la tecnología puede ser una herramienta educativa para:

- Hacer visible lo invisible (impacto ambiental oculto)
- Convertir datos abstractos en visualizaciones comprensibles
- Empoderar a los usuarios con información para tomar decisiones informadas
- Mostrar la relación directa entre comportamientos individuales y consecuencias ambientales

### Autores
- Marjorie Lisseth Jiménez Jiménez, Madeleine Yanhely Jiménez Gaona, Cristina Lisbeth Orellana Esparza
- Estudiantes de la Universidad Internacional del Ecuador
- Materias: Ecología y Medio Ambiente Tecnológico | Interfaces y Multimedia