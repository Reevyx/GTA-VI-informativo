# Design: Vice City de noche

Vice City después de la puesta de sol, como una película que se recorre con el scroll. Inspirado por el ambiente de la web oficial de GTA VI (pedido explícito del usuario) sin usar su logo, arte ni personajes.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--night` | `#07060c` | Fondo: noche índigo casi negra |
| `--night-2` / `--night-3` | `#0e0b18` / `#171226` | Superficies, pistas del interruptor |
| `--ink` | `#f7eff6` | Texto principal |
| `--muted` / `--faint` | `#bcaecb` / `#8d7fa0` | Texto secundario / leyendas y pie |
| `--line` | `rgba(247,239,246,.14)` | Filetes divisorios |
| `--pink` → `--coral` → `--amber` | `#ff4d9d` → `#ff7657` → `#ffc15e` | `--sunset`: sólo titulares destacados, números del reloj, acción principal, barra de progreso |
| `--cyan` | `#57e1f0` | Acento raro: notas "Cómo se hizo" y datos en vivo |
| `--on-grad` | `#1d0a14` | Texto sobre el degradado |

Estrategia: la fotografía nocturna es el material; el degradado atardecer se reserva para lo que debe brillar.

## Tipografía

- **Big Shoulders Display** 800/900, mayúsculas, interlineado .88: titulares (`.display`, máx. 6rem), nombres de lugares, menú, reloj.
- **Hanken Grotesk** 400–700: lectura, botones, etiquetas.
- Etiquetas pequeñas en mayúsculas con tracking .12–.2em.

## Componentes

- **Intro VI** (`.intro`): las letras VI recortan la noche y muestran el skyline; el scroll escala el SVG entero hacia el centro de la "I" (`--s`, `--ox/--oy`) hasta revelar la foto y el titular. Sin JS o con movimiento reducido, se muestra el estado final.
- **Nav** fija transparente que gana fondo con desenfoque al bajar; píldora con días restantes; botón Menú (líneas que se cruzan).
- **Menú** a pantalla completa: se abre en círculo desde el botón, enlaces enormes que suben escalonados, degradado que rellena el texto al pasar, foto de la sección de fondo.
- **Botones**: `.btn--grad` (degradado, sombra rosa desplazada, destello), `.btn--line` (contorno que se enciende en rosa).
- **Tarjetas de lugar** (`.place`): foto 3:4, título condensado; en escritorio luz que sigue al cursor, zoom y descripción que sube; en móvil carrusel con scroll-snap.
- **Nota "Cómo se hizo"** (`.bts`): filete superior, etiqueta cian con punto.
- **Reloj** (`.clock`): cuatro números con degradado que ruedan al cambiar.
- **Especificaciones** (`.specs`): filas con filete, título que se desplaza y toma ámbar al pasar.
- **QR** en marco blanco con resplandor; al pasar, una línea de luz lo escanea.

## Movimiento

- Easing `cubic-bezier(.16,1,.3,1)`; menú `cubic-bezier(.76,0,.24,1)`.
- Ligado al scroll (`animation-timeline: view()`): textos suben desde desenfoque, fotos se revelan con `clip-path` y zoom, parallax en Lucia & Jason.
- Grano de película animado sobre toda la página.
- `prefers-reduced-motion` y el Modo calma apagan todo el movimiento sin ocultar contenido.

## Responsive

Mobile-first (la entrada principal es el QR). 720px: tarjetas en cuadrícula de 3. 900px: columnas en Vice City, Cómo se hizo y Compartir; foto de Lucia & Jason a la derecha. Portada móvil con recorte vertical propio (`hero-mobile.webp`).

## Imágenes

Seis fotos originales generadas con Higgsfield (nano_banana_2), convertidas a WebP (~895 KB en total). Cada archivo lleva su prompt en `img/*.webp.json`. Las personas aparecen sólo de espaldas.
