var express = require('express');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var router = express.Router();

var Car = require('../models/car');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to our api!' });
});

router.get('/getAllCars', function(req, res, next){
    Car.listAllCars(function(err, cars) {
        console.log(cars);
        if (err) res.json(err);
        res.json(200, {"Available cars": cars});
    });      
});

router.get('/getAvailableCars', function(req, res, next){

    var schema = {
        'long': {
            in: 'query',
            notEmpty: true,
        },
        'lat': {
            in: 'query',
            notEmpty: true,
            errorMessage: 'A lat param is required'
        }
    };


    console.log(req.param('long'));
    console.log(req.param('lat'));
    var errors = req.checkParams(schema);

    //var errors = req.validationErrors();
    if (errors) {
        res.json(400, errors);
    } else {
        var long=req.body.long;
        var lat=req.body.lat;

        console.log("before query")
        Car.listAvailableCars(function(err, cars) {
            console.log(cars);
            if (err) res.json(err);
            res.json(200, {"Available cars": cars});
        });      
    }
});

router.post('/addCar', function(req, res, next){

    req.checkBody('Name', 'A car needs a name').notEmpty().isAlpha().withMessage("Need a string for a car's name");
    req.checkBody('long', 'longitude of your car is required').notEmpty().isInt().withMessage("Need an integer");
    req.checkBody('lat', 'latitude of our car is required').notEmpty().isInt().withMessage("Need an integer");
    req.checkBody('pink', 'Pink cars are special, we would like to know if your\'s one..').notEmpty().isBoolean().withMessage("Need a boolean value");
 
    var errors = req.validationErrors();
    if (errors) {
        res.json(400, errors);
    } else {
        var carName=req.body.Name;
        var long=req.body.long;
        var lat=req.body.lat;
        var isPink=req.body.pink;

        // Create car
        var newCar = new Car({
            'car_name': carName,
            'long': long,
            'lat': lat,
            'is_pink': isPink,
            'is_available': true
        });

         Car.createCar(newCar, function(err, car){
            if (err) throw err;
            console.log(car);
         });

        console.log(carName);
        console.log("hi");
        res.json(200, {"message": "New vehile added"});
    }
});

router.post('/bookCar', function(req, res, next){

});

router.post('/fetchRideCost', function(req, res, next){

});

module.exports = router;
