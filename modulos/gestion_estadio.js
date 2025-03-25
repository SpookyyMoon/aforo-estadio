// Bibliografía:
// Uso de fechas y hora del equipo en JS: https://www.geeksforgeeks.org/how-to-get-current-time-in-javascript/

// Filesystem
const fs = require('fs');
// Prompt
const prompt = require('prompt-sync')();
// Data
const data = JSON.parse(fs.readFileSync('./aforo.json', 'utf8'));
// Caracteres especiales
const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;    

class Boletos{
    constructor(codigo, asiento, nombre, dni){
        this.codigo = codigo;
        this.asiento = asiento;
        this.nombre = nombre
        this.dni = dni;
    }

    generarBoleto(){ //Genera un boleto nuevo
        console.clear();
        console.log('=== Compra de Boletos ===');
        console.log('\n');
        let nombre = prompt ('Introduce tu nombre: ');
            if(this.regexCheck(nombre)){
                console.log('Has especificado un nombre inválido, intentalo de nuevo!');
                prompt ('Pulsa enter para volver...');
                    return this.generarBoleto();
            }
            else{
                let dni = this.comprobarDNI();
                let codigo = this.generarCodigoBoleto();
                let asiento = null;
                let nuevoBoleto = new Boletos(codigo, asiento, nombre, dni);
            }
    }

    regexCheck(entrada){ //Comprueba caracteres regulares en entradas
        if (regex.test(entrada) || entrada === " " || entrada === "" || !isNaN(entrada)){
            return true;
        }
        else{
            return false;
        }
    }

    comprobarDNI(){ //Comprueba si el DNI introducido es válido
        let dni = prompt ('Introduce tu DNI: ');

        const LETRAS = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D",
                        "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L",
                        "C", "K", "E"];
        let dniNoLetra = dni.substring(0,8);
        for(let i = 0; i < dni.length; i++){
            if(dniNoLetra.length != 8 || isNaN(parseInt(dniNoLetra))){ //Comprueba que la longitud del DNI sea igual a 8 y que contenga solamente caracteres numéricos.
                console.log('El DNI debe contener 8 caracteres númericos y una letra!');
                prompt ('Pulsa enter para volver...');
                    return this.comprobarDNI();
            }
            else{
                let letra = parseInt(dni) % 23;
                if(dniNoLetra + LETRAS[letra] === dni){
                    return dni; //Si el DNI es válido lo devuelve
                }
                else{
                    console.log('El DNI especificado no es válido!');
                    prompt ('Pulsa enter para volver...');
                        return this.comprobarDNI();
                }
            }
        }
    }

    generarCodigoBoleto(){ //Genera un boleto aleatorio
        let LETRAS = ["A", "B", "C", "D"];
        let codigoBoleto = Math.floor((Math.random() * (1000000 - 1) + 1), 0);
        for(let i = codigoBoleto.toString().length; i < 7; i++){
                codigoBoleto = '0' + codigoBoleto;
        }
        let letraBoleto = LETRAS[Math.floor((Math.random() * (3 - 0) + 0), 0)];
        codigoBoleto = (codigoBoleto + letraBoleto);
        return codigoBoleto;
    }
}

class GestionEstadio{

    verificarAcceso(menu){
        console.clear();
        console.log('=== Acceso Estadio ===');
        console.log('\n');
        let boletoCliente = prompt ('Introduce tu código de boleto: ');
        if(!this.verificarBoletoAcceso(boletoCliente)){
            console.clear();
            console.log('=== Acceso Estadio ===');
            console.log('\n');
            console.log('El boleto introducido no es válido!');
            console.log('\n');
            prompt ('Pulsa enter para volver a intentarlo...');
                return this.verificarAcceso();
        }
        else{
            console.clear();
            console.log('=== Acceso Estadio ===');
            console.log('\n');
            console.log('La entrada es válida, tienes acceso al estadio!');
            console.log('\n');
            prompt ('Pulsa enter para volver...');
                return menu();
        }
    }

    verificarBoletoAcceso(boletoCliente){
        let encontrado = false;
        while(!encontrado){
            data.BOLETOS.forEach(boleto => {
                if(boleto.codigo == boletoCliente){ //Recorre la lista de boletos y comprueba si hay coincidencias (Cambiar a búsqueda dicotómica)
                    encontrado = true;
                }
                else{
                    encontrado = false;
                }
            });
        }
        if(!encontrado){
            return false;
        }
        else{
            return true;
        }
    }

    registrarHora(){ //Guarda la hora del equipo
        let horario = new Date();
        return `${horario.getHours}:${horario.getMinutes}`;
    }

