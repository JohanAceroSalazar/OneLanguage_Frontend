# OneLanguage Frontend

Frontend del proyecto **One Language**, con dos aplicaciones independientes:

- **Web**: React 19, Vite, React Router y Axios.
- **Mobile**: React Native 0.86.3, Expo 57, Expo Router y TypeScript.

Ambas consumen el backend Spring Boot y comparten autenticación, perfil, accesibilidad, traducción e historial.

## Requisitos

Node.js, npm, backend disponible en el puerto 8084, PostgreSQL migrado y, para la traducción en tiempo real, el servicio WebSocket de IA. Mobile requiere Expo Go o un emulador/dispositivo.

## Estructura

~~~text
OneLanguage_Frontend/
├── web/       # React + Vite
│   ├── src/components, pages, routes, services
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── mobile/    # React Native + Expo
    ├── app/                 # Rutas Expo Router
    ├── components/, hooks/, constants/
    ├── src/config, src/services
    ├── src/i18n.ts
    └── package.json
~~~

## Web

### Instalación, configuración y comandos

~~~bash
cd OneLanguage_Frontend/web
npm install
npm run dev
npm run lint
npm run build
npm run preview
~~~

Variables disponibles en web/.env (ver web/.env.example):

~~~dotenv
VITE_API_URL=
VITE_AI_WS_URL=
VITE_DEV_HTTPS_CERT=./certs/onelanguage-cert.pem
VITE_DEV_HTTPS_KEY=./certs/onelanguage-key.pem
~~~

VITE_API_URL configura el backend; vacío usa el proxy/origen configurado por Vite. VITE_AI_WS_URL configura el WebSocket de reconocimiento. Para exponer Vite en la red local: npm run dev -- --host 0.0.0.0.

La imagen se construye y sirve con Docker/Nginx:

~~~bash
docker compose -f compose.prod.yml config
docker compose -f compose.prod.yml build frontend
docker compose -f compose.prod.yml up -d frontend
~~~

El contenedor debe estar conectado a la red Docker externa `onelanguage_net`, donde debe existir `onelanguage-backend` escuchando en el puerto 8084. Nginx reenvia `/api/` y `/auth/` al backend; por eso la web usa rutas del mismo origen (`VITE_API_URL=/`) y no requiere abrir el puerto del backend al navegador. La CSP permite esas llamadas mediante `'self'`.

### Funcionalidades

Registro, inicio de sesión, recuperación/restablecimiento de contraseña, sesión JWT, perfil, accesibilidad, cambio de idioma, permisos de cámara y audio, traducción por WebSocket, lectura por voz e historial.

El historial puede reproducir grabaciones obtenidas desde el backend. El permiso files no existe en el frontend actual y no se ofrece descarga local como funcionalidad.

## Mobile

### Instalación y comandos

~~~bash
cd OneLanguage_Frontend/mobile
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
~~~

La configuración de red está en mobile/src/config/network.ts. Variables de mobile/.env.example:

~~~dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.100:8084
EXPO_PUBLIC_AI_WS_URL=ws://192.168.1.100:8000/ws/recognize
~~~

Para Android Emulator suele utilizarse http://10.0.2.2:8084; en un dispositivo físico se debe usar una IP accesible de la máquina que ejecuta el backend.

Expo Router organiza autenticación, inicio, cámara/traducción, historial, perfil, accesibilidad y términos bajo mobile/app. La cámara usa expo-camera, el audio/lectura usa expo-speech y el historial reproduce grabaciones remotas con expo-video.

Mobile solo gestiona los permisos camera y audio. Se eliminó el permiso files y la descarga/almacenamiento local de videos; la reproducción remota permanece disponible.

## Internacionalización

Los catálogos están en web/src/i18n.js y mobile/src/i18n.ts. Los idiomas disponibles son es, en, pt e it; el cambio dinámico se persiste localmente y los textos están guardados en UTF-8.

## Integración y estado

El backend normalmente se ejecuta en http://localhost:8084; CORS, PostgreSQL y el servicio WebSocket deben estar disponibles según el entorno. La traducción en tiempo real depende del servicio de IA y la reproducción depende de que exista una grabación asociada. No existe un compose global para levantar los tres repositorios juntos.

