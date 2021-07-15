//Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function() {
    /*
        1 = Americano precio base x 1.15
        2 = Asiatico precio base x 1.05
        3 = Europeo = precio base x 1.35
    */

    let cantidad;
    const base = 2000; 

    switch(this.marca) {
        case '1' :
            cantidad = base * 1.15;
            break;
        case '2' :
            cantidad = base * 1.05;
            break;
        case '3' :
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    //definir la antiguedad en años del carro
    const difencia = new Date().getFullYear() - this.year;

    //por cada año mas viejo el costo se reduce en -3%
    cantidad -= ((difencia * 3) * cantidad) / 100;
    


    /*
        si el seguro es basico se multiplica por un 30% más
        si el seguro es basico se multiplica por un 50% más
    */

    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    console.log(cantidad);
    return cantidad;

}

//crear constructor para User Interface
function UI(){}

//Llenar las opciones de los años (funcion unica para las instancias de UI)
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');
    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}


//Muestra alertas en pantalla
UI.prototype.mostratMensaje = (menasaje, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = menasaje;

    //insertar el html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostratResultado = (total, seguro) => {
    const {marca, year, tipo} = seguro;

    let textoMarca;

    switch(marca) {
        case '1' :
            textoMarca = 'Americano';
            break;
        case '2' :
            textoMarca = 'Asiatico';
            break;
        case '2' :
            textoMarca = 'Europeo';
            break;
        default:
            break;

    }

    //crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca : <span class="font-normal"> ${textoMarca}</span></p>
        <p class="font-bold">Año : <span class="font-normal"> ${year}</span></p>
        <p class="font-bold">Tipo : <span class="font-normal capitalize"> ${tipo}</span></p>
        <p class="font-bold">Total : <span class="font-normal">$ ${total}</span></p>

    `;

    const resultadoDiv = document.querySelector('#resultado');
    

    //Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000);

}


//instanciar UI 
const ui = new UI();


document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); //lena el select con los años
})

//EvenListeners

eventListeners();

function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    //leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    //leer el año seleccionado
    const year = document.querySelector('#year').value;
    //leer el tipo de cobertura (el valor viene de un radio button)
    const tipo = document.querySelector('input[name = "tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === '') {
        ui.mostratMensaje('Todos los campos son obligatorios', 'error');
    } 

    ui.mostratMensaje('Cotizando..', 'exito');

    //ocultar las cotizaciones previas
    const resutlados = document.querySelector('#resultado div');
    if( resutlados != null) {
        resutlados.remove();
    }

    //instanciar seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //utilizar el prototype que va a cotizar

    ui.mostratResultado(total, seguro);

}