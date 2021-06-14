const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const app = express();
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.f7d25.mongodb.net/sample_airbnb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

// Function to return fail response
function failError(res){
	res.status(200).json({
		status: "Fail",
		message: "Something went wrong!!"
	});
}

// Function to return success response
// Returns top 10 results that were return by mongodb
function successResponse(documents, cursor, res) {
	var data = [];
	let i = 0;
	while(documents !== null && i<10){
		documents.then(function(result) {
			if(result !== null)
				data.push(result);
		});
		i++;
		documents = cursor.hasNext() ? cursor.next() : null;
	}
	
	documents.then(function(result) {
		res.status(200).json({
			status: "Success",
			data: data
		});
	});
}


// find restaurant by name
app.get('/byname', (req, res, next) => {

	var params = req.body;
	client.connect( err => {
		
	  	const collection = client.db("sample_restaurants").collection("restaurants");
	  	const cursor = collection.find({
	  										"name": params.name
	  									}, 
	  									{ projection: {
	  														_id:0,
	  														name:1, 
	  														"address.building":1, 
	  														"address.street":1, 
	  														borough:1, 
	  														cuisine:1
	  													} 
										}
									);

		var documents = cursor.hasNext() ? cursor.next() : null;

		if(documents){
			successResponse(documents, cursor, res);
		}else{
			failError(res);
		}
	});
	
})

// find restaurant by cuisine
app.get('/bycuisine', (req, res, next) => {

	var params = req.body;

	client.connect( err => {

	  	const collection = client.db("sample_restaurants").collection("restaurants");
	  	const cursor = collection.find({
	  										"cuisine": params.cuisine
	  									}, 
	  									{ projection: {
	  														_id:0,
	  														name:1, 
	  														"address.building":1, 
	  														"address.street":1, 
	  														borough:1, 
	  														cuisine:1
	  													} 
										}
									);
	  	
		var documents = cursor.hasNext() ? cursor.next() : null;

		if(documents){
			successResponse(documents, cursor, res);
		}else{
			failError(res);
		}
	});
	
})

// find restaurant by borough
app.get('/byborough', (req, res, next) => {

	var params = req.body;

	client.connect( err => {

	  	const collection = client.db("sample_restaurants").collection("restaurants");
	  	const cursor = collection.find({
	  										"borough": params.borough
	  									}, 
	  									{ projection: {
	  														_id:0,
	  														name:1, 
	  														"address.building":1, 
	  														"address.street":1, 
	  														borough:1, 
	  														cuisine:1
	  													} 
										}
									);
	  	
		var documents = cursor.hasNext() ? cursor.next() : null;

		if(documents){
			successResponse(documents, cursor, res);
		}else{
			failError(res);
		}
	});
	
})

// find restaurant by street
app.get('/bystreet', (req, res, next) => {
	
	var params = req.body;

	client.connect(err => {

	  	const collection = client.db("sample_restaurants").collection("restaurants");
	  	const cursor = collection.find({ 
	  										"address.street": params.street 
	  									}, 
	  									{ 
	  										projection: {
	  														_id:0,
	  														name:1, 
	  														"address.building":1, 
	  														"address.street":1, 
	  														borough:1, 
	  														cuisine:1
	  													} 
										}
									);
		var documents = cursor.hasNext() ? cursor.next() : null;

		if(documents){
			successResponse(documents, cursor, res);
		}else{
			failError(res);
		}

	});	
})

// find restaurant by grades
app.get('/bygrades', (req, res, next) => {
	
	var params = req.body;

	client.connect(err => {

	  	const collection = client.db("sample_restaurants").collection("restaurants");
	  	const cursor = collection.find({ 
	  										"grades": {
	  											$elemMatch: {
	  												"score": {
	  													$gte: params.grade
	  												}
	  											}
	  										} 
	  									}, 
	  									{ 
	  										projection: {
	  														_id:0,
	  														name:1, 
	  														"address.building":1, 
	  														"address.street":1, 
	  														borough:1, 
	  														cuisine:1,
	  														grades:1
	  													} 
										}
									);
		var documents = cursor.hasNext() ? cursor.next() : null;

		if(documents){
			successResponse(documents, cursor, res);
		}else{
			failError(res);
		}

	});	
})

// find restaurant by location
app.get('/bylocation', (req, res, next) => {
	
	var params = req.body;

	client.connect(err => {

	  	const neighborhoods = client.db("sample_restaurants").collection("neighborhoods");
	  	const restaurants = client.db("sample_restaurants").collection("restaurants");


	  	const neighborhoods_cursor = neighborhoods.findOne({ 
	  										geometry: { 
	  													$geoIntersects: { 
  																		$geometry: { 
																					type: "Point", 
																					coordinates: [ 
																									params.coordinates[0],
																									params.coordinates[1]
																								] 
  																					} 
																		} 
														} 
										})



		neighborhoods_cursor.then(function(result) {

			if(result === null){
				failError(res);
				return;
			}
			const cursor = restaurants.find( 
											{ location: { $geoWithin: { $geometry: result.geometry } } }, 
											{
												projection: {
	  														_id:0,
	  														name:1, 
	  														"address.building":1, 
	  														"address.street":1, 
	  														borough:1, 
	  														cuisine:1,
	  													} 
											}
											);
			var documents = cursor.hasNext() ? cursor.next() : null;


			if(documents){
				successResponse(documents, cursor, res);
			}else{
				failError(res);
			}			
		});
	});	
})


app.use((req, res, next) => {
	res.json({
		status: 400,
		message: {
			error: "Bad Request"
		}
	})
})

module.exports = app;