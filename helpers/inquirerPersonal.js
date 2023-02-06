const inquirer = require('inquirer');
require('colors');

const inquirerMenu = async() => {

    console.clear();
    console.log('==========================================='.green);
    console.log('     Seleccione una opción!    '.white);
    console.log('===========================================\n'.green);

    const preguntas = {
        type : 'list',
        name : 'opcion',
        message : '¿Que deseas hacer?',
        choices : [
            {
                value: 1,
                name : `${'1.'.green} Buscar Ciudad`
            },
            {
                value: 2,
                name : `${'2.'.green} Historial`
            },
            {
                value: 0,
                name : `${'0.'.green} Salir`
            }        
        ]
    
    }

    const { opcion }  = await inquirer.prompt([preguntas]);    
    
    return opcion;
}

const leerInput = async ( message ) => {

    const question = {
        type : 'input',
        name : 'descripcion',
        message,
        validate( value ) {
            if ( value.length === 0 ){
                return 'Por favor ingrese un valor';
            }
            return true;
        }
    }

    const {descripcion} = await inquirer.prompt(question);
    return descripcion;
}

const pausar = async () => {

    const question = {
        type : 'input',
        name : 'pausaOpcion',
        message: `Pulsa ${ 'ENTER'.green } para continuar` 
    }

    console.log('\n');
    await inquirer.prompt(question)
}

const seleccionarLugar = async (lugaresExistentes = []) => {
    //construir los choices (para los questions preguntas)
    const choicesLugares = lugaresExistentes.map ( (lugarExistente, i) => {
        const idx = `${i + 1}.`.green
        return {
            value : lugarExistente.id,
            name : `${ idx } ${lugarExistente.nombre}`
        }
    });

    choicesLugares.unshift({
        value : '0',
        name: '0. '.green +'Regresar'
    });

    const question = {
        type : 'list',
        name : 'lugarId',
        message : 'Lugares encontrados, seleccione uno de ellos para conocer el clima',
        choices : choicesLugares        
    }
    
    const { lugarId } = await inquirer.prompt( question );

    return lugarId;
}

const confirmarEliminacion = async ( tarea ) => {
    const question = {
       type : 'confirm',
       name : 'eleccion',
       message : `¿ De verdad desea borrar la tarea ${tarea.desc} ?`  
    }

    const { eleccion } = await inquirer.prompt( question );
    return eleccion;
}


const obtenerTareasPorInquirerCheckbox = async (tareas = []) => {

    const choicesTareas = tareas.map ( (tarea, i) => {

        const idx = `${i + 1}.`.green
        return {
            value : tarea.id,
            name : `${ idx } ${tarea.desc}`,
            checked: tarea.completadoEn ? true : false
        }
    });

    const question = {
        type : 'checkbox',
        name : 'ids',
        message : '¿Cuál de las siguientes tareas desea completar?',
        choices : choicesTareas        
    }
    
    const { ids } = await inquirer.prompt( question );

    return ids;
}



module.exports = {
    inquirerMenu,
    pausar,
    leerInput,
    seleccionarLugar,
    confirmarEliminacion,
    obtenerTareasPorInquirerCheckbox
}