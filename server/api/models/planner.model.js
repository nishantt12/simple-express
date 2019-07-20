'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlannerSchema = new Schema({
    name: String, //eg. dual body part, 5X5 etc
    plan: [{
        name: String, 
        _id: false,
        vyayam: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vyayam'
            },
            _id: false,
            name: String,
            duration: Number,//in minutes
            setCount: Number
        }]
    }],
    description: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Planner', PlannerSchema);

