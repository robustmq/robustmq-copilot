import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';

export default defineConfig({
  html: {
    title: 'RobustMQ Admin',
    favicon: path.resolve(__dirname, './public/images/favicon.png'),
    meta: {
      'theme-color': '#fff',
      title: 'RobustMQ Admin',
      description: 'RobustMQ Admin',
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
    },
  },
});
