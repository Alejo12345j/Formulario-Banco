import validarCantidad from "./validaciones/validarCantidad";
import validarCorreo from "./validaciones/validarCorreo";
import validarNombre from "./validaciones/validarNombre";

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
        const pasoActual2 = document.querySelector('.linea-pasos__paso-check--active')
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
  })