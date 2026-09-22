# React + Vite

## Traduccion LSC en tiempo real

La pantalla `/translate` usa la camara del navegador y se conecta al servicio Python del repositorio `OneLanguage-AI`. No procesa TensorFlow en el navegador ni almacena los frames de la camara.

1. Inicia `OneLanguage-AI` con `python web_service.py`.
2. Copia `.env.example` a `.env` y verifica `VITE_AI_WS_URL`.
3. Ejecuta `npm run dev` dentro de `web/`.
4. Abre `/translate` e inicia la camara.

El frontend no contiene una lista fija de senas: recibe las etiquetas activas desde el modelo. Para publicar nuevas senas se reemplaza el paquete compatible dentro de `OneLanguage-AI/model/` y se reinicia el servicio de IA.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
