import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		dir: 'src',
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					dir: 'src/tests/unit',
				}
			},
			{
				extends: true,
				test: {
					name: 'e2e',
					dir: 'src/tests/e2e',
					environment: './prisma/vitest-environment/prisma-test-env.ts',

					fileParallelism: false,
					maxWorkers: 1,
				}
			},
		],
	}
})