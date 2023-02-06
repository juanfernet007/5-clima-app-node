const fs = require('fs');
const axios = require('axios');
require('dotenv').config(); 

class Busquedas {

    historial = [];
    bdPath = './bd/historico.json';

    constructor() {        
        this.leerBD();
    }

    get historialCapitalizado() {
        
        this.historial.forEach((lugar, i)=> {            
            
            const words = lugar.split(' ');

            for (let j = 0; j < words.length; j++) {
                words[j] = words[j][0].toUpperCase() + words[j].slice(1);
            }

            this.historial[i] = words.join(' ');
        })
        
        return this.historial;
    }

    get historialCapitalizado2() {
        
        return this.historial.map(lugar => {
            
            let palabras = lugar.split(' ');
            
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        })
        
    }
    

    async buscarCiudades(lugarBusc = '') {

        try {

            const instancia = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugarBusc }.json`,
                params: {
                    'language': 'es',
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5
                }
            })
            
            const response = await instancia.get();                        
            
            return response.data.features.map( lugarEncontrado => ({
                id: lugarEncontrado.id,
                nombre: lugarEncontrado.place_name,
                lng : lugarEncontrado.center[0],
                lat : lugarEncontrado.center[1]
            }));

        }catch (error) {
            console.log('Nada que mostrar', error);
            return [];            
        }        
    }

    async buscarClimaPorLatLon( latitud, longitud) {
        
        try{

            const instancia = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    'lat':latitud,
                    'lon':longitud,
                    'appid':process.env.OPENWEATHER_KEY,
                    'units':'metric',
                    'lang':'es'
                }
            })
    
            const respuesta = await instancia.get();
            const {weather , main} = respuesta.data;

            return {
                desc : weather[0].description,
                temp : main.temp,
                min : main.temp_min,
                max : main.temp_max
            }

        }catch(error){
            console.log('No se pudo obtener el clima', error);            
        }
        
    }

    async guardarHistorial (descripcion = '') {
        
        if(this.historial.includes(descripcion.toLocaleLowerCase())){
            return;
        }
        
        this.historial = this.historial.splice(0,5);
        
        // controlar que no esté repetido
        this.historial.unshift(descripcion.toLocaleLowerCase());

        //guardar bd
        this.guardarBD();
    }

    guardarBD (){
        const payload = {
            historial : this.historial
        }
        fs.writeFileSync(this.bdPath, JSON.stringify(payload))
    }

    leerBD () {
        const data = fs.readFileSync(this.bdPath, "utf8");        
        if(data !== ''){            
            this.historial = JSON.parse(data).historial;            
        }
        
    }

}

module.exports = Busquedas;