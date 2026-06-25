# OneLanguage Frontend

Repositorio del frontend del proyecto **OneLanguage**.

Este repositorio contiene dos aplicaciones separadas:

- `web`: frontend web en **React + Vite**
- `mobile`: frontend movil en **Expo + React Native**

Ambas aplicaciones consumen el backend Spring Boot del proyecto para autenticar usuarios, registrar informacion y preparar el flujo de traduccion de señas.

## Arquitectura general

La arquitectura del frontend esta separada por plataforma:

- **Web**
  - Interfaz accesible desde navegador
  - Rutas con `react-router-dom`
  - Llamadas HTTP al backend con `axios`
  - Empaquetado para produccion con `Dockerfile` + `nginx`

- **Movil**
  - Aplicacion para Android/iOS usando Expo
  - Navegacion por carpetas con `expo-router`
  - Llamadas HTTP al backend con `fetch`
  - Se ejecuta normalmente en desarrollo con Expo Go o emulador

## Estructura del repositorio

```text
OneLanguage_Frontend/
├── README.md
├── web/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── routes/
│       ├── pages/
│       ├── services/
│       └── components/
└── mobile/
    ├── package.json
    ├── app/
    ├── components/
    ├── hooks/
    ├── constants/
    └── src/
        └── services/
```

## Web

### Tecnologias

- React 19
- Vite
- React Router DOM
- Axios
- React Icons

### Arquitectura de la web

La web esta organizada por funcionalidad:

- `src/routes`
  - Define las rutas principales de la aplicacion.

- `src/pages`
  - Contiene las vistas o pantallas.
  - Ejemplos: `login`, `register`, `home`, `history`, `translate`.

- `src/components`
  - Contiene componentes reutilizables como `Button` e `Input`.

- `src/services`
  - Contiene la capa de acceso a API.
  - Aqui esta configurado `axios` y el servicio de autenticacion/registro.

### Conexion con el backend

La web apunta al backend mediante la variable:

```bash
VITE_API_URL
```

Si no se define, usa por defecto:

```text
http://localhost:8084
```

### Endpoints usados por ahora

- `POST /api/users`
  - Registro de usuario

- `GET /api/users`
  - Listado de usuarios

- `GET /api/users/{id}`
  - Consulta de usuario por id

- `DELETE /api/users/{id}`
  - Borrado logico de usuario

### Ajuste importante

El frontend web tenia una URL vieja apuntando a `http://localhost:8000`.
Eso ya fue corregido para que consuma el backend real en `8084`.

## Web en Docker

Se agrego:

- [`web/Dockerfile`](./web/Dockerfile)
- [`web/nginx.conf`](./web/nginx.conf)

### Que hace el Dockerfile

1. Compila la aplicacion con Node.
2. Inyecta la variable `VITE_API_URL`.
3. Sirve la carpeta `dist` con Nginx.

### Que hace nginx.conf

- Sirve la SPA de React correctamente.
- Permite refrescar rutas como `/login` o `/register` sin error 404.
- Entrega archivos estaticos con cache.

### Build de la web

Desde `OneLanguage_Frontend/web`:

```bash
docker build --build-arg VITE_API_URL=http://localhost:8084 -t onelanguage-web .
```

### Run de la web

```bash
docker run -p 3000:80 onelanguage-web
```

Luego puedes abrir:

- `http://localhost:3000`

## Movil

### Tecnologias

- Expo
- React Native
- Expo Router
- TypeScript

### Arquitectura de la movil

La app movil usa una estructura por rutas en la carpeta `app`:

- `app/_layout.tsx`
  - Define el stack general de navegacion.

- `app/(auth)/`
  - Agrupa pantallas de autenticacion y flujo principal.

- `components/`
  - Componentes reutilizables de UI.

- `hooks/`
  - Hooks compartidos de tema y color.

- `constants/`
  - Valores globales de estilo o tema.

- `src/services/`
  - Llamadas al backend.

### Conexion con el backend

La movil usa esta variable:

```bash
EXPO_PUBLIC_API_URL
```

Si no se define, usa:

```text
http://localhost:8084
```

### Importante para movil

- En Android Emulator, normalmente el backend local se consume con `http://10.0.2.2:8084`
- En celular fisico, debes usar la IP local de tu PC, por ejemplo `http://192.168.1.50:8084`

## Como correr el proyecto

### Opcion 1: correr solo la web

1. Entra a `web`
2. Instala dependencias

```bash
npm install
```

3. Crea un archivo `.env` si quieres cambiar el backend

```bash
VITE_API_URL=http://localhost:8084
```

4. Levanta en modo desarrollo

```bash
npm run dev
```

### Opcion 2: correr la web con Docker

1. Asegura que el backend este levantado
2. Construye la imagen

```bash
docker build --build-arg VITE_API_URL=http://localhost:8084 -t onelanguage-web .
```

3. Ejecuta el contenedor

```bash
docker run -p 3000:80 onelanguage-web
```

### Opcion 3: correr la movil

1. Entra a `mobile`
2. Instala dependencias

```bash
npm install
```

3. Define la URL del backend si hace falta

```bash
EXPO_PUBLIC_API_URL=http://localhost:8084
```

4. Inicia Expo

```bash
npm run start
```

O tambien:

```bash
npx expo start
```

## Relacion con el backend

Este frontend se conecta al backend del repositorio:

- `OneLanguage-Backend`

El backend debe estar corriendo en:

- `http://localhost:8084`

Tambien debe estar levantada la base de datos del proyecto para que los endpoints funcionen correctamente.

## Flujos implementados

### Web

- Registro
- Login visual
- Home
- Historia
- Traduccion
- Accesibilidad
- Perfil
- Recuperacion de contrasena

### Movil

- Login
- Registro
- Recuperacion de contrasena
- Home
- Historia
- Camara
- Accesibilidad
- Perfil
- Terminos

## Notas importantes

- La web ya tiene Dockerfile.
- La movil normalmente no necesita Dockerfile para desarrollo.
- La conexion al backend depende de CORS y de la URL correcta del entorno.
- Si cambias el puerto del backend, debes actualizar `VITE_API_URL` y `EXPO_PUBLIC_API_URL`.

## Siguiente paso recomendado

Lo mas util ahora seria:

1. crear un `docker-compose.yml` global para levantar frontend, backend y base de datos juntos,
2. o documentar en detalle las variables de entorno de cada app,
3. o terminar el flujo real de login y registro consumiendo el backend.

