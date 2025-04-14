// Importar net; nos ayuda con el trabajo de creación de sockets.
const net = require('net');

// Asegúrate de que tienes la función 'evaluate' importada correctamente.
const { evaluate } = require('../util/parser'); // Asegúrate de que la ruta sea correcta

class Socket {
    start() {
        // Devuelve un Promise para que podamos manipularlo cuando termine de crearse el servidor.
        return new Promise(res => {
            this.server = net.createServer(socket => {
                // Dentro de este bloque estará la interacción con el cliente.
                console.log('[SOCKET] [INFO] Cliente conectado.');

                // Acción al recibir algún dato, mensaje o paquete
                socket.on('data', data => {
                    // Convertir el dato recibido a string y eliminar espacios innecesarios
                    let operation = data.toString().trim();
                    console.log('[DEBUG] Operación recibida:', operation); // Log para depuración

                    // Validar si la operación contiene solo números, operadores matemáticos y espacios
                    if (!/^[\d\s\+\-\*\/\(\)\^]+$/.test(operation)) {
                        socket.write(`[SYNTAX ERROR] La operación "${operation}" contiene caracteres no permitidos.\n`);
                        return;
                    }

                    let result;
                    try {
                        // Evaluar la operación matemática utilizando la función evaluate del parser
                        result = evaluate(operation).toString();
                    } catch (e) {
                        console.log('[ERROR] Error al procesar la operación:', e.message);
                        result = `[SYNTAX ERROR] ${e.message}`;
                    }

                    // Devolver el resultado o el error al cliente
                    socket.write(result + '\n');
                });

                // Si el cliente se desconecta, imprimir un mensaje
                socket.on('end', () => {
                    console.log('[SOCKET] [INFO] Cliente desconectado.');
                });

                // Manejar errores en la conexión
                socket.on('error', err => {
                    console.log('[SOCKET] [ERROR]', err.message);
                });
            });

            // Devolver el objeto del servidor a través del Promise
            res(this.server);
        });
    }
}

module.exports = Socket;