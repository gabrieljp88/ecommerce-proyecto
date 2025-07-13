// ==============================
// Variables y Selectores Globales
// ==============================

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('contenedor-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const totalCarrito = document.getElementById('total-carrito');
const buscador = document.getElementById('buscador');
const snackbar = document.getElementById('snackbar');

let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// ==============================
// Fetch de productos desde FakeStore API
// ==============================

fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(productos);
    actualizarCarrito();
  })
  .catch(error => console.error('Error al cargar productos:', error));

// ==============================
// Mostrar productos en la página
// ==============================

function mostrarProductos(lista) {
  if (!contenedorProductos) return;
  contenedorProductos.innerHTML = '';
  lista.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" />
      <h3>${producto.title}</h3>
      <p>$${producto.price}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

// ==============================
// Agregar productos al carrito
// ==============================

function agregarAlCarrito(id) {
  const producto = productos.find(prod => prod.id === id);
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  mostrarSnackbar('Producto agregado al carrito');
  guardarCarrito();
  actualizarCarrito();
}

// ==============================
// Guardar carrito en localStorage
// ==============================

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// ==============================
// Actualizar el carrito visualmente
// ==============================

function actualizarCarrito() {
  if (!contenedorCarrito) return;
  contenedorCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('carrito-item');
    div.innerHTML = `
      <p>${producto.title}</p>
      <p>Cantidad: 
        <button onclick="cambiarCantidad(${producto.id}, -1)">-</button> 
        ${producto.cantidad} 
        <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
      </p>
      <p>Subtotal: $${(producto.price * producto.cantidad).toFixed(2)}</p>
      <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
    `;
    contenedorCarrito.appendChild(div);
    total += producto.price * producto.cantidad;
  });

  totalCarrito && (totalCarrito.innerText = total.toFixed(2));
  contadorCarrito && (contadorCarrito.innerText = `(${carrito.length})`);
}

// ==============================
// Cambiar cantidad (sumar/restar)
// ==============================

function cambiarCantidad(id, delta) {
  const producto = carrito.find(prod => prod.id === id);
  if (!producto) return;
  producto.cantidad += delta;
  if (producto.cantidad <= 0) {
    carrito = carrito.filter(item => item.id !== id);
  }
  guardarCarrito();
  actualizarCarrito();
}

// ==============================
// Eliminar producto del carrito
// ==============================

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  actualizarCarrito();
}

// ==============================
// Vaciar carrito
// ==============================

const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
if (vaciarCarritoBtn) {
  vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    mostrarSnackbar('Carrito vaciado');
  });
}

// ==============================
// Filtro de productos desde buscador
// ==============================

if (buscador) {
  buscador.addEventListener('input', e => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productos.filter(prod =>
      prod.title.toLowerCase().includes(texto) ||
      prod.description.toLowerCase().includes(texto) ||
      prod.price.toString().includes(texto)
    );
    mostrarProductos(filtrados);
  });
}

// ==============================
// Snackbar para mensajes temporales
// ==============================

function mostrarSnackbar(mensaje) {
  if (!snackbar) return;
  snackbar.innerText = mensaje;
  snackbar.className = 'show';
  setTimeout(() => {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
}

// ==============================
// Carrusel automático de reseñas
// ==============================

let slideIndex = 0;
function mostrarReseñas() {
  const slides = document.getElementsByClassName("slide");
  Array.from(slides).forEach(slide => slide.classList.remove('active'));
  slideIndex = (slideIndex + 1) % slides.length;
  if (slides[slideIndex]) slides[slideIndex].classList.add('active');
  setTimeout(mostrarReseñas, 4000);
}

window.addEventListener("load", () => {
  mostrarReseñas();
});
