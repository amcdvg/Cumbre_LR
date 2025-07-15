document.querySelector('.form-container form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario

    const form = event.target;
    const formData = new FormData(form); // Captura datos del formulario, incluidos archivos
    
    // Validación de campos obligatorios
    if (!formData.get('Nombre Completo') || !formData.get('Teléfono') || !formData.get('Tipo de documento') || !formData.get('Número de identificación')) {
        showCustomAlert('Por favor, completa todos los campos requeridos.', 'warning');
        return;
    }
    showLoadingSpinner();
    // Verifica si la cédula ya existe
    // Si la cédula no existe, muestra la rueda de carga y envía el formulario
    showLoadingSpinner();

    // Conversión de datos del formulario a un objeto
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Envío de datos al servidor
    sendDataToServer(data, form);
    hideLoadingSpinner()
});


// Manejar el cambio en el select de dignidad
// Manejar el cambio en el select de dignidad
document.getElementById('dignidad').addEventListener('change', function() {
    const otraDignidadContainer = document.getElementById('otra-dignidad-container');
    if (this.value === 'Otro') {
        otraDignidadContainer.style.display = 'block';
    } else {
        otraDignidadContainer.style.display = 'none';
        document.getElementById('otra_dignidad').value = ''; // Limpiar el campo cuando se oculta
    }
});
// Función para manejar el cambio en el tipo de enlace
document.getElementById('enlace').addEventListener('change', function() {
    const tipoEnlace = this.value;
    const container = document.getElementById('dynamic-select-container');
    
    // Si ya existe un select dinámico, lo eliminamos
    if (container) {
        container.remove();
    }
    
    if (tipoEnlace === 'Municipal') {
        // Crear select para municipios
        const municipioSelect = document.createElement('div');
        municipioSelect.id = 'dynamic-select-container';
        municipioSelect.className = 'form-group dynamic-select';
        municipioSelect.innerHTML = `
            <label for="municipio">Municipio</label>
            <select id="municipio" name="Municipio o Departamento" required>
                <option value="">Selecciona un municipio</option>
                <option value="Pereira">Pereira</option>
                <option value="Apía">Apía</option>
                <option value="Balboa">Balboa</option>
                <option value="Belén de Umbría">Belén de Umbría</option>
                <option value="Dos Quebradas">Dos Quebradas</option>
                <option value="Guática">Guática</option>
                <option value="La Celia">La Celia</option>
                <option value="La Virginia">La Virginia</option>
                <option value="Marsella">Marsella</option>
                <option value="Mistrato">Mistrato</option>
                <option value="Pueblo Rico">Pueblo Rico</option>
                <option value="Quinchia">Quinchia</option>
                <option value="Santa Rosa de Cabal">Santa Rosa de Cabal</option>
                <option value="Santuario">Santuario</option>
            </select>
        `;
        // Insertar después del select de tipo de enlace
        this.parentNode.insertAdjacentElement('afterend', municipioSelect);
        municipioSelect.style.display = 'block';
        
    } else if (tipoEnlace === 'Departamental') {
        // Crear select para departamento (solo Risaralda)
        const departamentoSelect = document.createElement('div');
        departamentoSelect.id = 'dynamic-select-container';
        departamentoSelect.className = 'form-group dynamic-select';
        departamentoSelect.innerHTML = `
            <label for="departamento">Departamento</label>
            <select id="departamento" name="Municipio o Departamento" required>
                <option value="Risaralda" selected>Risaralda</option>
            </select>
        `;
        // Insertar después del select de tipo de enlace
        this.parentNode.insertAdjacentElement('afterend', departamentoSelect);
        departamentoSelect.style.display = 'block';
    }
});

/**
 * Función para enviar datos al servidor.
 * @param {Object} data - Datos del formulario convertidos a un objeto.
 * @param {HTMLFormElement} form - El formulario enviado.
 */
function sendDataToServer(data, form) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbx8P-D_4molDXkyvkQWDaqhaEeJ10sv0KifPZ52kr5p50r0fzIs8BxqQetjLsphkOPGxA/exec";
    console.log(JSON.stringify(data))
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: "no-cors",
        body: JSON.stringify(data)
    })
    .then(() => {
        hideLoadingSpinner();
        showCustomAlert('¡Formulario enviado con éxito!\nGracias por tu registro.', 'success');
        form.reset();
    })
    .catch(error => {
        hideLoadingSpinner();
        showCustomAlert('Hubo un error al enviar el formulario.\nPor favor, inténtalo de nuevo más tarde.', 'error');
        console.error('Error:', error);
    });
}

