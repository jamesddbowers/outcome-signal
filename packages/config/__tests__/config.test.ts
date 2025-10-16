import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'jsonc-parser';

describe('Configuration Validation', () => {
  const rootDir = join(__dirname, '../../..');

  const parseJsonc = (filePath: string): unknown => {
    return parse(readFileSync(filePath, 'utf-8'));
  };

  describe('TypeScript Configuration', () => {
    it('should have a valid root tsconfig.json', () => {
      const tsconfigPath = join(rootDir, 'tsconfig.json');
      expect(existsSync(tsconfigPath)).toBe(true);

      const tsconfig = parseJsonc(tsconfigPath) as {
        compilerOptions: Record<string, unknown>;
      };
      expect(tsconfig.compilerOptions).toBeDefined();
    });

    it('should enforce strict mode in root tsconfig', () => {
      const tsconfigPath = join(rootDir, 'tsconfig.json');
      const tsconfig = parseJsonc(tsconfigPath) as {
        compilerOptions: {
          strict: boolean;
          noUnusedLocals: boolean;
          noUnusedParameters: boolean;
          noImplicitReturns: boolean;
          noFallthroughCasesInSwitch: boolean;
        };
      };

      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
      expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
      expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true);
      expect(tsconfig.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
    });

    it('should have path aliases configured', () => {
      const tsconfigPath = join(rootDir, 'tsconfig.json');
      const tsconfig = parseJsonc(tsconfigPath) as {
        compilerOptions: {
          baseUrl: string;
          paths: Record<string, string[]>;
        };
      };

      expect(tsconfig.compilerOptions.baseUrl).toBe('.');
      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./*']);
    });

    it('should extend root tsconfig in web package', () => {
      const webTsconfigPath = join(rootDir, 'apps/web/tsconfig.json');
      expect(existsSync(webTsconfigPath)).toBe(true);

      const webTsconfig = parseJsonc(webTsconfigPath) as { extends: string };
      expect(webTsconfig.extends).toBe('../../tsconfig.json');
    });

    it('should extend root tsconfig in ui package', () => {
      const uiTsconfigPath = join(rootDir, 'packages/ui/tsconfig.json');
      expect(existsSync(uiTsconfigPath)).toBe(true);

      const uiTsconfig = parseJsonc(uiTsconfigPath) as { extends: string };
      expect(uiTsconfig.extends).toBe('../../tsconfig.json');
    });

    it('should extend root tsconfig in types package', () => {
      const typesTsconfigPath = join(rootDir, 'packages/types/tsconfig.json');
      expect(existsSync(typesTsconfigPath)).toBe(true);

      const typesTsconfig = parseJsonc(typesTsconfigPath) as {
        extends: string;
      };
      expect(typesTsconfig.extends).toBe('../../tsconfig.json');
    });
  });

  describe('ESLint Configuration', () => {
    it('should have ESLint config package', () => {
      const eslintConfigPath = join(
        rootDir,
        'packages/config/eslint/index.js'
      );
      expect(existsSync(eslintConfigPath)).toBe(true);
    });

    it('should load ESLint config without errors', () => {
      const eslintConfigPath = join(
        rootDir,
        'packages/config/eslint/index.js'
      );
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const eslintConfig = require(eslintConfigPath);

      expect(eslintConfig).toBeDefined();
      expect(eslintConfig.extends).toBeDefined();
      expect(Array.isArray(eslintConfig.extends)).toBe(true);
    });

    it('should enforce TypeScript strict rules in ESLint', () => {
      const eslintConfigPath = join(
        rootDir,
        'packages/config/eslint/index.js'
      );
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const eslintConfig = require(eslintConfigPath);

      expect(eslintConfig.rules['@typescript-eslint/no-explicit-any']).toBe(
        'error'
      );
      expect(
        eslintConfig.rules['@typescript-eslint/explicit-function-return-type']
      ).toBeDefined();
    });

    it('should have ESLint config in web package', () => {
      const webEslintPath = join(rootDir, 'apps/web/.eslintrc.js');
      expect(existsSync(webEslintPath)).toBe(true);
    });

    it('should have ESLint config in ui package', () => {
      const uiEslintPath = join(rootDir, 'packages/ui/.eslintrc.js');
      expect(existsSync(uiEslintPath)).toBe(true);
    });
  });

  describe('Prettier Configuration', () => {
    it('should have Prettier config package', () => {
      const prettierConfigPath = join(
        rootDir,
        'packages/config/prettier/index.js'
      );
      expect(existsSync(prettierConfigPath)).toBe(true);
    });

    it('should load Prettier config without errors', () => {
      const prettierConfigPath = join(
        rootDir,
        'packages/config/prettier/index.js'
      );
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const prettierConfig = require(prettierConfigPath);

      expect(prettierConfig).toBeDefined();
      expect(prettierConfig.semi).toBe(true);
      expect(prettierConfig.singleQuote).toBe(true);
    });

    it('should have consistent formatting rules', () => {
      const prettierConfigPath = join(
        rootDir,
        'packages/config/prettier/index.js'
      );
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const prettierConfig = require(prettierConfigPath);

      expect(prettierConfig.printWidth).toBe(80);
      expect(prettierConfig.tabWidth).toBe(2);
      expect(prettierConfig.useTabs).toBe(false);
    });
  });

  describe('Workspace Package Linking', () => {
    it('should have valid pnpm-workspace.yaml', () => {
      const workspacePath = join(rootDir, 'pnpm-workspace.yaml');
      expect(existsSync(workspacePath)).toBe(true);
    });

    it('should have root package.json with workspaces', () => {
      const packageJsonPath = join(rootDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson.workspaces).toBeDefined();
      expect(packageJson.workspaces).toContain('apps/*');
      expect(packageJson.workspaces).toContain('packages/*');
    });

    it('should reference workspace packages correctly in web app', () => {
      const webPackagePath = join(rootDir, 'apps/web/package.json');
      const webPackage = JSON.parse(readFileSync(webPackagePath, 'utf-8'));

      expect(webPackage.devDependencies['@outcome-signal/ui']).toBe(
        'workspace:*'
      );
      expect(webPackage.devDependencies['@outcome-signal/types']).toBe(
        'workspace:*'
      );
      expect(webPackage.devDependencies['@outcome-signal/eslint-config']).toBe(
        'workspace:*'
      );
    });

    it('should have turbo.json with pipeline configuration', () => {
      const turboPath = join(rootDir, 'turbo.json');
      expect(existsSync(turboPath)).toBe(true);

      const turboConfig = JSON.parse(readFileSync(turboPath, 'utf-8'));
      expect(turboConfig.tasks).toBeDefined();
      expect(turboConfig.tasks.dev).toBeDefined();
      expect(turboConfig.tasks.build).toBeDefined();
      expect(turboConfig.tasks.lint).toBeDefined();
      expect(turboConfig.tasks.test).toBeDefined();
    });
  });
});
