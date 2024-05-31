const mongoose = require( 'mongoose');

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('connected to MongoDB successful')
}).catch((err) => {
    console.log(err.message)
})