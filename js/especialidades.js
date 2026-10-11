// Estado temporal corregido
let especialidadWizardState = {
    platillo: null,
    detallePersonalizacion: null,
    esPaquete: false,
    precioPaqueteExtra: 45, // Costo fijo por hacerlo paquete
    bebidaPaquete: 'Café Americano (Incluido)',
    frutaPaquete: 'Papaya'
};

// PASO 1: Platillos Principales 
function iniciarWizardEspecialidades() {
    especialidadWizardState = {
        platillo: null,
        detallePersonalizacion: null,
        esPaquete: false,
        precioPaqueteExtra: 45,
        bebidaPaquete: 'Café Americano (Incluido)',
        frutaPaquete: 'Papaya'
    };

    let catPlatillos = menuData.categorias.find(c => c.id === "platillos");
    if (!catPlatillos) return;

    const contenedor = document.getElementById("menu-contenedor");
    
    let htmlPlatillos = catPlatillos.items.map(item => `
        <div class="col-12 col-md-4">
            <div class="card h-100 p-3 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick='seleccionarPlatilloEspecialidad(${JSON.stringify(item)})'>
                <h5 class="fw-bold mb-1">${item.nombre}</h5>
                ${item.descripcion ? `<p class="text-muted small mb-2">${item.descripcion}</p>` : ''}
                <span class="fw-bold text-dark">$${item.precio} MXN</span>
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">1. Elige tu especialidad</h4>
            <p class="text-muted small">Selecciona un platillo para comenzar</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                ${htmlPlatillos}
            </div>
        </div>
    `;
}

// PASO 2: Personalizaciones Específicas
function seleccionarPlatilloEspecialidad(platilloObj) {
    especialidadWizardState.platillo = platilloObj;

    // Si el platillo no requiere elegir variedad (Chilaquiles, Enchiladas, Croissant), avanzamos directo al paquete
    if (!platilloObj.opcionesPersonalizacion || platilloObj.opcionesPersonalizacion.length === 0) {
        especialidadWizardState.detallePersonalizacion = null;
        preguntarSiEsPaquete();
        return;
    }

    const contenedor = document.getElementById("menu-contenedor");

    let tituloPersonalizacion = "Personaliza tu platillo";
    if (platilloObj.tipoPersonalizacion === 'preparacion') tituloPersonalizacion = "¿Cómo prefieres tus huevos?";
    if (platilloObj.tipoPersonalizacion === 'sabor') tituloPersonalizacion = "Elige el sabor de tu chapata";
    if (platilloObj.tipoPersonalizacion === 'extras') tituloPersonalizacion = "Elige la presentación de tus molletes";

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
                <i class="bi bi-arrow-left me-1"></i> Volver a especialidades
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
                Continuar a Paquete ➡
            </button>
        </div>
    `;
}

function guardarPersonalizacionYContinuar() {
    let seleccion = document.querySelector('input[name="opcionPersonalizada"]:checked');
    especialidadWizardState.detallePersonalizacion = seleccion ? seleccion.value : null;
    preguntarSiEsPaquete();
}

// PASO 3: ¿Hacerlo paquete? (+$45 MXN)
function preguntarSiEsPaquete() {
    const contenedor = document.getElementById("menu-contenedor");
    let tienePasoPrevio = especialidadWizardState.platillo.opcionesPersonalizacion && especialidadWizardState.platillo.opcionesPersonalizacion.length > 0;

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="${tienePasoPrevio ? "seleccionarPlatilloEspecialidad(especialidadWizardState.platillo)" : "iniciarWizardEspecialidades()"}">
                <i class="bi bi-arrow-left me-1"></i> ${tienePasoPrevio ? 'Volver a opciones' : 'Volver a especialidades'}
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">3. ¿Deseas hacerlo paquete?</h4>
            <p class="text-muted small">Incluye bebida, fruta de la estación y papas saladas (+$45 MXN)</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="definirPaquete(true)">
                        <div class="fs-1 mb-2">🍽️ + ☕</div>
                        <h5 class="fw-bold m-0">Sí, hacerlo paquete</h5>
                        <p class="text-muted small m-0 mt-1">Añade bebida + fruta + papas por +$45 MXN</p>
                    </div>
                </div>
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="definirPaquete(false)">
                        <div class="fs-1 mb-2">🍳</div>
                        <h5 class="fw-bold m-0">Solo el platillo</h5>
                        <p class="text-muted small m-0 mt-1">Ordenar únicamente $${especialidadWizardState.platillo.precio} MXN</p>
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

// PASO 4: Complementos del paquete con desglose claro de bebidas
function mostrarPasoComplementosPaquete() {
    const contenedor = document.getElementById("menu-contenedor");

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="preguntarSiEsPaquete()">
                <i class="bi bi-arrow-left me-1"></i> Volver
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">4. Personaliza los complementos de tu paquete</h4>
            <p class="text-muted small">Elige tu bebida y fruta acompañante</p>
        </div>
        
        <div class="col-12 col-md-8 mx-auto p-4 rounded-3 border shadow-sm">
            <!-- Selección de Bebida -->
            <div class="mb-4">
                <label class="form-label fw-bold text-dark">Elige tu bebida:</label>
                <select id="select-bebida-paq" class="form-select border-secondary">
                    <option value="Café Americano">Café Americano (Incluido)</option>
                    <option value="Refresco">Refresco (Incluido)</option>
                    <option value="Jugo del Valle">Jugo del Valle (Incluido)</option>
                    <option value="Capuchino (+$20)">Cambiar por Capuchino (+$20 MXN)</option>
                    <option value="Latte (+$20)">Cambiar por Latte (+$20 MXN)</option>
                </select>
            </div>

            <!-- Selección de Fruta -->
            <div class="mb-4">
                <label class="form-label fw-bold text-dark">Fruta de la estación:</label>
                <div class="row g-2">
                    <div class="col-6">
                        <div class="selector-sabor-item">
                            <input type="radio" name="frutaPaq" id="frutaPapaya" value="Papaya" checked>
                            <label class="btn-sabor-option text-center" for="frutaPapaya">Papaya</label>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="selector-sabor-item">
                            <input type="radio" name="frutaPaq" id="frutaManzana" value="Manzana">
                            <label class="btn-sabor-option text-center" for="frutaManzana">Manzana</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Acompañante Fijo: Papas -->
            <div class="mb-4 p-3 bg-white rounded border">
                <small class="text-muted d-block">Incluye además:</small>
                <span class="fw-bold text-dark">🍟 Papas saladas (estilo Sabritas)</span>
            </div>

            <div class="text-center pt-2">
                <button class="btn btn-dark btn-lg rounded-pill px-5 shadow" onclick="finalizarAgregarEspecialidadAlCarrito()">
                    <i class="bi bi-cart-plus me-2"></i> Agregar paquete al pedido
                </button>
            </div>
        </div>
    `;
}

// Finalizar y enviar al Carrito
function finalizarAgregarEspecialidadAlCarrito() {
    let p = especialidadWizardState;
    let precioTotal = p.platillo.precio;
    let descripcionDetallada = "";

    if (p.detallePersonalizacion) {
        descripcionDetallada += `Opción: ${p.detallePersonalizacion}`;
    }

    if (p.esPaquete) {
        precioTotal += p.precioPaqueteExtra;
        
        let bebidaSel = document.getElementById("select-bebida-paq")?.value || "Café Americano";
        if (bebidaSel.includes("+20")) {
            precioTotal += 20;
        }

        let frutaSel = document.querySelector('input[name="frutaPaq"]:checked')?.value || "Papaya";

        descripcionDetallada += (descripcionDetallada ? " | " : "") + `Paquete: ${bebidaSel}, Fruta: ${frutaSel}, Papas saladas`;
    }

    let productoFinal = {
        id: 'platillo_' + Date.now(),
        nombre: `${p.platillo.nombre} ${p.esPaquete ? '(Paquete)' : ''}`,
        precio: precioTotal,
        cantidad: 1,
        descripcion: descripcionDetallada
    };

    carrito.push(productoFinal);
    guardarYActualizarCarrito();

    mostrarToastNotificacion(`¡${productoFinal.nombre} agregado al pedido!`);
    renderizarCategoria('platillos');
}