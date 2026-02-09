export let datosJson = null;

export async function cargarJSON() {
    try {
        const respuesta = await fetch('http://127.0.0.1:8000/api/productos');
        //espera a recibir la respuesta de la API
        const json = await respuesta.json();
        //convierte la respuesta en obj
        let datosJson = json.data;

        return datosJson;

    } catch (e) {
        const error = `<p class="error">Error al cargar el catálogo :(</p>`;
        console.log(e + error)
        
        return error
    }
}

export async function getProductoById(id){
    const datosAPI = await cargarJSON();
        return datosAPI.find(producto => producto.id === id);
}