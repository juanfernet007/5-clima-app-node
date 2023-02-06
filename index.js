const { leerInput, inquirerMenu, pausar, seleccionarLugar } = require('./helpers/inquirerPersonal');
const Busquedas = require('./models/busquedas');

const main = async()=> {
    
    const busquedas = new Busquedas();
    let opcion = '';    

    do {
        
        opcion = await inquirerMenu();
        
        switch (opcion) {
            case 1:
                //mostrar mensaje                
                const lugarBusc = await leerInput('Ciudad: ');

                //buscar las lugares por filtro
                const lugaresEncontrados = await busquedas.buscarCiudades( lugarBusc );
                
                //seleccionar lugar de los encontrados
                const idLugarSeleccionado = await seleccionarLugar(lugaresEncontrados);
               
                if(idLugarSeleccionado === '0') continue;

                    const lugarSeleccionado = lugaresEncontrados.find( obj => obj.id === idLugarSeleccionado);

                    //guardar en bd
                    await busquedas.guardarHistorial(lugarSeleccionado.nombre);
                    console.clear();

                    //clima
                    climaEncontrado = await busquedas.buscarClimaPorLatLon( lugarSeleccionado.lat , lugarSeleccionado.lng );
                    
                    //Mostrar resultados
                    console.log('\nInfomración de la ciudad\n'.green)        
                    console.log('Ciudad:'.green, lugarSeleccionado.nombre)
                    console.log('Lat:'.green, lugarSeleccionado.lat)
                    console.log('Lng:'.green, lugarSeleccionado.lng)
                    console.log('Temperatura:'.green, climaEncontrado.temp)
                    console.log('Mínima:'.green, climaEncontrado.min)
                    console.log('Máxima:'.green, climaEncontrado.max)
                    console.log('Como está el clima:'.green, climaEncontrado.desc)
                
                break;                        
            case 2:

                if(busquedas.historial != null) {
                    
                    busquedas.historialCapitalizado2.forEach( function ( element, i) {
                        const idx = `${i + 1}.`.green;
                        console.log(idx, element);
                    });
                    
                }
                

                break;
        }



        if (opcion !=0) await pausar();

    } while (opcion != 0);
    
    
    

}

main();

