# Frontend - Carrito de Compras

Frontend simple en HTML, CSS y JavaScript vanilla para consumir el backend Spring Boot del carrito.

## Endpoints usados

- `GET http://localhost:8080/carrito/getCarrito`
- `POST http://localhost:8080/carrito/agregarProducto`

## Cómo ejecutarlo

1. Levanta tu backend Spring Boot.
2. Abre `index.html` en el navegador.

Si tienes problemas de CORS, agrega configuración CORS en tu backend Spring Boot.

## Configurar URL del backend

En `app.js`, cambia esta línea si tu backend usa otro puerto:

```js
const API_BASE_URL = 'http://localhost:8080';
```

## JSON que envía el formulario

```json
{
  "nombre": "Laptop",
  "descripcion": "Laptop Lenovo",
  "precio": 4500.00,
  "stock": 10
}
```
