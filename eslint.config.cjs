const path = require('path');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**'], // Ignorar la carpeta dist
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'), // Asegúrate de apuntar a tu tsconfig.json
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // Importamos el plugin completo de TypeScript
      prettier: prettierPlugin, // Prettier como plugin
    },
    rules: {
      // Reglas básicas recomendadas por ESLint
      'no-console': 'warn',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

      // Reglas de @typescript-eslint
      'no-unused-vars': 'off', // Desactivar la regla de ESLint estándar
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ], // Usar la regla de @typescript-eslint

      // Integración con Prettier
      'prettier/prettier': 'error', // Reglas de Prettier como error
      ...prettierConfig.rules, // Desactiva las reglas que interfieren con Prettier
    },
  },
];
