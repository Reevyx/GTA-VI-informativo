# Design: Leonida Tpk

Señalización vial nocturna de autopista. La página es un viaje hacia el lanzamiento de GTA VI; cada sección es un cartel de salida.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--asphalt` | `#0c0d0c` | Fondo de página (noche) |
| `--asphalt-2` / `-3` | `#151715` / `#1d201d` | Pavimento, hover sobre pavimento |
| `--steel` / `--steel-hi` | `#262a28` / `#4b524d` | Pórtico, celosía, colgantes |
| `--green` | `#00704a` | Cartel guía (color dominante) |
| `--green-deep` / `--green-lit` | `#00583a` / `#0b7a50` | Paneles internos / hover |
| `--blue` / `--blue-lit` | `#1a4ea0` / `#2a60b6` | Cartel de servicios (stack) |
| `--brown` / `--brown-lit` | `#5b3a1e` / `#6d4828` | Cartel turístico (publicación) |
| `--yellow` | `#f6c90e` | Banda EXIT ONLY = acción principal, foco, selección |
| `--white` | `#f4f6f2` | Letras y bordes reflectivos |
| `--mist`, `--mist-blue`, `--mist-brown` | tintes del color de su cartel | Texto secundario sobre cada cartel |
| `--amber` | `#ffd98a` | Faro, reflectores |

Estrategia: comprometida. El verde ocupa regiones completas; amarillo sólo para la acción principal y estados.

## Tipografía

- Overpass (heredera libre de Highway Gothic) 400/600/800/900 para todo el texto.
- Overpass Mono sólo para medidas: reloj, millas, tamaños de archivo, viewport, código.
- Display máx. 6rem; títulos de cartel `clamp(2rem, …, 4rem)`; mayúsculas con tracking .04–.08em en rótulos.

## Componentes

- **Cartel** (`.sign`): radio 18px, borde blanco interior 3px a 8px del canto, pestaña de salida (`.exit-tab`) pegada arriba, sombra con desplazamiento. Variantes: verde, `--blue`, `--brown`, cierre blanco/negro (`.end-sign`).
- **Banda EXIT ONLY** (`.exit-only`, `.band-link`): amarilla, texto negro 900; hover invierte a negro/amarillo con destello.
- **Botón** (`.btn`): blanco sobre cartel, 50px mín.; variantes `--ghost`, `--dark`, estado `.is-done` amarillo.
- **Pórtico** (`.gantry`): barra de acero fija; salidas como mini-carteles con número en caja blanca (amarilla si activa).
- **Poste de millas** (`.milepost`): progreso de scroll 0.0–6.0; abajo a la derecha en escritorio, dentro del pórtico en móvil.
- **Reflectores** (`.marker`): ojos de gato que se encienden con hover/foco sobre pavimento.
- **Interruptor** (`.switch`): modo calma, `aria-pressed`.

## Movimiento

- Easing único `cubic-bezier(.16, 1, .3, 1)`.
- Firma: el faro (puntero/toque, o un auto que pasa cada 6 s sin entrada) revela la lámina reflectiva prismática bajo `--lx/--ly`.
- Carteles se acercan con `animation-timeline: view()` desde estado visible.
- Carriles avanzan con velocidad ligada al scroll.
- `prefers-reduced-motion` y Modo calma desactivan todo movimiento sin ocultar contenido.

## Responsive

Mobile-first. 720px: columnas en carteles y banda en dos. 1100px: pórtico con todas las salidas. 480px: botón de salidas sólo ícono.
