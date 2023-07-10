import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts';
import path from 'path'

const injectCodeFunction = (cssCode) => {
  try {
    if (typeof window === 'undefined') return;

    var elementStyle = document.createElement('style');
    elementStyle.appendChild(document.createTextNode(cssCode));
    document.head.appendChild(elementStyle);
  } catch (e) {
    console.error('vite-plugin-css-injected-by-js', e);
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin({ injectCodeFunction }),
    dts({
      insertTypesEntry: true,
    }),
    // {
    //   name: "configure-response-headers",
    //   configureServer: (server) => {
    //     server.middlewares.use((_req, res, next) => {
    //       res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    //       res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    //       next();
    //     });
    //   },
    // },
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'AudioRecorder',
      fileName: (format) => `react-audio-voice-recorder.${format}.js`,
      formats: ["es"]
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        }
      }
    },
  },
})
