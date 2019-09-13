const off = 0
const warn = 1
const error = 2

module.exports = {
  "parser": "@typescript-eslint/parser",
  "env": {
    "browser": true,
    "es6": true,
    "jest": true
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "node": {
        "paths": [
          "src"
        ],
        "extensions": [
          ".ts",
          ".tsx"
        ]
      }
    }
  },
  "plugins": [
    "react-hooks"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint"
  ],
  "rules": {
    "import/prefer-default-export": off,
    "react/display-name": off,
    "react/prop-types": off,
    "react/jsx-filename-extension": off,
    "@typescript-eslint/explicit-function-return-type": [
      off,
      {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true
      }
    ],
    "@typescript-eslint/camelcase": off,
    "@typescript-eslint/prefer-interface": off,
    "@typescript-eslint/no-explicit-any": off,
    "react-hooks/rules-of-hooks": error,
    "react-hooks/exhaustive-deps": warn,
    "import/no-unresolved": off,
    "jsx-a11y/anchor-is-valid": [
      error,
      {
        "components": [
          "Link"
        ],
        "specialLink": [
          "to"
        ]
      }
    ],
    "import/no-extraneous-dependencies": [
      error,
      {
        "devDependencies": true
      }
    ],
  }
}
