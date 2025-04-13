// Importar net; nos ayuda con el trabajo de creación de sockets.
const net = require('net')
const { evaluate } = require('../util/parser')

class Socket {
    start() {
        // Devuelve un Promise así lo podemos manipular más adelante, pero sólamente cuando éste haya finalizado su creación.
        return new Promise(res => {
            this.server = net.createServer(socket => {
                // Dentro de este bloque se encontrará cada interacción con sólo un usuario.
                console.log('[SOCKET] [INFO] Cliente conectado.')

                // Acciones al recibir algún dato, mensaje o paquete.
                socket.on('data', data => {
                    // En este caso, vamos a parsear el resultado de modo en el que, dependiendo si los datos coinciden
                    // con el formato, devolvemos un número, o un error de sintaxis, según corresponda.
                    let result
                    try {
                        result = evaluate(data).toString()
                    } catch (e) {
                        result = e.message
                    }

                    // Finalmente, devolver el resultado que corresponda, con salto de línea.
                    socket.write(result + '\n')
                })

                // En el caso de que la conexión con el cliente finalice, vamos a implementar ésto.
                socket.on('end', () => {
                    console.log('[SOCKET] [INFO] Cliente desconectado.')
                })

                // Si ocurre un error en la conexión, sólo vamos a printearlo.
                socket.on('error', err => {
                    console.log('[SOCKET] [ERROR]', err.message)
                })
            })

            // Finalmente, devolver el objeto del servidor a través del Promise.
            res(this.server)
        })
    }
}

module.exports = Socket
