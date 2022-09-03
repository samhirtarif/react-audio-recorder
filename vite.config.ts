import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
// import libCss from 'vite-plugin-libcss';
import dts from 'vite-plugin-dts';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'AudioRecorder',
      fileName: (format) => `react-audio-voice-recorder.${format}.js`
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
