var Product = require('../models/Product');
var mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true, useUnifiedTopology: true});




var products =[
     new Product({
     imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
     title: 'Gothic',
     description: 'Awesome game!!',
     price: 20
     }),

    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic2',
        description: 'Awesome game!!',
        price: 29
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic3',
        description: 'Awesome game!!',
        price: 25
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic4',
        description: 'Awesome game!!',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic9',
        description: 'Awesome game!!',
        price: 30
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic8',
        description: 'Awesome game!!',
        price: 30
    })
];
var done =0;

for(var i =0; i<products.length; i++){
    products[i].markModified('imagePath');

    products[i].save(function (err, result) {
        console.log("I");
        done++;
        if(done===products.length){
            exit();
        }
    });


}
function exit() {
    mongoose.disconnect();
}
