# HTTPS y proxy de Vite

## Proposito

El frontend se sirve por HTTPS en la red local para que el navegador pueda solicitar acceso a la camara. La configuracion tambien evita exponer el backend, la base de datos o el modelo de IA directamente a otros equipos de la red.

## Variables de entorno vacias

El archivo `.env` contiene:

```env
VITE_API_URL=
VITE_AI_WS_URL=
VITE_DEV_HTTPS_CERT=./certs/onelanguage-cert.pem
VITE_DEV_HTTPS_KEY=./certs/onelanguage-key.pem
```

`VITE_API_URL` y `VITE_AI_WS_URL` se dejan vacias de forma intencional. El frontend usa rutas relativas al mismo origen HTTPS desde el que se abrio la pagina.

Si se abre la aplicacion en:

```text
https://192.168.1.9:5173
```

las solicitudes del navegador son:

```text
https://192.168.1.9:5173/auth/login
https://192.168.1.9:5173/api/translations
wss://192.168.1.9:5173/ws/recognize
```

## Redireccion interna

`vite.config.js` recibe esas rutas y las reenvia dentro del equipo anfitrion:

```text
/auth y /api        -> http://127.0.0.1:8084
/ws/recognize       -> ws://127.0.0.1:8000
```

El navegador nunca se conecta directamente a los puertos del backend ni del modelo.

## Beneficios

- Evita contenido mixto: una pagina HTTPS no intenta llamar recursos HTTP o WebSocket sin cifrado desde el navegador.
- Permite el acceso a camara por la IP de intranet.
- Reduce la superficie de red: el unico puerto que debe abrirse para pruebas es el `5173` del frontend HTTPS.
- Mantiene iguales las rutas en `localhost`, intranet y despliegues posteriores.

## No configurar URLs directas

Mientras se use este proxy HTTPS, no se deben configurar valores como estos:

```env
VITE_API_URL=http://192.168.1.9:8084
VITE_AI_WS_URL=ws://192.168.1.9:8000/ws/recognize
```

Esas URLs pueden provocar bloqueo de contenido mixto y obligarian a abrir puertos internos a la red.

## Certificados locales

Los archivos definidos por `VITE_DEV_HTTPS_CERT` y `VITE_DEV_HTTPS_KEY` se generan con `mkcert` y se guardan en `certs/`. Esta carpeta no se sube al repositorio porque contiene una clave privada.

Cada equipo anfitrion debe generar sus propios archivos. Para que otro equipo confie en el HTTPS local, se comparte solamente `rootCA.pem` mediante un canal confiable. Nunca se comparte `rootCA-key.pem` ni `onelanguage-key.pem`.

## Ejecucion

Desde la raiz del frontend:

```powershell
npm run dev -- --host 0.0.0.0
```

El backend debe estar ejecutandose en `127.0.0.1:8084` y el servicio de IA en `127.0.0.1:8000` en el equipo anfitrion.

Si cambia la IP local, se debe generar un certificado nuevo que incluya la nueva IP y actualizar la URL usada para abrir la aplicacion.
