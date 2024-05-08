import axios from "axios";
import fs from "fs";

async function fetchUserDataWithCookies() {
    try {
        // Cargar y parsear el archivo JSON de cookies
        const cookiesJSON = fs.readFileSync('cookies.txt', 'utf8');
        const cookies = JSON.parse(cookiesJSON);

        // Convertir cookies JSON a una cadena de cookies válida
        const cookiesString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
        // console.log(cookiesString)

        // Realizando la petición POST con axios que me permitirá obtener los datos del usuario
        const response = await axios.post(
            'https://www.prismamoda.com/_v/private/graphql/v1?workspace=master&maxAge=long&appsEtag=remove&domain=store&locale=es-SV',
            { 
                operationName: 'Profile',
                    variables: {},
                    extensions: {
                        persistedQuery: {
                            version: 1,
                            sha256Hash: 'c85be2148d672083db2e34fef20a4b38887fc827cf0546741d0926cef8c2ef58',
                            sender: 'vtex.my-account^@1.x',
                            provider: 'vtex.store-graphql^@2.x'
                        }
                    }
            }, // Datos del usuario, si es necesario, deberían ir aquí
            {
                headers: {
                    'Cookie': cookiesString // Configura las cookies en el encabezado
                }
                
            }
        );

        // Manejar la respuesta de la petición
        console.log('Datos del usuario:', response.data);

        //   return response.data;
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return null;
    }
}

// Ejemplo de uso de la función
fetchUserDataWithCookies()