/**
 * Función para mostrar la rueda de carga (spinner).
 */
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.style.position = 'fixed';
    spinner.style.top = '0';
    spinner.style.left = '0';
    spinner.style.width = '100%';
    spinner.style.height = '100%';
    spinner.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    spinner.style.display = 'flex';
    spinner.style.justifyContent = 'center';
    spinner.style.alignItems = 'center';
    spinner.style.zIndex = '1000';
    spinner.innerHTML = `
        <div style="width: 50px; height: 50px; border: 5px solid rgba(255, 255, 255, 0.3); border-top: 5px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(spinner);
}

/**
 * Función para ocultar la rueda de carga (spinner).
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        document.body.removeChild(spinner);
    }
}

/**
 * Función para mostrar un mensaje de alerta personalizado.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - El tipo de alerta ('success', 'error' o 'warning').
 */
function showCustomAlert(message, type) {
    // Eliminar alertas anteriores si existen
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }

    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    
    // Configuración según el tipo de alerta
    let icon, textColor, borderColor;
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            textColor = '#28a745'; // Verde
            borderColor = '#28a745';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            textColor = '#dc3545'; // Rojo
            borderColor = '#dc3545';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-circle';
            textColor = '#ffc107'; // Amarillo
            borderColor = '#ffc107';
            break;
        default:
            icon = 'fas fa-info-circle';
            textColor = '#17a2b8'; // Azul (default)
            borderColor = '#17a2b8';
    }

    alertBox.innerHTML = `
        <div class="alert-content">
            <i class="${icon}"></i>
            <span class="alert-message">${message}</span>
        </div>
    `;
    document.body.appendChild(alertBox);

    // Estilos CSS para el alert
    const styles = `
        .custom-alert {
            position: fixed;
            top: 250px;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            width: 90%;
            max-width: 400px;
            animation: fadeInDown 0.4s ease-out;
            border-left: 4px solid ${borderColor};
            overflow: hidden;
        }
        .alert-content {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            gap: 14px;
        }
        .custom-alert i {
            font-size: 26px;
            color: ${borderColor};
        }
        .alert-message {
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            font-weight: bold !important;
            font-style: italic !important;
            color: ${textColor} !important;
            white-space: pre-line;
            line-height: 1.4;
            margin: 0;
        }
        @keyframes fadeInDown {
            from { 
                opacity: 0; 
                transform: translate(-50%, -20px); 
            }
            to { 
                opacity: 1; 
                transform: translate(-50%, 0); 
            }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Desaparecer el mensaje después de 4 segundos
    setTimeout(() => {
        alertBox.style.animation = 'fadeOut 0.4s ease-out forwards';
        setTimeout(() => {
            if (document.body.contains(alertBox)) {
                document.body.removeChild(alertBox);
            }
            if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
            }
        }, 400);
    }, 4000);
}



/*function showCustomAlert(message, type) {
    // Eliminar alertas anteriores si existen
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }

    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    
    // Configuración según el tipo de alerta
    let icon, color;
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            color = '#28a745';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            color = '#dc3545';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-circle';
            color = '#ffc107';
            break;
        default:
            icon = 'fas fa-info-circle';
            color = '#17a2b8';
    }

    alertBox.innerHTML = `
        <div class="alert-content">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(alertBox);

    // Estilos CSS para el alert
    const styles = `
        .custom-alert {
            position: fixed;
            top: 250px;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            width: 90%;
            max-width: 400px;
            animation: fadeInDown 0.4s ease-out;
            border-left: 4px solid ${color};
            overflow: hidden;
        }
        .alert-content {
            display: flex;
            align-items: center;
            padding: 15px 20px;
            gap: 12px;
        }
        .custom-alert i {
            font-size: 24px;
            color: ${color};
        }
        .custom-alert span {
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            color: #343a40;
            white-space: pre-line;
        }
        @keyframes fadeInDown {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Desaparecer el mensaje después de 4 segundos
    setTimeout(() => {
        alertBox.style.animation = 'fadeOut 0.4s ease-out forwards';
        setTimeout(() => {
            if (document.body.contains(alertBox)) {
                document.body.removeChild(alertBox);
            }
            // Eliminar los estilos también
            if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
            }
        }, 400);
    }, 4000);
}*/