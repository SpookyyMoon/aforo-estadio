// Bibliografía:
// Uso de fechas y hora del equipo en JS: https://www.geeksforgeeks.org/how-to-get-current-time-in-javascript/

// Filesystem
const { timeStamp } = require('console');
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
                console.log(nombre, dni, 'BOLETO-'+codigo);
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

    generarAsiento(codigoBoleto){ //Genera un asiento en una grada de forma aleatoria
        let asientoBoleto;
        switch(codigoBoleto[-1]){
            case 'A': //Rango 12500
                break;
            case 'B': //Rango 25000
                break;
            case 'C': //Rango 37500
                break;
            case 'D': //Rango 50000
                break;
        }
    }
}

class GestionEstadio{

    verificarAcceso(menu){
        console.clear();
        console.log('=== Acceso Estadio ===');
        console.log('\n');
        let boletoCliente = prompt ('Introduce tu código de boleto: ');
        if(!this.verificarBoletoAcceso(boletoCliente)){
            console.log('El boleto introducido no es válido!');
            prompt ('Pulsa enter para volver a intentarlo...');
                return this.verificarAcceso();
        }
        else{
            console.clear();
            console.log(`
            === Acceso Estadio ===
            
            La entrada es válida, tienes acceso al estadio!
            Nombre: ${boletoCliente.nombre}
            DNI: ${boletoCliente.dni}
            Código: ${boletoCliente.codigo}
            Asiento: ${boletoCliente.asiento}

            `);
            prompt ('Pulsa enter para volver...');
                return menu;
        }
    }

    verificarBoletoAcceso(boletoCliente){
        data.BOLETOS.forEach(boleto => {
            if(boletoCliente.codigo == boleto.codigo){ //Recorre la lista de boletos y comprueba si hay coincidencias (Cambiar a búsqueda dicotómica)
                return true;
            }
            else{
                return false;
            }
        });
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
        if(this.verificarBoletoAcceso){
            let ingreso = this.registrarHora; //Recibe la hora de registrarHora()
            console.log(`Acceso al estadio concedido, bienvenido ${boleto.nombre}`);
            console.log(`Hora de entada: ${ingreso}`);
            prompt ('Pulsa enter para volver...');
                return menu;
        }
        else{
            console.log('El boleto introducido no es válido!');
            prompt ('Pulsa enter para volver a intentarlo...');
                return this.registrarAcceso();
        }
    }

    comprobarIngresoEstadio(){ //Comprueba si una persona está dentro del estadio

    }

    registrarSalida(menu){
        console.clear();
        console.log('=== Registro de Salida ===');
        console.log('\n');
        let boleto = ('Introduce tu código de boleto para ingresar al estadio: ');
        if(this.comprobarIngresoEstadio){
            let salida = this.registrarHora; //Recibe la hora de salida
            console.log(`Has abandonado el estadio, tu asiento se ha liberado (Asiento: ${boleto.asiento})`);
            console.log(`Hora de salida: ${salida}`);
            prompt ('Pulsa enter para volver...');
                return menu;
        }
        else{
            console.log('El boleto introducido no es válido!');
            prompt ('Pulsa enter para volver a intentarlo...');
                return this.registrarSalida();
        }
    }
}

// Export functiones
module.exports = {Boletos, GestionEstadio};