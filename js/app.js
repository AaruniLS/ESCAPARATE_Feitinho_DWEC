import * as api from "./api-connection.js";

const mainDiv = document.getElementById('mainDiv');


/*------------HOME-----------*/
function renderHome(){
    mainDiv.innerHTML = `
        
        <div style="height: 300px;" class="p-4 d-flex justify-content-center align-items-center">
            <img src="assets/img/logo_home.svg" alt="feitiño" height="70%">
        </div>

        <div id="homeCarousel" class="carousel slide" data-bs-ride="carousel">

            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img class="d-block w-100" src="assets/img/carousel_01.jpg" alt="Diapo 1">
                </div>
                <div class="carousel-item">
                    <img class="d-block w-100" src="assets/img/carousel_02.jpg" alt="Diapo 2">
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>

                <button class="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
        </div>
    `;
}



/*------------USER-----------*/
//-----USUARIOS STORAGE
const usuarios = [
    {
        id: 1,
        email: "user1@gmail.com",
        password: "1234",
        nombre: "User1"
    },
    {
        id: 2,
        email: "user2@gmail.com",
        password: "1234",
        nombre: "User2"
    }
];
  

//-----LOG OUT
function logout() {
  localStorage.removeItem('usuarioActivo');
  localStorage.removeItem('carrito');
  alert('Sesión cerrada. ¡Hasta pronto!')
  cambiarEstadoSesion();
}

//-----CAMBIAR ESTADO DE SESIÓN
function cambiarEstadoSesion(){
    let usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    let icon = document.getElementById('userIcon');

    if (usuario) {
        //Si esta iniciada, cambiar al icon de logout
        icon.innerHTML = `
            <h4><i class="bi bi-box-arrow-right" id="btnLogOut"></i></h4>
        `;
    } else {
        //Si NO está iniciada, cambiar al icono normal de user
        icon.innerHTML = `
            <h4><i class="bi bi-person"></i></h4>
        `;
    }
}




/*------------TIENDA-----------*/
function renderTienda(){
    mainDiv.innerHTML = '';
    mainDiv.innerHTML = `
                <div id="tiendaDiv">
                    <h1 class="text-ft ps-5">tienda</h1>

                    <div id="tiendaFiltros" class="text-ft px-5">

                        <div id="searchBar" style="width: 40%" class="mx-auto">
                            <form id="formBusqueda" class="d-flex">
                                <input type="search" id="inputBusqueda" class="form-control border-ft me-2" placeholder="¿qué buscas?">
                                <button type="submit" id="btnBuscar" class="btn btn-ft me-2">
                                    <i class="bi bi-search"></i>
                                </button>
                                <button type="button" id="btnVoz" class="btn btn-ft">
                                    <i class="bi bi-mic-fill"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    <nav id="navTienda" class="nav nav-pills d-flex flex-row justify-content-center my-3">
                        <a class="nav-link" data-categoria="all">TODO</a>
                        <a class="nav-link" data-categoria="camisetas">camisetas</a>
                        <a class="nav-link" data-categoria="sudaderas">sudaderas</a>
                        <a class="nav-link" data-categoria="camisas">camisas</a>
                        <a class="nav-link" data-categoria="gorros">gorros</a>
                    </nav>

                    <div id="tiendaBanner" class="marquee bg-ft text-white p-1">
                        <p class="text-loop pt-3">
                            20% DE DESCUENTO EN TU TERCERA COMPRA CON EL CÓDIGO ENEROMOLON26 * ¡OJO! 
                        </p>
                        <p class="text-loop">
                            20% DE DESCUENTO EN TU TERCERA COMPRA CON EL CÓDIGO ENEROMOLON26 * ¡OJO!    
                        </p>
                    </div>

                    <div id="productGrid" class="bg-white row p-5">
                    </div>

                </div>
    `;
    cartasProductos();

    //BÚSQUEDA POR TEXTO
    document.getElementById('formBusqueda').addEventListener('submit', e => {
        e.preventDefault();
        const query = inputBusqueda.value.toLowerCase();
        filtrarProductos(query);
    });

    //BÚSQUEDA POR VOZ
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES';
    recognition.continuous = false;

    document.getElementById('btnVoz').addEventListener('click', () => {
        recognition.start();
    });
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        document.getElementById('inputBusqueda').value = transcript;
        filtrarProductos(transcript);
    };

    //FILTROS DE CATEGORÍA
    document.querySelectorAll('#navTienda .nav-link').forEach(link => {
        link.addEventListener('click', async () => {
            const categoria = link.dataset.categoria;
            const catalogo = await api.cargarJSON();

            if(categoria === 'all'){
                renderCartas(catalogo);
            } else {
                renderCartas(catalogo.filter(p => p.categoria === categoria));
            }
        });
    });
}

