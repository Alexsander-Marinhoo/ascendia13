import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        imoveis: resolve(__dirname, 'imoveis.html'),
        contato: resolve(__dirname, 'contato.html'),
        sobre_nos: resolve(__dirname, 'sobre-nos.html'),
        sobre_imovel: resolve(__dirname, 'sobre-imovel.html'),
        "404": resolve(__dirname, '404.html')
      }
    }
  }
});
