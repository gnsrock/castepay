# 💎 CastePay | Inteligencia Financiera Personal

![CastePay Logo](public/logo.png)

**CastePay** es una plataforma profesional de gestión financiera diseñada para ofrecer control absoluto, privacidad y una experiencia de usuario de nivel premium. Desarrollada con un enfoque en la agilidad y la seguridad de datos.

## 🎯 Propósito
La aplicación permite a los usuarios centralizar su economía personal, gestionando de forma inteligente sus ingresos, gastos, deudas y cobros pendientes, todo bajo una interfaz moderna con estética de vanguardia.

---

## 🚀 Características Principales

### 📊 Dashboard Inteligente
* **Análisis en Tiempo Real:** Visualización instantánea de balance neto, ingresos brutos y gastos operativos.
* **Gráficos Dinámicos:** Seguimiento visual de gastos por categorías mediante interfaces reactivas.
* **Proyecciones:** Visualización de flujos de caja próximos (cobros y pagos pendientes).

### 📅 Agenda Financiera (Control de Flujo)
* **Gestión de Deudas:** Seguimiento riguroso de facturas por pagar con alertas visuales de vencimiento.
* **Control de Cobros:** Registro y recordatorio de ingresos pendientes de percibir.
* **Acciones Rápidas:** Marcado instantáneo de transacciones pagadas/cobradas para mantener el flujo actualizado.

### 🔐 Seguridad y Privacidad
* **Autenticación Dual:** Acceso rápido vía Modo Invitado o registro permanente mediante Email/Password.
* **Protección a nivel de Fila (RLS):** Integración profunda con Supabase para garantizar que cada usuario solo acceda a su propia información de forma encriptada.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** React.js con arquitectura de componentes reutilizables.
*   **Estilos:** Tailwind CSS con diseño de "Glassmorphism" y modo oscuro nativo.
*   **Backend & DB:** Supabase (PostgreSQL) para persistencia de datos en tiempo real.
*   **Iconografía:** Lucide React para interfaces limpias y minimalistas.
*   **Animaciones:** Framer Motion / TailWind Animate para transiciones fluidas.

---

## 🔧 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/castepay.git
    cd castepay
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz con tus credenciales de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
    ```

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

---

## 👤 Autor
**Gabriel Castellaro**
*Desarrollado como parte de un sistema de gestión financiera personal de alto rendimiento.*

---

> "El control de tus finanzas es el primer paso hacia tu libertad." — **CastePay**
