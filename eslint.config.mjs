import nextConfig from 'eslint-config-next'
import tsConfig from 'eslint-config-next/typescript'

export default [
  ...nextConfig,
  ...tsConfig,
  {
    rules: {
      // These patterns are used intentionally throughout the codebase
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
]
