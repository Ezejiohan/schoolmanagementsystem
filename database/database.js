const mongoose = require( 'mongoose');

mongoose.connect('mongodb+srv://Ezejiohan:Passenger24@cluster0.yqqou7r.mongodb.net/Jasmine_College').then(() => {
    console.log('connected to MongoDB successful')
}).catch((err) => {
    console.log(err.message)
})