//FILTRAR PRODUCTOS
async function filtrarProductos(query){
    const catalogo = await api.cargarJSON();
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    const filtrados = catalogo.filter(p => 
        p.nombre.toLowerCase().includes(query) || 
        p.categoria.toLowerCase().includes(query)
    );

    //Si no se encuentran productos:
    if(filtrados.length === 0){
        grid.innerHTML = `<p class="text-ft text-center"><i>No se encontraron productos :(</i></p>`;
        return;
    } else{
        renderCartas(filtrados);
    }
}


//CARGAR CARTAS DEL JSON
async function cartasProductos(){
    const catalogo = await api.cargarJSON();
    renderCartas(catalogo);
}


//CARTAS DE PRODUCTOS
function renderCartas(productos){
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if(productos.length === 0){
        grid.innerHTML = `<p class="text-ft">No se encontraron productos</p>`;
        return;
    }

    productos.forEach((producto) => {
        grid.innerHTML += `
            <div class="col-12 col-md-4 mb-4 d-flex justify-content-center">

                <div class="card border-ft h-100 carta-producto" style="width: 18rem; cursor: pointer;" data-id="${producto.id}">

                    <div class="card-top position-relative overflow-hidden">
                        <img alt="producto" src="assets/img/${producto.imagen[0]}" class="imgCarta">
                        <div class="talla-div align-self-end pb-3">
                            ${producto.talla.map(t => `<button class="btn-talla btn">${t}</button>`).join('')}
                        </div>
                    </div>

                    <div class="card-body d-flex flex-row justify-content-between align-items-center text-ft bordert-ft">
                        <p class="card-title text-lowercase" style="font-size: 0.6em">${producto.nombre}</p>
                        <h5 class="ms-3">${producto.precio}€</h5>
                    </div>
                </div>
            </div>
        `;
    });
}


