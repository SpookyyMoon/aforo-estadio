// Bibliografía:
// Uso de fechas y hora del equipo en JS: https://www.geeksforgeeks.org/how-to-get-current-time-in-javascript/
// Busqueda de indice con Array.Prototype.map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array

// Filesystem
const fs = require('fs');
// Prompt
const prompt = require('prompt-sync')();
// Data
const data = JSON.parse(fs.readFileSync('./aforo.json', 'utf8'));
// Caracteres especiales
const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;    

class Boletos{
    constructor(codigo, asiento, nombre, dni, entrada, salida){
        this.codigo = codigo;
        this.asiento = asiento;
        this.nombre = nombre
        this.dni = dni;
        this.entrada = entrada;
        this.salida = salida;
    }

    generarBoleto(menu){ //Genera un boleto nuevo
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
                let entrada = null;
                let salida = null;
                let nuevoBoleto = new Boletos(codigo, asiento, nombre, dni, entrada, salida);
                data.BOLETOS.push(nuevoBoleto);
                fs.writeFileSync('./aforo.json', JSON.stringify(data, null, 4), 'utf8');
                console.log(`Boleto generado correctamente:

    Boleto: BOLETO-${nuevoBoleto.codigo}
    Nombre: ${nuevoBoleto.nombre}
    DNI: ${nuevoBoleto.dni}`);
                console.log('\n');
                prompt ('Pulsa enter para volver...');
                    return menu();
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
        data.BOLETOS.forEach(boleto => {
            if(boleto.codigo == boletoCliente){ //Recorre la lista de boletos y comprueba si hay coincidencias (Cambiar a búsqueda dicotómica)
                encontrado = true;
            }
        });
        if(!encontrado){
            return false;
        }
        else{
            return true;
        }
    }

    registrarHora(){ //Guarda la hora del equipo y la formatea
        let horario = new Date();
        let minutos = horario.getMinutes().toString();
        let horas = horario.getHours().toString();
        if(minutos.length == 2 && horas.length == 2){
            return horario.getHours() + ':' + horario.getMinutes();
        }
        else if(horas.length != 2){
            return '0' + horario.getHours() + ':' + horario.getMinutes();
        }
        else if(minutos.length != 2){
            return horario.getHours() + ':' + '0' + horario.getMinutes();
        }
        else{
            return '0' + horario.getHours() + ':' + '0' + horario.getMinutes();
        }
    }

    registrarAcceso(menu){
        console.clear();
        console.log('=== Registro de Acceso ===');
        console.log('\n');
        let boletoIngresado = prompt ('Introduce tu código de boleto para ingresar al estadio: ');
        if(this.verificarBoletoAcceso(boletoIngresado) && this.comprobarAforo){
            let ingreso = this.registrarHora(); //Recibe la hora de registrarHora()
            let asiento = this.asignarAsiento(); //Asigna un asiento en base a los asientos libres
            let indice = data.BOLETOS.map(boleto => boleto.codigo).indexOf(boletoIngresado); //Busca el índice del boleto en el array
            data.BOLETOS[indice].asiento = asiento; // Actualiza asiento
            data.BOLETOS[indice].entrada = ingreso; // Actualiza hora de ingreso
            fs.writeFileSync('./aforo.json', JSON.stringify(data, null, 4), 'utf8'); //Reescribe el boleto
            console.clear();
            console.log('=== Registro de Acceso ===');
            console.log('\n');
            console.log(`Acceso al estadio concedido, bienvenido/a ${data.BOLETOS[indice].nombre}!`);
            console.log(`DNI: ${data.BOLETOS[indice].dni}`);
            console.log(`Boleto: BOLETO-${data.BOLETOS[indice].codigo}`);
            console.log(`Hora de entada: ${data.BOLETOS[indice].entrada}`);           
            console.log(`Asiento asignado: Asiento-${data.BOLETOS[indice].asiento}`);
            console.log('\n');
            data.INGRESOS.push(data.BOLETOS[indice]); // Añade el boleto a ingresos
            data.BOLETOS.splice(indice, 1);
            fs.writeFileSync('./aforo.json', JSON.stringify(data, null, 4), 'utf8'); //Guarda el ingreso
        }
        else if(!this.verificarBoletoAcceso(boletoIngresado)){
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

    asignarAsiento(){ //Recorre los asientos ocupados y asigna el primer hueco vacio siempre que no sea 0, en caso de no haber ingresos asigna el asiento 1
        let asientoDisponible = null;
        let contador = 0;
        if(data.INGRESOS.length == 0){
            asientoDisponible = 1;
        }
        else{
            while(asientoDisponible == null){
                data.INGRESOS.forEach(ingreso => {
                    contador++;
                    if(ingreso.asiento != contador && contador != 0){
                        asientoDisponible = contador;
                    }
                });
            }
        }
        return asientoDisponible;
    }

    comprobarIngresoEstadio(boletoBuscar){ //Comprueba si una persona está dentro del estadio
        let encontrado = false;
        let izquierda = 0;
        let derecha = ordenarCodigoBoletos().length - 1;
        let intentos = 0;
            
        while(izquierda <= derecha && !encontrado){
            let division = Math.floor((izquierda + derecha) / 2); //Evitar decimales en el resultado de la division
            intentos++;

            if (ordenarCodigoBoletos()[division].codigo == boletoBuscar){
                encontrado = true;
                console.clear();
            }
            else if (ordenarCodigoBoletos()[division].codigo[0] > boletoBuscar[0]){
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
        let boletoIngresado = prompt ('Introduce tu código de boleto para salir del estadio: ');
        if(this.comprobarIngresoEstadio(boletoIngresado)){
            let salida = this.registrarHora(); //Recibe la hora de salida
            let indice = data.INGRESOS.map(ingreso => ingreso.codigo).indexOf(boletoIngresado); //Busca el índice del boleto en el array
            data.INGRESOS[indice].salida = salida; // Actualiza la hora de la salida
            fs.writeFileSync('./aforo.json', JSON.stringify(data, null, 4), 'utf8'); //Reescribe el ingreso
            console.log('=== Registro de Salida ===');
            console.log('\n');
            console.log(`Has abandonado el estadio ${data.INGRESOS[indice].nombre}, tu asiento se ha liberado (Asiento: ${data.INGRESOS[indice].asiento})`);
            console.log(`Hora de salida: ${data.INGRESOS[indice].salida}`);
            console.log('\n');
            data.SALIDAS.push(data.INGRESOS[indice]); // Añade el boleto a ingresos
            data.INGRESOS.splice(indice, 1);
            fs.writeFileSync('./aforo.json', JSON.stringify(data, null, 4), 'utf8'); //Guarda el ingreso
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

    comprobarAforo(){
        console.clear();
        console.log('=== Comprobar Aforo ===');
        console.log('\n');
        let contador = 0;
        data.INGRESOS.forEach(ingreso => {
            contador++;
        });
        console.log('Aforo actual: ' + contador);
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