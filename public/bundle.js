'use strict';

const formulario$3 = document.getElementById('formulario');

const validarCantidad = () => {
    // Aceptamos cualquier digito (0-9) y punto decimales
    const expRegCantidad = /^\d+(\.\d+)?$/;

    // Obtenemos input cantidad
    const inputCantidad = formulario$3.cantidad;

    if(expRegCantidad.test(inputCantidad.value)){
        inputCantidad.classList.remove('formulario__input--error');
        return true;
    }else {
        inputCantidad.classList.add('formulario__input--error');
        return false;
    }

};

const formulario$2 = document.getElementById('formulario');

const validarNombre = () => {
    // Aceptamos cualquier digito (0-9) y punto decimales
    const expRegNombre = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;

    // Input nombre
    const inputNombre = formulario$2[`nombre-receptor`];

    if(expRegNombre.test(inputNombre.value)){
        inputNombre.classList.remove('formulario__input--error');
        return true;
    }else {
        inputNombre.classList.add('formulario__input--error');
        return false;
    }

};

const formulario$1 = document.getElementById('formulario');

const validarCorreo = () => {
    // Aceptamos cualquier digito (0-9) y punto decimales
    const expRegCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    // Input nombre
    const inputCorreo = formulario$1[`correo-receptor`];

    if(expRegCorreo.test(inputCorreo.value)){
        inputCorreo.classList.remove('formulario__input--error');
        return true;
    }else {
        inputCorreo.classList.add('formulario__input--error');
        return false;
    }

};

const marcarPaso = (paso) => {
    document.querySelector(`.linea-pasos [data-paso="${paso}"] span`). classList.add('linea-pasos__paso-check--checked');
};

const siguientePaso = () => {
    // Crear un arreglo
    const pasos = [...document.querySelectorAll('.linea-pasos__paso')];

    // obtener el paso activo
    const pasoActivo = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso');

    // index del paso activo 
    const indexPasoActivo = pasos.indexOf(pasoActivo);

    if(indexPasoActivo < pasos.length - 1) {
        // Eliminamos clase activas
        pasoActivo.querySelector('span').classList.remove('linea-pasos__paso-check--active');

        // Ponemos la clase activa al siguiente elemento
        pasos[indexPasoActivo + 1].querySelector('span').classList.add('linea-pasos__paso-check--active');

        const id = pasos[indexPasoActivo + 1].dataset.paso;
        document.querySelector(`.formulario__body [data-paso = '${id}']`).scrollIntoView({
            inline: 'start',
            behavior: 'smooth'
        });

    }
};

const formulario = document.getElementById('formulario');

// Reiniciar el scroll 

formulario.querySelector('.formulario__body').scrollLeft = 0;

// Sirve para comprobar los campos de formulario cuando el usuario corrige.
formulario.addEventListener('keyup',(e) => {
    if(e.target.tagName  === 'INPUT'){
        if(e.target.id === 'cantidad'){
            validarCantidad(); 
        } else if(e.target.id === 'nombre-receptor'){
            validarNombre();
        } else if(e.target.id === 'correo-receptor'){
            validarCorreo(); 
        }
    }
});

const btnFormulario = document.getElementById('formulario__btn');
btnFormulario.addEventListener('click',(e) => {
    e.preventDefault();

    const pasoActual = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso').dataset.paso;

    if(pasoActual === 'cantidad'){
        if(validarCantidad()){
            marcarPaso('cantidad');
            siguientePaso();
        }
    }else if(pasoActual === 'datos'){
        if(validarNombre() && validarCorreo()){
            marcarPaso('datos');
            siguientePaso();
        }
    } else if(pasoActual === 'metodo'){
        marcarPaso('metodo');

        // Formato de moneda
        const opcion = {style: 'currency', currency: 'USD'};
        const formatoMoneda = new Intl.NumberFormat('es-MX', opcion);

        document.querySelector(`[data-valor = "cantidad"] span`).innerText = formatoMoneda.format(formulario.cantidad.value);
        document.querySelector(`[data-valor = "nombre-receptor"] span`).innerText = formulario['nombre-receptor'].value;
        document.querySelector(`[data-valor = "correo-receptor"] span`).innerText = formulario['correo-receptor'].value;
        document.querySelector(`[data-valor = "metodo"] span`).innerText = formulario.metodo.value;

        btnFormulario.querySelector('span').innerHTML = 'Transferir';

        btnFormulario.classList.add('formulario__btn--disabled');

        // ocultar boton
        btnFormulario.querySelector('[data-icono="siguiente"]').classList.remove('formulario__btn-contenedor-icono--active');

        //Mostar icono del banco 
        btnFormulario.querySelector('[data-icono="banco"]').classList.add('formulario__btn-contenedor-icono--active');


        siguientePaso();

        // Eliminamos la clase disabled
        setTimeout(() => {
            btnFormulario.classList.remove('formulario__btn--disabled');
        },4000);
    } else if(pasoActual === 'confirmacion' && !btnFormulario.matches('.formulario__btn--disabled')){
        // Aqui se haria la peticion al servidor, una redireccion, etc.
        
        
        // Cambiamos el texto del btn a transferir
        btnFormulario.querySelector('span').innerText = 'Transfiriendo';
        // Agregamos la clase que deshabilita el boton
        btnFormulario.classList.add('formulario__btn--disabled');

        setTimeout(() => {
            formulario.classList.add('formulario--hidden');
            document.getElementById('alerta').classList.add('alerta--active');
        }, 4000);
    }


});

const linea =  document.getElementById('linea-pasos');
linea.addEventListener('click', (e) => {
    // Validacion 
    if(!e.target.closest('.linea-pasos__paso')) return;

    const pasoActual = document.querySelector('.linea-pasos__paso-check--active').closest('.linea-pasos__paso').dataset.paso;
    if(pasoActual === 'cantidad'){
        if(!validarCantidad())return;
    } else if(pasoActual === 'datos'){
        if(!validarNombre() || !validarCorreo())return;  
    } 

    const pasoANavegar = e.target.closest('.linea-pasos__paso');

    if(pasoANavegar.querySelector('.linea-pasos__paso-check--checked')){
        const pasoActual2 = document.querySelector('.linea-pasos__paso-check--active');
        pasoActual2.classList.remove('linea-pasos__paso-check--active');

        const id = pasoANavegar.dataset.paso;

        // Agregamos la clase de active al nuevo paso
        linea.querySelector(`[data-paso = '${id}'] span`).classList.add('linea-pasos__paso-check--active');

        const btnFormulario = document.querySelector('#formulario__btn');
        btnFormulario.querySelector('span').innerText = 'Siguiente';
        btnFormulario.querySelector(`[data-icono = 'banco']`).classList.remove('formulario__btn-contenedor-icono--active');
        btnFormulario.querySelector(`[data-icono = 'siguiente']`).classList.add('formulario__btn-contenedor-icono--active');
        btnFormulario.classList.remove('formulario__btn--disabled');


        // Navegamos
        document.querySelector(`.formulario__body [data-paso = '${id}']`).scrollIntoView({
            inline: 'start',
            behavior: 'smooth',
        });

    }
  });
//# sourceMappingURL=bundle.js.map
