module.exports = {
  purge: [
    'app/**/*.jsx',
    'app/**/*.js',
    'app/**/*.html'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
         'timetrackerList': 'minmax(200px, 4fr) 30px minmax(100px, 1fr)'
      },
      maxWidth: {
        'select': '180px'
      }
    }
  }
}
