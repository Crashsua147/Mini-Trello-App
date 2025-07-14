import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),

  ],
  // define: {
  //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  // },
  resolve: {
    alias: [
      {find: '~', replacement: '/src'}
    ]
  }
})
