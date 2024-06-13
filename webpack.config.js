const path = require('path')

module.exports = {
    mode: 'development',
    entry: './js/firebase.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js',
        library: {
            type: 'module'
        },
        environment: {
            // The environment supports arrow functions ('() => { ... }').
            arrowFunction: true,
            // The environment supports BigInt as literal (123n).
            bigIntLiteral: true,
            // The environment supports const and let for variable declarations.
            const: true,
            // The environment supports destructuring ('{ a, b } = obj').
            destructuring: true,
            // The environment supports an async import() function to import EcmaScript modules.
            dynamicImport: true,
            // The environment supports 'for of' iteration ('for (const x of array) { ... }').
            forOf: true,
            // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
            module: true
        }
    },
    experiments: {
      outputModule: true
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          },
          type: 'javascript/auto'
        }
      ]
    }
  };
  