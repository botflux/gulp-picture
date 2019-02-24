const regex = require('./regex')
const img = '<img src="fake.jpg" data-lazy     =   "ezfzefze" alt="A fake image">'

const lazyRegex = regex.makeLazyRegex('data-lazy')

console.log(
    img.match(lazyRegex),
    lazyRegex
)