    registrarAcceso(menu){
        console.clear();
        console.log('=== Registro de Acceso ===');
        console.log('\n');
        let boleto = ('Introduce tu código de boleto para ingresar al estadio: ');
        if(this.verificarBoletoAcceso && this.comprobarAforo){
            let ingreso = this.registrarHora; //Recibe la hora de registrarHora()
            let asiento = this.asignarAsiento; //Asigna un asiento en base a los asientos libres
            console.log('=== Registro de Acceso ===');
            console.log('\n');
            console.log(`Acceso al estadio concedido, bienvenido ${boleto.nombre}`);
            console.log(`Asiento asignado: ${asiento}`);
            console.log(`Hora de entada: ${ingreso}`);
            console.log('\n');
            prompt ('Pulsa enter para volver...');
                return menu();
        }
        else if(!this.verificarBoletoAcceso){
            console.log('=== Registro de Acceso ===');
            console.log('\n');
            console.log('El boleto introducido no es válido!');
            console.log('\n');
            prompt ('Pulsa enter para volver a intentarlo...');
                return this.registrarAcceso();
        }
        else if(!this.comprobarAforo){
            console.log('=== Registro de Acceso ===');
            console.log('\n');
            console.log('El aforo está completo, debes esperar a que alguien abandone el estadio!');
            console.log('\n');
            prompt ('Pulsa enter para volver al menú...');
                return menu();
        }
    }

    asignarAsiento(){ //Recorre los asientos ocupados y asigna el primer hueco vacio
        let asientoDisponible;
        for(let i = 0; i < data.INGRESOS.length; i++){
            if(i != data.INGRESOS[i].asiento){
                asientoDisponible = i;
            }
        }
        return asientoDisponible;
    }

    
    comprobarIngresoEstadio(boletoBuscar){ //Comprueba si una persona está dentro del estadio
        let encontrado = false;
        let izquierda = 0;
        let derecha = ordenarCodigoBoletos.length - 1;
        let intentos = 0;
            
        while(izquierda <= derecha && !encontrado){
            let division = Math.floor((izquierda + derecha) / 2); //Evitar decimales en el resultado de la division
            intentos++;

            if (ordenarCodigoBoletos[division].codigo == boletoBuscar){
                encontrado = true;
                console.clear();
            }
            else if (ordenarCodigoBoletos[division].codigo[0] > boletoBuscar[0]){
                derecha = division - 1; // Buscar en la mitad izquierda
            }
            else {
                izquierda = division + 1; // Buscar en la mitad derecha
            }
        }
        if(encontrado){
            return true;
        }
        else{
            return false;
        }

        function ordenarCodigoBoletos(){ //Ordena los códigos de los boletos
            let ingresosCopia = JSON.parse(JSON.stringify(data.INGRESOS)); // Copia profunda
    
            for(let i = 0; i < ingresosCopia.length; i++){
                for(let x = 0; x < ingresosCopia.length -1; x++){
                    if(ingresosCopia[x].codigo < ingresosCopia[x+1].codigo){
                        let guardado_valor = ingresosCopia[x+1];
                        ingresosCopia[x+1] = ingresosCopia[x];
                        ingresosCopia[x] = guardado_valor;
                    }
                }
            }
            return ingresosCopia;
        }
    }

    registrarSalida(menu){
        console.clear();
        console.log('=== Registro de Salida ===');
        console.log('\n');
        let boleto = ('Introduce tu código de boleto para ingresar al estadio: ');
        if(this.comprobarIngresoEstadio(boleto)){
            let salida = this.registrarHora; //Recibe la hora de salida
            console.log('=== Registro de Salida ===');
            console.log('\n');
            console.log(`Has abandonado el estadio, tu asiento se ha liberado (Asiento: ${boleto.asiento})`);
            console.log(`Hora de salida: ${salida}`);
            console.log('\n');
            prompt ('Pulsa enter para volver...');
                return menu();
        }
        else{
            console.log('=== Registro de Salida ===');
            console.log('\n');
            console.log('El boleto introducido no es válido!');
            console.log('\n');
            prompt ('Pulsa enter para volver a intentarlo...');
                return this.registrarSalida();
        }
    }

    comprobarAforo(menu){
        console.clear();
        console.log('=== Comprobar Aforo ===');
        console.log('\n');
        data.INGRESOS.forEach(ingreso, contador => {
            contador++;
        });
        if(contador >= 50000){
            return false;
        }
        else{
            return true;
        }
    }
}

// Export functiones
module.exports = {Boletos, GestionEstadio};