import { createConfig } from '@nx/angular-rspack';
import { readFileSync } from 'fs';
import { join } from 'path';

interface ProxyEntry {
  target: string;
  secure: boolean;
  changeOrigin: boolean;
  logLevel?: string;
}

type ProxyConfig = Record<string, ProxyEntry>;

const proxyConfigPath: string = join(__dirname, 'proxy.conf.json');
const proxyConfig: ProxyConfig = JSON.parse(readFileSync(proxyConfigPath, 'utf-8')) as ProxyConfig;

const proxySettings: { context: string[]; target: string; secure: boolean; changeOrigin: boolean }[] =
  Object.entries(proxyConfig).map(([context, config]: [string, ProxyEntry]) => ({
    context: [context],
    target: config.target,
    secure: config.secure,
    changeOrigin: config.changeOrigin,
  }));

export default createConfig(
  {
    options: {
      root: __dirname,

      outputPath: {
        base: '../../dist/apps/web',
      },
      index: './src/index.html',
      browser: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      inlineStyleLanguage: 'scss',
      assets: [
        {
          glob: '**/*',
          input: './public',
        },
      ],
      styles: ['./src/styles.scss'],
      devServer: {},
    },
  },
  {
    production: {
      options: {
        budgets: [
          {
            type: 'initial',
            maximumWarning: '500kb',
            maximumError: '1mb',
          },
          {
            type: 'anyComponentStyle',
            maximumWarning: '4kb',
            maximumError: '8kb',
          },
        ],
        outputHashing: 'all',
        devServer: {},
      },
    },

    development: {
      options: {
        optimization: false,
        vendorChunk: true,
        extractLicenses: false,
        sourceMap: true,
        namedChunks: true,
        devServer: {
          "proxyConfig": 'proxy.conf.json'
        },
      },
    },
  },
);
