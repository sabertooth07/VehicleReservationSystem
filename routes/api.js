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
    Car.listAvailableCars(function(err, cars) {
        console.log(cars);
        if (err) res.json(400, err);
        res.json(200, {"Available cars": cars});
    });      
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

        Car.checkCar(carName, function(err, document){
            console.log(document);
            if (document) {
                console.log("Car name not available");
                res.json(200, {"message": "Car name already taken, use a different name"});
            } else {

                    Car.createCar(newCar, function(err, car){
                    if (err) res.json(400, err);
                    console.log(car);
                    res.json(200, {"message": "New vehile added"});
               });
            }

        });
    }
});

router.post('/bookCar', function(req, res, next){
    
    req.checkBody('long', 'your longitude position is required').notEmpty().isInt().withMessage("Need an integer");
    req.checkBody('lat', 'your latitude is required').notEmpty().isInt().withMessage("Need an integer");
    req.checkBody('pink', 'Would you like a pink car?').notEmpty().isBoolean().withMessage("Need a boolean value");

    var errors = req.validationErrors();
    if (errors) {
        res.json(400, errors);
    } else {
        var long=req.body.long;
        var lat=req.body.lat;
        var isPink=req.body.pink;

        console.log("before query");
        if (!isPink) {
            Car.listAvailableCars(function(err, cars) {
                var closestDist=undefined;
                var closestCar=null;
                for (i=0; i<cars.length; i++) {
                    var carLong=cars[i].long;
                    var carLat=cars[i].lat;

                    dist = Math.sqrt(Math.pow((carLong - long),2) + Math.pow((carLat - lat),2));
                    if (closestDist == undefined) {
                         closestDist = dist;
                         closestCar = cars[i];
                    } else if (dist < closestDist) {
                         closestDist = dist;
                         closestCar = cars[i];
                    }
                }
                if (err) res.json(400, err);
                if (closestCar) {
                    Car.bookCar(closestCar._id, long, lat, function(err, raw){
                        if (err) res.json(400, err);
                        else {
                            // console.log(raw);
                            console.log("Car booked:" + closestCar);
                            res.json(200, {msg: "Your pink car is booked " + closestCar.car_name});
                        }
                    });
                } else {
                    res.json(200, {msg: "Sorry we're out of cars"});
                    console.log("No cars available");
                }
            });
        } else {
            Car.listAvailablePinkCars(function(err, cars) {
                var closestDist=undefined;
                var closestCar=null;
                for (i=0; i<cars.length; i++) {
                    var carLong=cars[i].long;
                    var carLat=cars[i].lat;

                    dist = Math.sqrt(Math.pow((carLong - long),2) + Math.pow((carLat - lat),2));
                    if (closestDist == undefined) {
                         closestDist = dist;
                         closestCar = cars[i];
                    } else if (dist < closestDist) {
                         closestDist = dist;
                         closestCar = cars[i];
                    }
                }
                if (err) res.json(400, err);
                if (closestCar) {
                    Car.bookCar(closestCar._id, long, lat, function(err, raw){
                        if (err) res.json(400, err);
                        else {
                            // console.log(raw);
                            console.log("Car booked:" + closestCar);
                            res.json(200, {msg: "Your pink car is booked " + closestCar.car_name});
                        }
                    });
                } else {
                    res.json(200, {msg: "Sorry we're out of cars"});
                    console.log("No cars available");
                }
            });
        }
    }
});

router.post('/fetchRideCost', function(req, res, next){
    req.checkBody('time', 'Enter time in minutes').notEmpty().isInt().withMessage("Need an integer");
    req.checkBody('dist', 'your latitude is required').notEmpty().isInt().withMessage("Need an integer");
    req.checkBody('pink', 'Would you like a pink car?').notEmpty().isBoolean().withMessage("Need a boolean value");

});

module.exports = router;
