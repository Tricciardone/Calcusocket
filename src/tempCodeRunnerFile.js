/**
 * calcusock-server
 * @author Gerardo Wacker
 */

// En el caso de que exista una variable de entorno que contenga el puerto, tomamos esa. Caso contrario, tomamos al
// mejor número del mundo.
const port = process.env.PORT || 1301

// Importar la clase y crear el objeto de Socket.
const Socket = require('./controllers/socket.controller')
const socket = new Socket()

// Iniciar el servidor.
socket.start().then(server =>
{
    server.listen(port, () =>
    {
        console.log('🚀 calcusock-server iniciado con éxito en el puerto ' + port + '.')
    })
})

// Ejemplo de uso
//
// Al crear un cliente, sea en el lenguaje que sea, hay que establecer una conexión con el socket del servidor.
// Imaginémonos que estamos en un entorno local, deberíamos conectarnos a localhost:1301 (o el puerto personalizado
// correspondiente.
//
// Luego de ello, deberíamos enviar un paquete tradicional, cuyo contenido sea sólamente un string de texto, y que
// contenga únicamente la operación solicitada. Por ejemplo, enviamos un paquete que diga "(1 + 1) * 2".
// El servidor lo va a recibir, va a efectuar los parseos y evaluaciones correspondientes, y luego devolverá otro
// paquete, sin nomenclar, con el resultado. Éste estará dirigido únicamente al cliente que lo envió, debido a que,
// naturalmente, el paquete `net` ya lo administra de ese modo por defecto.
//
// Finalmente, si no hay otra operación que realizar, únicamente se debe cerrar la conexión.