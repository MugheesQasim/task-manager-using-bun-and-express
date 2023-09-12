const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
let currentCount = 0;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import { Database } from "bun:sqlite";

// all of these do the same thing
const db = new Database(":memory:");

const tableCreateQuery = db.query("create table tasks(id INTEGER PRIMARY KEY, description TEXT)");
tableCreateQuery.run();

// Define a route to handle the POST request
app.post('/addtask', (req, res) => {
    currentCount++;
    const text = req.body.text; // Get the text from the request body
    const insertQuery = db.query(`
  INSERT INTO tasks (id, description)
  VALUES (?, ?)
`);
    insertQuery.run(currentCount, text);
    res.json({ message: `Task added: "${text}"` });
});

//get request to get the list of tasks in the in memory database
app.get('/get', (req, res) => {
    const getQuery = db.query("SELECT description from tasks");
    const response = getQuery.all();
    res.send(response);
})

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
