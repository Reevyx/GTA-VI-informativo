# Rumbo a Vice City · GTA VI (página fan)

Página de una sola pantalla con temática del lanzamiento de GTA VI (19 de noviembre de 2026) que se explica a sí misma. HTML, CSS y JS puros.

## Probar en local

Doble clic en `iniciar-servidor.bat`. Abre el navegador con la IP de tu red (por ejemplo `http://192.168.x.x:8000/`), así el QR de la página funciona en cualquier celular conectado al mismo Wi-Fi. Puerto distinto: `iniciar-servidor.bat 9000`.

## Publicar en GitHub Pages

1. Crea un repositorio vacío en GitHub (sin README).
2. Ejecuta `publicar-github.bat`, escribe tu usuario y el nombre del repo. Actualiza la URL pública del QR y hace push.
3. En el repo: Settings > Pages > Deploy from a branch > `main` / `(root)` > Save.

La página queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Archivos

- `index.html`, `style.css`, `script.js`: la página.
- `vendor/qrcode.js`: qrcode-generator de Kazuhiko Arase (MIT).
- `PRODUCT.md`, `DESIGN.md`: contexto de producto y sistema visual.

Proyecto de fans sin fines comerciales. No afiliado con Rockstar Games ni Take-Two Interactive.
