// @ts-check
import { configs } from '@eslint/js';
import { config, configs as _configs } from 'typescript-eslint';
import { configs as __configs, processInlineTemplates } from 'angular-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default config(
  {
    files: ['**/*.ts'],
    extends: [
      configs.recommended,
      ..._configs.recommended,
      ..._configs.stylistic,
      ...__configs.tsRecommended,
      {
        plugins: {
          'simple-import-sort': simpleImportSort,
        },
        rules: {
          'simple-import-sort/imports': [
            'error',
            {
              groups: [['^\\u0000'], ['^@?(?!baf)\\w'], ['^@baf?\\w'], ['^\\w'], ['^[^.]'], ['^\\.']],
            },
          ],
          'simple-import-sort/exports': 'error',
        },
      },
    ],
    processor: processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'baf',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'baf',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          filter: {
            regex: '^(ts-jest|\\^.*)$',
            match: false,
          },
        },
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        {
          selector: 'property',
          format: null,
          filter: {
            regex: '^(host)$',
            match: false,
          },
        },
      ],
      complexity: 'error',
      'max-len': [
        'error',
        {
          code: 140,
        },
      ],
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-invalid-this': 'off',
      '@typescript-eslint/no-invalid-this': ['warn'],
      '@angular-eslint/no-host-metadata-property': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...__configs.templateRecommended, ...__configs.templateAccessibility],
    rules: {},
  },
)