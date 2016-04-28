var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/VehicleReservationSystem');
var db = mongoose.connection;

//Car schema
var CarSchema = mongoose.Schema({
    "car_name": {
        type: String
    },
    "long": {
        type: Number
    },
    "lat": {
        type: Number
    },
    "is_pink": {
        type: Boolean
    },
    "is_available": {
        type: Boolean
    }
}, { collection: 'active_cars' });

var Car = module.exports = mongoose.model('Car', CarSchema);

module.exports.createCar = function(newCar, callback) {
    console.log(newCar);
    newCar.save(callback);
}

module.exports.listAllCars = function(callback) {
    var query = {}
    Car.find(query, callback);
}

module.exports.listAvailableCars = function(callback) {
    var query = {"is_available":true}
    Car.find(query, callback);
}

/*
module.exports.checkUser = function(email, callback) {
    console.log(email);
    var query = {"Email": email};
    User.findOne(query, callback);
}

module.exports.fetchUserByUsername = function(username, callback) {
    console.log(username);
    var query = {"username": username};
    //User.findOne(query, callback);
    User.findOne(query, function(err, docs){
        if (docs.length){
            callback(true, null);
        } else {
            callback();
        }
    });
}

// Facebook login && register
module.exports.findFbUser = function(profile, callback) {
    console.log(profile);
    var query = {"facebook.id": profile.id};
    User.findOne(query, callback);
}

module.exports.addFbUser = function(newUser, callback) {
    // var newUser = {"facebook.id": profile.id};
    console.log(newUser);
    newUser.save(callback);
}

module.exports.getById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.checkPassword = function(password, passwordInput, callback) {
    console.log(password);
    bcrypt.compare(password, passwordInput, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch)
    });
}

module.exports.addItemToUser = function(userId, itemId, callback) {
    console.log("Model User user id: " + userId);
    console.log("Model User item id: " + itemId);
    User.update({_id: userId}, {$push: { items: itemId } }, callback);
}
*/
//module.exports = db;
