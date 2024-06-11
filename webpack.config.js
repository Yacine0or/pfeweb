const path = require('path')

module.exports = {
    mode: 'development',
    entry: './js/firebase.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js'
    },
    watch: true
}
