// Imports
const { Boletos } = require('./gestion_estadio');
//Instancia clase
const boletosInstancia = new Boletos;
// Prompt
const prompt = require('prompt-sync')();

// Funcion menu
function menu(){
    console.clear();
    // Muestra opciones
    console.log(`

    === Gestión Campo de Futbol ===

        1. Comprar Boleto
        2. Verificar acceso
        3. Registrar ingreso
        4. Ver aforo

        5. Salir
        
    `);

    let opcion = Number(prompt ("Selecciona una opción: "));
    switch (opcion){
        case 1:
            boletosInstancia.generarBoleto();
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            console.clear();
            process.exit();
        default:
            console.log("Has seleccionado una opción inválida!");
            console.clear();
            menu(); // Sustituyo bucle por volver a llamar la función.
                break;
    }
}

module.exports = menu;