import java.io.*;
import java.net.Socket;

public class Cliente {
    private String host;
    private int port;
    private Socket socket;
    private PrintWriter out;
    private BufferedReader in;

    public Cliente(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public void connect() throws IOException {
        try {
            socket = new Socket();
            socket.connect(new java.net.InetSocketAddress(host, port), 5000); // Timeout 5 seg
            out = new PrintWriter(socket.getOutputStream(), true); // autoflush activado
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            System.out.println("Conectado al servidor en " + host + ":" + port);
        } catch (java.net.ConnectException e) {
            throw new IOException("No se pudo conectar al servidor. Asegúrate que el servidor esté ejecutándose en "
                    + host + ":" + port);
        } catch (java.net.SocketTimeoutException e) {
            throw new IOException("Tiempo de conexión agotado. El servidor en " + host + ":" + port + " no responde.");
        }
    }

    public String sendExpression(String expression) throws IOException {
        // Enviar expresión y recibir línea con resultado
        out.println(expression); // println añade \n
        return in.readLine();    // espera hasta recibir \n
    }

    public void disconnect() {
        try {
            if (in != null) in.close();
            if (out != null) out.close();
            if (socket != null) socket.close();
            System.out.println("Desconectado del servidor.");
        } catch (IOException e) {
            System.err.println("Error al desconectar " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        String host = "localhost"; // o IP del servidor
        int port = 1301;
        Cliente client = new Cliente(host, port);
        BufferedReader userInput = new BufferedReader(new InputStreamReader(System.in));

        try {
            System.out.println("Intentando conectar al servidor...");
            client.connect();

            while (true) {
                System.out.print("\nIngresa una expresión matematica (o 'EXIT' para terminar la conexión ): ");
                String expression = userInput.readLine();

                if (expression == null || expression.equalsIgnoreCase("EXIT")) {
                    System.out.println("Cerrando conexión...");
                    break;
                }

                System.out.println("Enviando expresión: " + expression);
                String result = client.sendExpression(expression);
                System.out.println("Resultado: " + result);
            }
        } catch (IOException e) {
            System.err.println("Error de conexión: " + e.getMessage());
        } finally {
            client.disconnect();
        }
    }
}
