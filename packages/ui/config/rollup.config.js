
/* eslint-disable no-undef */

import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import rollupCopy from 'rollup-plugin-copy';
// import { eslint } from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import vuePlugin from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import packages from '../package.json';
const resolveFile = (dir) => path.resolve(__dirname, '../' + dir);
const externalPackages = ['vue', '@tarojs/components', '@tarojs/runtime', '@tarojs/taro'];
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const ENV = process.env.NODE_ENV;

export default {
   input: resolveFile(packages.source),
   output: [
    {
      file: resolveFile('dist/index.js'),
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: resolveFile('dist/index.esm.js'),
      format: 'es',
      sourcemap: true,
    },
    {
      file: resolveFile('dist/index.umd.js'),
      format: 'umd',
      name: 'vue-taro-ui',
      sourcemap: true,
      globals: {
       'vue': 'Vue',
       '@tarojs/components': 'components',
       '@tarojs/taro': 'Taro'
      }
     }
    ],
    external: externalPackages,
    plugins: [
      vuePlugin(),
      resolve(),
      commonjs(),
      json(),
     babel({
       extensions,
       exclude: 'node_modules/**',
       runtimeHelpers: true,
      "presets": [[
        '@vue/babel-preset-jsx',
        {
          injectH: false,
        },
       ],["taro", {
         framework: 'vue'
       }]],
       "plugins": ["@babel/plugin-transform-runtime"]
      }),
      replace({
          exclude: 'node_modules/**',
          ENV: JSON.stringify(process.env.NODE_ENV),
      }),
     (ENV === 'production' && terser()),
     rollupCopy({
       targets: [
        {
         src: '../src/style',
         dest: '../dist/'
        }
       ]
      })
    ],
};