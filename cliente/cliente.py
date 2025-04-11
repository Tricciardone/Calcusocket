import socket
import re

def preprocess_formula(formula):
    """
    Inserta el operador de multiplicación (*) implícito en expresiones como 1(2+3) o (2+3)(4+5).
    """
    # Agregar * entre un número y un paréntesis de apertura
    formula = re.sub(r'(\d)(\()', r'\1*\2', formula)
    # Agregar * entre un paréntesis de cierre y un número o paréntesis de apertura
    formula = re.sub(r'(\))(\d|\()', r'\1*\2', formula)
    return formula

def main():
    host = 'localhost'  # Dirección del servidor (ajustar si es necesario)
    port = 1301         # Puerto del servidor (debe coincidir con el del servidor)

    # Crear un socket para conectarse al servidor
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
        try:
            # Conectar al servidor
            client_socket.connect((host, port))
            print(f"Conectado al servidor en {host}:{port}")

            while True:
                # Solicitar al usuario una fórmula para enviar al servidor
                formula = input("Ingrese una fórmula matemática (o 'salir' para terminar): ").strip()
                if formula.lower() == 'salir':
                    print("Cerrando conexión...")
                    break

                # Preprocesar la fórmula para agregar multiplicaciones implícitas
                formula = preprocess_formula(formula)

                # Enviar la fórmula al servidor
                client_socket.sendall(formula.encode('utf-8'))

                # Recibir el resultado del servidor
                result = client_socket.recv(1024).decode('utf-8')
                print(f"Resultado recibido del servidor: {result}")

        except ConnectionRefusedError:
            print("No se pudo conectar al servidor. Asegúrese de que el servidor esté en ejecución.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()