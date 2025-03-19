const { addEvent, getEvents, resetEvents } = require('./events');       // imports the functions from events.js

// Before the test is run, the previous events are deleted
beforeEach(() => {
    resetEvents();
});

// This checks whether the event has been added correctly
test('addEvent should add a new event', () => {
    const e1 = { id: 1, name: 'Ali Birthday', category: 'Home' };        // creates a new event
    addEvent(e1);        // adds the event using the function
    const events = getEvents();     // ggets all the events and stores tem in the array
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(e1);       // if the events array as length 1 then it matches our event
});


// 
test('getEvents should return all events', () => {      // tests whether the getEvents function returns all the events
    const e1 = { id: 1, name: 'Ali Birthday', category: 'Home' };
    const e2 = { id: 2, name: 'Scrum Meeting', category: 'Work' }; // creates two events
    addEvent(e1);
    addEvent(e2);       // adds the events to the array

    const events = getEvents();     // gets all the events and stores them in the array
    expect(events).toHaveLength(2);     // checks if the array has length 2
    expect(events).toContainEqual(e1);
    expect(events).toContainEqual(e2);      // checks if events contains both events
});