//DETALLE PRODUCTO
async function renderDetalle(id){
    mainDiv.innerHTML = '';
    mainDiv.innerHTML = '<p>Cargando producto...</p>';

    try{
        const catalogo = await api.cargarJSON();
        const producto = catalogo.find(p => p.id === id);
        if(!producto) throw new Error("Producto no encontrado");

        //BTN talla
        const tallasBtn = producto.talla.map(t => `
            <button type="button" class="btn-talla-det btn btn-ft m-1" data-talla="${t}">${t}</button>
        `).join('');

        mainDiv.innerHTML =`
            <div class="container">
                <button id="volverTienda" class="btn-ft">🡨 Volver</button>
                
                <div class="d-flex flex-row m-5">
                    <img src="assets/img/${producto.imagen[0]}" alt="${producto.nombre}" class="img-det border-ft me-5">

                    <div class="d-flex flex-column pl-5 justify-content-end">
                        <h1 class="text-ft">${producto.nombre}</h1>
                        <p class="text-ft">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>

                        <div id="tallasDetalle">
                            ${tallasBtn}
                        </div>

                        <div class="d-flex flex-column align-items-start">
                            <p class="precio text-ft">${producto.precio}€</p>
                            <button id="btnAddCarr" class="btn-ft" dataset-id="${producto.id}">+ Añadir al carrito</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;

        //BTN volver
        document.getElementById('volverTienda').addEventListener('click', renderTienda);

        //SELECCIÓN DE TALLA
        let tallaSeleccionada = null;
        let botonesTalla = Array.from(document.getElementsByClassName('btn-talla-det'));
        botonesTalla.forEach(btn => {
            btn.addEventListener('click', () => {
                tallaSeleccionada = btn.dataset.talla;
                botonesTalla.forEach(b => b.classList.remove('tallaActive'));
                btn.classList.add('tallaActive');
            });
        });

        //ADD AL CARRITO
        document.getElementById('btnAddCarr').addEventListener('click', () => {
            if(!tallaSeleccionada){
                alert("Selecciona una talla antes de añadir al carrito");
                return;
            }
            añadirAlCarrito({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen[0],
                cantidad: 1,
                talla: tallaSeleccionada
            });
        });


    } catch(e){
        mainDiv.innerHTML = `<p>Error al cargar este producto... :(</p>`;
        console.error(e);
    }
    
}

//AÑADIR AL CARRITO
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//si no existe el carrito, se crea un array vacio

function añadirAlCarrito(producto){
    const index = carrito.findIndex(p =>
        p.id === producto.id && p.talla === producto.talla
    );

    if(index !== -1){
        carrito[index].cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${producto.nombre} (${producto.talla}) añadido al carrito`);
}


//CARRITO OFFCANVAS
function renderOffcanvasCarrito(){
    const productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const offcanvasDiv = document.getElementById('offcanvasRight');
    offcanvasDiv.innerHTML = `
        <div class="offcanvas-header">
            <h5 class="text-ft">CARRITO</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div class="offcanvas-body">            
        </div>
    `;
    
    const offcanvasBody = document.getElementById('offcanvas-body');
    //si el carrito está vacio...
    if(productosCarrito.length === 0){
        offcanvasBody.innerHTML = `<p>Tu carrito está vacío.</p>`;
        return;
    }
    let html = '';
    productosCarrito.forEach(p => {
        html += `
            <div class="row mb-3 border-bottom pb-2">
                <div class="col-4">
                    <img src="assets/img/${p.imagen[0]}" class="img-fluid">
                </div>
                <div class="col-8">
                    <h5>${p.nombre}</h5>
                    <p>${p.precio} € x ${p.cantidad}</p>
                    <p>Talla: ${p.talla}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-primary" onclick="modificarCantidad(${p.id}, '${p.talla}', 1)">+</button>
                        <button class="btn btn-sm btn-danger" onclick="modificarCantidad(${p.id}, '${p.talla}', -1)">-</button>
                        <button class="btn btn-sm btn-secondary" onclick="eliminarProducto(${p.id}, '${p.talla}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    });
    offcanvasBody.innerHTML = html;
}
    function offcanvasCarrito(){
        const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasRight'));
        offcanvas.show();
    }


function renderCheckout(){

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    mainDiv.innerHTML = '';

    if(carrito.length === 0){
        mainDiv.innerHTML = `
        <div class="d-flex align-items-center justify-content-center" style="height: 400px">
            <p class="text-ft text-center">Tu carrito está vacío...</p>
        </div>
        `;
        return;
    }

    let html = `
        <div class="m-5">
        <h1 class="mb-4 text-ft">Checkout</h1>
        <div class="checkout-container">
    `;
    let total = 0;

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        html += `
            <div class="row mb-3 border-bottom pb-2 align-items-center text-ft">
                <div class="col-2">
                    <img src="assets/img/${p.imagen}" class="img-fluid">
                </div>
                <div class="col-4">
                    <h5>${p.nombre}</h5>
                    <p>Talla: ${p.talla}</p>
                </div>
                <div class="col-2">
                    <p>${p.precio} €</p>
                </div>
                <div class="col-2">
                    <p>${p.cantidad}</p>
                </div>
                <div class="col-2">
                    <p>${subtotal} €</p>
                </div>
            </div>
        `;
    });

    html += `
        <div class="row mt-4">
            <div class="col text-end">
                <h4 class="text-ft">Total: ${total} €</h4>
                <button class="btn btn-ft mt-2" id="finalizarCompra">Finalizar Compra</button>
            </div>
        </div>
    </div>
    </div>
    `;

    mainDiv.innerHTML = html;

    //BTN finalizar compra
    document.getElementById('finalizarCompra').addEventListener('click', () => {
        alert(`Gracias por tu compra. Total: ${total} €`);
        localStorage.removeItem('carrito'); // vaciar carrito en el local
        renderCheckout(); // refrescar la page
    });
    
}



/*------------CONTACTO-----------*/
function renderContacto(){
    mainDiv.innerHTML = '';
    mainDiv.innerHTML = `
        <div id="contactArriba" class="row">

                    <div id="contactoIzq" class="text-ft d-flex flex-column col-6 p-5">
                        <h1>CONTACTO</h1>
                        <p>Ven a vernos a nuestro estudio en</p>
                        <div class="d-flex align-items-center">
                            <i class="bi bi-geo-alt fs-1"></i>
                            <p class="fs-4 fw-normal">Rua do Doutor Cadaval Nº43, <br>36202 Vigo - Pontevedra ESPAÑA</p>
                        </div>
                        <p>O mándanos contáctanos por aquí:</p>
                        <div>
                            <div class="d-flex flex-row align-items-center">
                                <i class="bi bi-whatsapp fs-3"></i>
                                <p class="fs-4 fw-normal">+34 123 456 789</p>
                            </div>
                            <div class="d-flex flex-row align-items-center">
                                <i class="bi bi-envelope fs-3"></i>
                                <p class="fs-4 fw-normal">feitinho@info.es</p>
                            </div>
                        </div>
                    </div>

                    <div id="mapa" class="bg-ft d-flex col-6">
                        <p>mapa</p>
                        
                        <script>
                            function initMap(){                       
                                //42.23588587434815, -8.722996520560677
                                const estudio = { lat: 42.23588587434815, lng: -8.722996520560677 };

                                //Mapa:
                                const map = new google.maps.Map(document.getElementById("mapa"), {center: estudio, zoom: 15,} );

                                //Etiquita de ubicación:
                                const marker = new google.maps.Marker( {position: estudio, map: map, title: "Estudio Feitiño",} );
                            }
                            
                        </script>
                        
                        <!--Func callback que llama a initMap() !!-->
                        <script async defer src="https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE&callback=initMap"></script>

                    </div>
                </div>
    `;
}
/*
<div id="contactAbajo" class="bg-ft">
    <div class="text-white text-center">
        <p>Si te agobian las llamadas telefónicas,</p>
        <h1>¡escríbenos!</h1>
    </div>
    <form action="" class="d-flex flex-column">
        ASUNTO:<input type="text" name="asunto" id="">
        <textarea name="mensaje">Cuéntanos...</textarea>
        <button></button>
    </form>
</div>
*/



//------------EVENT LISTENERS-------------
document.addEventListener('click', (e) =>{

        //BTN Home
        if (e.target.closest('.link-home')){
            e.preventDefault();
            renderHome();
        }
        
        //BTN Contacto
        if (e.target.closest('.link-contacto')){
            e.preventDefault();
            renderContacto();
        }

        //BTN Productos Tienda
        if (e.target.closest('.link-tienda')){
            e.preventDefault();
            renderTienda();
        }
        //Detalle producto
        const carta = e.target.closest('.carta-producto');
        if(carta){
            renderDetalle(Number(carta.dataset.id));
        }
        
        //BTN añadir al carrito
        if (e.target.closest('.btnAddCarr')){
            e.preventDefault();
            añadirAlCarrito(e.target.closest('.btnAddCarr'));
        }

        //BTN Abrir carrito
        if (e.target.closest('.link-carr')){
            e.preventDefault();
            renderCheckout()
            //offcanvasCarrito();
        }

        //BTN Log OUT
        if(e.target.closest('#btnLogOut')){
            logout();
        }
        
});

//PROCESAR FORMULARIO MODAL LOGIN
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    //EXPRESIONES REGULARES y VALIDAR
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{3,}$/;
    if (!emailRegex.test(email)) {
        loginError.textContent = 'El email no es válido...';
        loginError.classList.remove('d-none');
        return;
    }
    if (!passwordRegex.test(password)) {
        loginError.textContent = 'La contraseña debe tener al menos 3 caracteres';
        loginError.classList.remove('d-none');
        return;
    }

    //BUSCAR USER
    let usuario = usuarios.find(user => user.email === email && user.password === password);

    //Mostrar error si no se encuentra el usuario
    if(!usuario){
        loginError.textContent = 'Email o contraseña incorrectos';
        loginError.classList.remove('d-none');
    } else{
        loginError.classList.add('d-none');
        alert("¡Bienvenide!");
        //Guardar la sesión
        localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
        cambiarEstadoSesion();
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
    }

});


//------------CARGAR HOME AL INICIAR-------------
document.addEventListener('DOMContentLoaded', () => {
    renderHome();
    cambiarEstadoSesion();

    //COOKIES
    const cookieBanner = document.getElementById('cookieBanner');
    const cookiesAceptadas = localStorage.getItem('cookiesAceptadas');
    if (!cookiesAceptadas) {
        cookieBanner.classList.remove('d-none');
    }
    document.getElementById('btnAceptarCookies').addEventListener('click', () => {
        localStorage.setItem('cookiesAceptadas', 'true');
        cookieBanner.classList.add('d-none');
    });



});