# MongoDB Practice Project 
### Its Live on heroku
I used Nodejs to implement the api.<br/>
app.js file contains all the necessary routes.<br/><br/>
Send Get requests to the routes with appropriate JSON data and get the response back as JSON.
## Test data
<https://mongodb-project1.herokuapp.com/bylocation></br>
This returns the **top 10 restaurants in the neighborhood!!!**</br>
These coordinates are the user's coordinates that we would get from his/her phone.
```javascript
1. { "coordinates": [ -73.94834517370118, 40.61413649663159 ] }
2. { "coordinates": [ -73.98080506235094,40.614447129775364 ] }
```
---
<https://mongodb-project1.herokuapp.com/byname></br>
Filter restaurants by name.
```javascript
1. { "name":"Riviera Caterer" }
2. { "name":"Wilken'S Fine Food" }
```
---
<https://mongodb-project1.herokuapp.com/bycuisine></br>
Filter restaurants by cuisine.
```javascript
1. { "cuisine":"Jewish/Kosher" }
2. { "cuisine":"Hamburgers" }
```
---
<https://mongodb-project1.herokuapp.com/byborough></br>
Filter restaurants by borough.
```javascript
1. { "borough":"Bronx" }
2. { "borough":"Queens" }
```
---
<https://mongodb-project1.herokuapp.com/bystreet></br>
Filter restaurants by street.
```javascript
1. { "street":"Astoria Boulevard" }
2. { "street":"11 Avenue" }
```
---
https://mongodb-project1.herokuapp.com/bygrades</br>
Filter restaurants that have a grade greater than or equal to some number.
```javascript
1. { "grade":5 }
2. { "grade":10 }
```
