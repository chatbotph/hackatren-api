const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    {
        requiredField,
        refGen,
        fieldTypes: {
            STR,
            DT,
            NUM
        }
    } = require('../utils/database');

const commuter = new Schema({
    name: {
        first_name: requiredField(STR),
        last_name: requiredField(STR)
    },
    fb_id: requiredField(STR),
    subscription: [{ /// Onboarding will ask to add regular station, usual riding time and notifs 
        station: requiredField(STR), //subscribed station
        riding_time: requiredField(STR), //HH/mm
        notification: requiredField(STR, true, "NO") //if like to receive notification for that station few minutes before
    }],
    status: requiredField(NUM, true, 0), //If user is receiving any updates or not 0=active, 1=deactivated
    date_joined: requiredField(DT, true, Date.now())

});

module.exports = mongoose.model('Commuter', commuter);