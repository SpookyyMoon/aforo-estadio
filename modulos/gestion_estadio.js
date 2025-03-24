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

    generarAsiento(codigoBoleto){ //Genera un asiento en una grade de forma aleatoria
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

}

// Export functiones
module.exports = {Boletos, GestionEstadio};