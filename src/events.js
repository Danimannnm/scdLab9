const fs = require('fs');       // to read and write files
const path = require('path');       // to work with file paths

const eventsFilePath = path.join(__dirname, '../data/events.json');     // tis is the path to the events.json file witch stores all the events

// Read events from the JSON file
const getEvents = () => {
    const data = fs.readFileSync(eventsFilePath, 'utf8');
    return JSON.parse(data);
};

// Add a new event to the list
const addEvent = (event) => {
    const events = getEvents();     // get all the events
    events.push(event);     // this will add a new event to te array
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2)); // write the new array to the file as a strin
};

// This function resets the events list for testing purposes
const resetEvents = () => {
    fs.writeFileSync(eventsFilePath, JSON.stringify([], null, 2));
};

// Exports the functions
module.exports = {
    getEvents,
    addEvent,
    resetEvents,
};