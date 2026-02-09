# Feitiño - Tienda Online de Ropa

**Feitiño** es una tienda online de ropa con catálogo de productos, carrito de compras, login y registro de usuarios, búsqueda por texto y por voz, y sistema de cookies para la experiencia del usuario.

---

## Árbol de directorios y archivos

|   estructura.txt
|   index.html
|   politicas.html
|
+---assets
|   +---fonts
|   |   \---Unbounded
|   |
|   \---img
|
+---css
|       styles.css
|
\---js
        api-connection.js
        app.js

---

## Requisitos de inicio

- Abrir **index.html** en un navegador compatible (Chrome, Firefox, Edge).  
- Conectar con `api-connection.js` para cargar productos desde el JSON de catálogo.  
- El proyecto utiliza **JavaScript moderno (ES6+)**, por lo que se recomienda un navegador actualizado.

---

## Login y Registro de usuarios

Usuarios predefinidos en `app.js`:

```javascript
const usuarios = [
    { id: 1, email: "user1@gmail.com", password: "1234", nombre: "User1" },
    { id: 2, email: "user2@gmail.com", password: "1234", nombre: "User2" }
];
```
## Registro de usuarios: validación con expresiones regulares:

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // formato email
const passwordRegex = /^.{3,}$/;                // mínimo 3 caracteres

Sesión guardada en localStorage (usuarioActivo).

---
## Cookies y Web Storage
Se utiliza localStorage para:

  Guardar la sesión de usuario
  Guardar el carrito de compras
  Guardar aceptación del banner de cookies

**Banner de cookies:**
Aparece solo la primera vez que entra el usuario
Botón "Aceptar" guarda la decisión en localStorage (cookiesAceptadas)

---

## Licencias de multimedia y tipografías
**Imágenes**

Todas las imágenes son propiedad exclusiva de Feitiño (fotografías de productos, ilustraciones, banners, logo).

Protegidas bajo Copyright – Todos los derechos reservados.

Prohibido reproducir, distribuir o usar sin autorización expresa.

## Tipografías

Se utilizan fuentes públicas de Google Fonts:

Unbounded

Cascadia Code

Ambas licenciadas bajo SIL Open Font License (OFL), permitiendo uso comercial y no comercial, modificación y redistribución respetando la licencia.
