# Errazuriz Gran Reserva — Sainsbury's Magazine festive 2026

Landing estática (HTML/CSS/JS, sin build) del concurso *Our Story Your Discovery Errazuriz Book Club*. Duplicada de `../LandingUK/`.

## Enlaces
- Repositorio: https://github.com/cinmorabito-create/errazurizgranreserva
- Sitio en vivo: https://errazurizgranreserva.vercel.app/ (Vercel; cada commit a `main` publica)
- Registro de inscripciones (Google Sheet): https://docs.google.com/spreadsheets/d/1FNcTb5pr9DuMgzN5WI2nqbxAGkcPSamW6m_i1IWZEUk/edit
- Endpoint del formulario (Apps Script): https://script.google.com/macros/s/AKfycbytR_cVj5GbIIvdykNBdO_gY4A4Yz0OFgVYG_CNiHYbOP309oKgKf695e7RyNGdaAOn9A/exec
- Bases (T&Cs): `assets/sainsburys-terms.pdf`, enlazado desde el checkbox obligatorio y el footer

## Probar en local
Abrir `index.html` en el navegador, o servir la carpeta: `python -m http.server 8000`.

## Conectar el formulario a una hoja nueva
Ya está conectado (`scriptUrl` en `script.js`). Si se rehace el script, estos son los pasos; si `scriptUrl` queda vacío, el formulario muestra "Entries are not open yet":

1. Crear una Google Sheet nueva, p. ej. "Errazuriz Gran Reserva – Sainsbury's 2026 – Entries".
2. En la hoja: **Extensiones → Apps Script**, borrar el contenido y pegar `apps-script/Code.gs`. Guardar.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: *Yo*. Quién tiene acceso: *Cualquier usuario*. Autorizar.
4. Copiar la URL que termina en `/exec` y ponerla en `scriptUrl` en `script.js`.
5. Enviar una inscripción de prueba y confirmar que aparece una fila en la hoja (la primera fila de encabezados se crea sola).
