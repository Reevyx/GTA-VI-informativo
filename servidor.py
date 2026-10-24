"""Servidor local para la página: sirve esta carpeta en tu red Wi-Fi.

El http.server por defecto solo deja 5 conexiones en cola y en Windows
reinicia las demás, así que el navegador pierde imágenes. Este sube la cola
y desactiva la caché para ver los cambios al recargar.
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class Handler(SimpleHTTPRequestHandler):
    # Conexiones persistentes: con HTTP/1.0 Windows corta algunas respuestas (ERR_CONNECTION_RESET).
    protocol_version = "HTTP/1.1"
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".webp": "image/webp", ".js": "text/javascript"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # consola limpia


class Server(ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    root = Path(__file__).resolve().parent
    with Server(("0.0.0.0", port), partial(Handler, directory=str(root))) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
