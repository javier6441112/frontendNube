const API_BASE_URL = 'http://localhost:8080';

const productoForm = document.querySelector('#productoForm');
const productosBody = document.querySelector('#productosBody');
const mensaje = document.querySelector('#mensaje');
const loading = document.querySelector('#loading');
const emptyState = document.querySelector('#emptyState');
const contador = document.querySelector('#contador');
const buscador = document.querySelector('#buscador');
const btnRecargar = document.querySelector('#btnRecargar');

let productos = [];

document.addEventListener('DOMContentLoaded', cargarProductos);
productoForm.addEventListener('submit', guardarProducto);
buscador.addEventListener('input', renderProductos);
btnRecargar.addEventListener('click', cargarProductos);

async function cargarProductos() {
  mostrarLoading(true);
  limpiarMensaje();

  try {
    const response = await fetch(`${API_BASE_URL}/carrito/getCarrito`);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    productos = await response.json();
    renderProductos();
  } catch (error) {
    productos = [];
    renderProductos();
    mostrarMensaje(
      'No se pudo cargar la lista de productos. Verifica que el backend esté corriendo en http://localhost:8080 y que CORS esté habilitado.',
      'error'
    );
    console.error(error);
  } finally {
    mostrarLoading(false);
  }
}

async function guardarProducto(event) {
  event.preventDefault();
  limpiarMensaje();

  const formData = new FormData(productoForm);

  const producto = {
    nombre: formData.get('nombre')?.trim(),
    descripcion: formData.get('descripcion')?.trim(),
    precio: Number(formData.get('precio')),
    stock: Number.parseInt(formData.get('stock'), 10)
  };

  if (!producto.nombre || Number.isNaN(producto.precio) || Number.isNaN(producto.stock)) {
    mostrarMensaje('Completa correctamente nombre, precio y stock.', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/carrito/agregarProducto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const productoGuardado = await response.json();
    productos.unshift(productoGuardado);

    productoForm.reset();
    renderProductos();
    mostrarMensaje('Producto guardado correctamente.', 'success');
  } catch (error) {
    mostrarMensaje(
      'No se pudo guardar el producto. Verifica que el backend esté activo y que CORS esté habilitado.',
      'error'
    );
    console.error(error);
  }
}

function renderProductos() {
  const filtro = buscador.value.trim().toLowerCase();

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre?.toLowerCase().includes(filtro)
  );

  productosBody.innerHTML = productosFiltrados
    .map((producto) => `
      <tr>
        <td>${producto.idProducto ?? ''}</td>
        <td>${escapeHtml(producto.nombre ?? '')}</td>
        <td>${escapeHtml(producto.descripcion ?? '')}</td>
        <td>Q ${formatearNumero(producto.precio)}</td>
        <td>${producto.stock ?? 0}</td>
      </tr>
    `)
    .join('');

  contador.textContent = `${productosFiltrados.length} producto(s) mostrado(s)`;
  emptyState.classList.toggle('hidden', productosFiltrados.length > 0);
}

function mostrarLoading(estado) {
  loading.classList.toggle('hidden', !estado);
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `message ${tipo}`;
}

function limpiarMensaje() {
  mensaje.textContent = '';
  mensaje.className = 'message';
}

function formatearNumero(valor) {
  const numero = Number(valor ?? 0);
  return numero.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
