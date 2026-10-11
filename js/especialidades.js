// Estado temporal para el Wizard de Especialidades
let especialidadWizardState = {
    platillo: null,         // Platillo seleccionado
    detallePersonalizacion: null, // Salsa, preparación, sabor o extra
    esPaquete: false,       // true / false
    precioPaqueteExtra: 45, // Costo extra por hacerlo paquete (ajusta si es necesario)
    cafe: 'Americano',      // 'Americano' o 'Capuchino/Latte' (+20)
    fruta: 'Papaya',        // 'Manzana' o 'Papaya'
    papas: 'Gajo'           // Tipo de papas
};

// PASO 1: Seleccionar el Platillo Principal
function iniciarWizardEspecialidades() {
    especialidadWizardState = {
        platillo: null,
        detallePersonalizacion: null,
        esPaquete: false,
        cafe: 'Americano',
        fruta: 'Papaya',
        papas: 'Gajo'
    };

    let catPlatillos = menuData.categorias.find(c => c.id === "platillos");
    if (!catPlatillos) return;

    const contenedor = document.getElementById("menu-contenedor");
    
    let htmlPlatillos = catPlatillos.items.map(item => `
        <div class="col-12 col-md-4">
            <div class="card h-100 p-3 text-center border-0 bg-light shadow-sm cursor-pointer card-wizard" onclick='seleccionarPlatilloEspecialidad(${JSON.stringify(item)})'>
                <h5 class="fw-bold mb-1">${item.nombre}</h5>
                <p class="text-muted small mb-2">${item.descripcion || 'Preparado al momento'}</p>
                <span class="fw-bold text-dark">$${item.precio} MXN</span>
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">1. Elige tu platillo principal</h4>
            <p class="text-muted small">Selecciona una especialidad de la casa</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                ${htmlPlatillos}
            </div>
        </div>
    `;
}

// PASO 2: Personalización específica según el platillo (Sabor, Preparación o Extras)
function seleccionarPlatilloEspecialidad(platilloObj) {
    especialidadWizardState.platillo = platilloObj;

    // Si no tiene opciones de personalización, saltamos directo al Paso 3 (Paquete)
    if (!platilloObj.opcionesPersonalizacion || platilloObj.opcionesPersonalizacion.length === 0) {
        preguntarSiEsPaquete();
        return;
    }

    const contenedor = document.getElementById("menu-contenedor");

    let tituloPersonalizacion = "Personaliza tu platillo";
    if (platilloObj.tipoPersonalizacion === 'salsa') tituloPersonalizacion = "Elige tu tipo de salsa";
    if (platilloObj.tipoPersonalizacion === 'preparacion') tituloPersonalizacion = "¿Cómo prefieres tus huevos?";
    if (platilloObj.tipoPersonalizacion === 'sabor') tituloPersonalizacion = "Elige el sabor u opción";
    if (platilloObj.tipoPersonalizacion === 'extras') tituloPersonalizacion = "¿Deseas agregar algún ingrediente extra?";

    let htmlOpciones = platilloObj.opcionesPersonalizacion.map((op, idx) => `
        <div class="col-6 col-md-4">
            <div class="selector-sabor-item">
                <input type="radio" name="opcionPersonalizada" value="${op}" id="op_${idx}" ${idx === 0 ? 'checked' : ''}>
                <label class="btn-sabor-option text-center" for="op_${idx}">${op}</label>
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="iniciarWizardEspecialidades()">
                <i class="bi bi-arrow-left me-1"></i> Volver a platillos
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">2. ${tituloPersonalizacion}</h4>
            <p class="text-muted small">Para tu <strong>${platilloObj.nombre}</strong></p>
        </div>
        <div class="col-12 mb-4">
            <div class="row g-2 justify-content-center">
                ${htmlOpciones}
            </div>
        </div>
        <div class="col-12 text-center">
            <button class="btn btn-dark btn-lg rounded-pill px-5 shadow" onclick="guardarPersonalizacionYContinuar()">
                Continuar ➡
            </button>
        </div>
    `;
}

function guardarPersonalizacionYContinuar() {
    let seleccion = document.querySelector('input[name="opcionPersonalizada"]:checked');
    especialidadWizardState.detallePersonalizacion = seleccion ? seleccion.value : null;
    preguntarSiEsPaquete();
}

// PASO 3: ¿Hacerlo paquete? (Sí / No)
function preguntarSiEsPaquete() {
    const contenedor = document.getElementById("menu-contenedor");

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="seleccionarPlatilloEspecialidad(especialidadWizardState.platillo)">
                <i class="bi bi-arrow-left me-1"></i> Volver al paso anterior
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">3. ¿Deseas convertirlo en Paquete?</h4>
            <p class="text-muted small">Incluye café, papas y fruta de la estación (+$${especialidadWizardState.precioPaqueteExtra} MXN)</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 bg-light shadow-sm cursor-pointer card-wizard" onclick="definirPaquete(true)">
                        <div class="fs-1 mb-2">🍽️ + ☕</div>
                        <h5 class="fw-bold m-0">Sí, hacerlo paquete</h5>
                        <p class="text-muted small m-0 mt-1">Completa tu desayuno por solo +$${especialidadWizardState.precioPaqueteExtra}</p>
                    </div>
                </div>
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 bg-light shadow-sm cursor-pointer card-wizard" onclick="definirPaquete(false)">
                        <div class="fs-1 mb-2">🍳</div>
                        <h5 class="fw-bold m-0">Solo platillo</h5>
                        <p class="text-muted small m-0 mt-1">Pedir únicamente la especialidad</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function definirPaquete(esPaq) {
    especialidadWizardState.esPaquete = esPaq;
    if (esPaq) {
        mostrarPasoComplementosPaquete();
    } else {
        finalizarAgregarEspecialidadAlCarrito();
    }
}

// PASO 4: Personalizar complementos del paquete (Café, Fruta, Papas)
function mostrarPasoComplementosPaquete() {
    const contenedor = document.getElementById("menu-contenedor");

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="preguntarSiEsPaquete()">
                <i class="bi bi-arrow-left me-1"></i> Volver
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">4. Personaliza tus complementos de paquete</h4>
        </div>
        
        <div class="col-12 col-md-8 mx-auto bg-light p-4 rounded-3 border">
            <!-- Café -->
            <div class="mb-3">
                <label class="form-label fw-bold">Café incluido:</label>
                <select id="select-cafe-paq" class="form-select">
                    <option value="Americano">Café Americano (Incluido)</option>
                    <option value="Capuchino/Latte (+20)">Cambiar a Capuchino o Latte (+$20)</option>
                </select>
            </div>

            <!-- Fruta -->
            <div class="mb-3">
                <label class="form-label fw-bold">Elige tu fruta:</label>
                <div class="btn-group w-100" role="group">
                    <input type="radio" class="btn-check" name="frutaPaq" id="frutaPapaya" value="Papaya" checked>
                    <label class="btn btn-outline-dark" for="frutaPapaya">Papaya</label>
                    <input type="radio" class="btn-check" name="frutaPaq" id="frutaManzana" value="Manzana">
                    <label class="btn btn-outline-dark" for="frutaManzana">Manzana</label>
                </div>
            </div>

            <!-- Papas -->
            <div class="mb-4">
                <label class="form-label fw-bold">Tipo de papas:</label>
                <input type="text" id="input-papas-paq" class="form-control" value="Papas gajo o a la francesa" placeholder="Ej. Papas gajo">
            </div>

            <div class="text-center">
                <button class="btn btn-dark btn-lg rounded-pill px-5 shadow" onclick="finalizarAgregarEspecialidadAlCarrito()">
                    <i class="bi bi-cart-plus me-2"></i> Agregar al pedido
                </button>
            </div>
        </div>
    `;
}

// Finalizar y mandar al carrito
function finalizarAgregarEspecialidadAlCarrito() {
    let p = especialidadWizardState;
    let precioTotal = p.platillo.precio;
    let descripcionDetallada = "";

    if (p.detallePersonalizacion) {
        descripcionDetallada += `Detalle: ${p.detallePersonalizacion}`;
    }

    if (p.esPaquete) {
        precioTotal += p.precioPaqueteExtra;
        let cafeSel = document.getElementById("select-cafe-paq")?.value || "Americano";
        if (cafeSel.includes("+20")) precioTotal += 20;

        let frutaSel = document.querySelector('input[name="frutaPaq"]:checked')?.value || "Papaya";
        let papasSel = document.getElementById("input-papas-paq")?.value || "Papas";

        descripcionDetallada += ` | Paquete incl: Café (${cafeSel}), Fruta (${frutaSel}), ${papasSel}`;
    }

    let productoFinal = {
        id: 'platillo_' + Date.now(),
        nombre: `${p.platillo.nombre} ${p.esPaquete ? '(En Paquete)' : ''}`,
        precio: precioTotal,
        cantidad: 1,
        descripcion: descripcionDetallada
    };

    carrito.push(productoFinal);
    guardarYActualizarCarrito();

    mostrarToastNotificacion(`¡${p.platillo.nombre} agregado al pedido!`);
    renderizarCategoria('platillos');
}