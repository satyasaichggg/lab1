const express = require('express');
const app = express();
const users=require('./users.json')
// Make sure to parse JSON bodies (if you're expecting JSON)
app.use(express.json()); 

// Define GET route
app.get('/', (req, res) => {
    res.send('Express server');
});
app.get('/users', (req, res) => {
   res.json(users);
});
app.get('/users/:id', (req, res) => {
    const  user=users.find(user=> users.id=Number(req.params.id))
    console.log(user);
    // console.log(req.params.id);
 });





// Define POST route
app.post('/submit', (req, res) => {
    // For example, you can log the data received in the POST request
    console.log(req.body);
    res.send('POST request received');
});

// Start the server
app.listen(3000, () => {
    console.log('Server started at port 3000');
});
