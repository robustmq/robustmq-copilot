import path from 'path';
import fs from 'fs';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';

// 从配置文件读取配置
const appConfig = require('./config/app.js');

// Generate the runtime config.js content from current env/appConfig
const buildConfigJs = () =>
  `window.__APP_CONFIG__ = ${JSON.stringify({ port: appConfig.port, api: { port: appConfig.api.port, baseUrl: appConfig.api.baseUrl } }, null, 2)};\n`;

// Write public/config.js so production builds pick it up
fs.writeFileSync(path.resolve(__dirname, 'public/config.js'), buildConfigJs());

export default defineConfig({
  server: {
    port: appConfig.port,
    // Serve /config.js dynamically so env vars take effect without a file write race
    setupMiddlewares: [
      (middlewares) => {
        middlewares.unshift((req: any, res: any, next: any) => {
          if (req.url === '/config.js') {
            res.setHeader('Content-Type', 'application/javascript');
            res.end(buildConfigJs());
          } else {
            next();
          }
        });
      },
    ],
  },
  html: {
    title: 'RobustMQ: New generation of cloud-native and AI-native messaging infrastructure',
    favicon: path.resolve(__dirname, './public/images/favicon.png'),
    meta: {
      viewport: 'width=device-width, initial-scale=1',
    },
    tags: [
      {
        tag: 'link',
        attrs: {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOriginIsolated: true,
        },
      },
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&display=swap',
        },
      },
      {
        // config.js is loaded at runtime so ROBUSTMQ_API_URL can be injected
        // by the server without requiring a rebuild. The file is written by
        // robust-server on startup (see bin/robust-server) and falls back to
        // the copy in public/config.js when served statically.
        tag: 'script',
        attrs: {
          src: '/config.js',
        },
      },
    ],
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      '@pcpb': '@robustmq/grpc-web-services/protos/placement_center',
      '@jspb': '@robustmq/grpc-web-services/protos/journal_server',
      '@mbpb': '@robustmq/grpc-web-services/protos/broker_mqtt',
    },
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack()],
      module: {
        parser: {
          javascript: {
            exportsPresence: false,
          },
        },
      },
    },
  },
});
