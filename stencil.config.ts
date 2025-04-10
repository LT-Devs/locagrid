import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';
import { svelteOutputTarget } from '@revolist/svelte-output-target';
import { vueOutputTarget as vue2OutputTarget } from '@revolist/stencil-vue2-output-target';
import { eventListOutputTarget } from './scripts/event-list.plugin';

const componentCorePackage = '@revolist/revogrid';
const parent = './packages';
const entry = 'revogrid.ts';

const excludeComponents = [
  'revogr-clipboard',
  'revogr-data',
  'revogr-edit',
  'revogr-focus',
  'revogr-header',
  'revogr-order-editor',
  'revogr-overlay-selection',
  'revogr-row-headers',
  'revogr-scroll-virtual',
  'revogr-temp-range',
  'revogr-viewport-scroll',
];

const directivesProxyFile = (name: string, filepath = entry) =>
  `${parent}/${name}/lib/${filepath}`;

const angularPath = (name: string, filepath = entry) =>
  `${parent}/angular/projects/${name}/src/lib/${filepath}`;

const customElementsDir = 'standalone';

export const config: Config = {
  // https://github.com/ionic-team/stencil/blob/master/src/declarations/stencil-public-compiler.ts
  enableCache: true,
  hashFileNames: false,
  autoprefixCss: false,
  minifyCss: true,
  minifyJs: true,
  preamble: 'Built by Revolist OU ❤️',
  hashedFileNameLength: 8,
  invisiblePrehydration: false,
  extras: {
    // This is to tackle an Angular specific performance issue:
    initializeNextTick: true,
    // Don’t need any of these so setting them to “false”:
    scriptDataOpts: false,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: false,
    // Required by Vite to bundle a Stencil project (https://github.com/vitejs/vite/issues/12434#issuecomment-1471305880)
    enableImportInjection: true,
  },

  namespace: 'revo-grid',
  taskQueue: 'async',
  globalScript: './src/global/global.ts',
  validatePrimaryPackageOutputTarget: true,
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/global/_colors.scss',
        'src/global/_colors.dark.scss',
        'src/global/_icons.scss',
        'src/global/_mixins.scss',
        'src/global/_buttons.scss',
      ],
    }),
  ],
  // proxies
  outputTargets: [
    // #region Vue
    vue2OutputTarget({
      componentCorePackage,
      proxiesFile: directivesProxyFile('vue2'),
      excludeComponents,
    }),
    vueOutputTarget({
      componentCorePackage,
      proxiesFile: directivesProxyFile('vue3'),
      excludeComponents,
      includePolyfills: true,
    }),
    // #endregion

    // #region Angular
    angularOutputTarget({
      componentCorePackage,
      outputType: 'standalone',
      customElementsDir: customElementsDir,
      directivesProxyFile: angularPath('angular-datagrid', `components.ts`),
      directivesArrayFile: angularPath('angular-datagrid', entry),
      excludeComponents,
    }),
    // #endregion

    // #region React
    reactOutputTarget({
      componentCorePackage,
      proxiesFile: directivesProxyFile('react'),
      excludeComponents,
    }),
    // #endregion

    // #region Svelte
    svelteOutputTarget({
      componentCorePackage,
      proxiesFile: directivesProxyFile('svelte'),
      includeDefineCustomElements: true,
      legacy: false,
      excludeComponents,
    }),
    // #endregion

    // custom element, no polifil
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
      minify: true,
      dir: customElementsDir,
      generateTypeDeclarations: true,
      empty: true,
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      empty: true,
      isPrimaryPackageOutputTarget: true,
    },
    {
      type: 'docs-readme',
      dir: './docs/guide/api',
      footer: '*Built with ❤️ by Revolist OU*',
    },
    eventListOutputTarget({
      mdPath: './docs/guide/api/events.md',
      tsPath: './src/types/events.ts',
      footer: '*Built with ❤️ by Revolist OU*',
    }),
    {
      type: 'docs-vscode',
      file: 'vscode-data.json',
    },
    {
      type: 'dist-hydrate-script',
    },
    {
      type: 'www',
      copy: [
        { src: 'serve', dest: '.' },
        { src: '../node_modules/bootstrap/dist', dest: './bootstrap' },
      ],
      serviceWorker: null, // disable service workers
    },
  ],
  nodeResolve: {
    preferBuiltins: true,
  },
};
