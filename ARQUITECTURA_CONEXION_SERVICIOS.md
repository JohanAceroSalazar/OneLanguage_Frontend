# Conexion entre frontend, backend, IA y base de datos

## Arquitectura local e intranet

```text
Navegador del usuario
https://IP_DEL_ANFITRION:5173
          |
          v
Frontend Vite HTTPS
          |
          +--> /auth y /api
          |        |
          |        v
          |    Backend Spring Boot
          |    http://127.0.0.1:8084
          |        |
          |        v
          |    PostgreSQL
          |    puerto 5438
          |
          +--> /ws/recognize
                   |
                   v
               Servicio IA FastAPI
               ws://127.0.0.1:8000
                   |
                   v
               TensorFlow + MediaPipe
               model/lsc_sequence_model.keras
```

La IP de ejemplo actual es `192.168.1.9`, pero puede cambiar segun la red. El navegador solo accede al frontend HTTPS; los servicios internos se ejecutan en el equipo anfitrion.

## Frontend HTTPS

El frontend se ejecuta en el puerto `5173` y usa Vite como proxy. El navegador realiza solicitudes relativas al mismo origen:

```text
/auth/login
/api/translations
/ws/recognize
```

El archivo `vite.config.js` las reenvia internamente:

```text
/auth y /api        -> http://127.0.0.1:8084
/ws/recognize       -> ws://127.0.0.1:8000
```

Por este motivo `VITE_API_URL` y `VITE_AI_WS_URL` se dejan vacias en `.env`. Consulta [HTTPS_PROXY_CONFIG.md](HTTPS_PROXY_CONFIG.md) para el detalle de HTTPS y certificados.

## Autenticacion y backend

1. El usuario inicia sesion desde el frontend con `POST /auth/login`.
2. Vite reenvia la solicitud al backend Spring Boot.
3. El backend valida correo y contrasena contra PostgreSQL.
4. El backend devuelve un JWT.
5. El frontend guarda el JWT en `localStorage`.
6. Las solicitudes protegidas posteriores incluyen `Authorization: Bearer <token>`.

El backend usa el JWT para conocer al usuario autenticado. No acepta un identificador de usuario enviado por el navegador para consultar el historial.

## Reconocimiento de senas

1. El usuario permite el acceso a la camara desde la pantalla Traducir.
2. El frontend toma fotogramas JPEG de la camara.
3. Los envia por el WebSocket `/ws/recognize`.
4. Vite los reenvia al servicio FastAPI de OneLanguage-AI.
5. MediaPipe extrae landmarks de las manos.
6. TensorFlow evalua una secuencia temporal contra `model/lsc_sequence_model.keras`.
7. El modelo responde estados como `analyzing`, `translated`, `idle` o `no_hands`.
8. El frontend actualiza el texto y puede reproducirlo mediante la voz del navegador.

## Guardado del historial

El usuario controla si una sesion se guarda o no:

```text
Reconocer una o varias senas
        |
        v
Finalizar traduccion
        |
        +--> Guardar en historial
        |        |
        |        v
        |    POST /api/translations
        |        |
        |        v
        |    Backend valida JWT y guarda el registro
        |        |
        |        v
        |    translation.translations en PostgreSQL
        |
        +--> Descartar
                 |
                 v
             No se crea ningun registro
```

El historial usa estos endpoints protegidos:

```text
POST   /api/translations       Guardar una traduccion finalizada
GET    /api/translations       Listar traducciones del usuario autenticado
DELETE /api/translations/{id}  Eliminar una traduccion propia
DELETE /api/translations       Eliminar todo el historial propio
```

Las eliminaciones son logicas: el registro conserva la fecha `deleted_at` en la base, pero no vuelve a aparecer en la aplicacion.

## Servicios que debe iniciar el anfitrion

Abrir tres terminales separadas:

```powershell
# Backend
cd C:\Users\juanp\Desktop\OneLanguage-Backend
docker compose up --build
```

```powershell
# Modelo de IA
cd C:\Users\juanp\Desktop\OneLanguage-AI
.\venv\Scripts\Activate.ps1
python.exe web_service.py
```

```powershell
# Frontend HTTPS
cd C:\Users\juanp\Desktop\OneLanguage_Frontend\web
npm run dev -- --host 0.0.0.0
```

## Puertos y seguridad

| Servicio | Puerto | Exposicion recomendada |
| --- | ---: | --- |
| Frontend Vite HTTPS | 5173 | Intranet privada |
| Backend Spring Boot | 8084 | Solo anfitrion mediante proxy |
| Servicio OneLanguage-AI | 8000 | Solo anfitrion mediante proxy |
| PostgreSQL | 5438 | Solo anfitrion |

El unico puerto que debe permitir el firewall para otro equipo de la intranet es `5173`. No abras directamente los puertos `8000`, `8084` o `5438`.

## Direccion para pruebas

Con todos los servicios activos, abrir en el navegador:

```text
https://IP_DEL_ANFITRION:5173
```

El certificado HTTPS local debe ser confiable en cada equipo de prueba para que la camara funcione. La guia de instalacion del certificado esta en [INTRANET_COMPANERO.md](C:\Users\juanp\Desktop\OneLanguage-AI\INTRANET_COMPANERO.md).
