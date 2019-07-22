'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserPlannerSchema = new Schema({
    name: String, //eg. dual body part, 5X5 etc.
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: Date.now },
    weeksCount: Number,
    weeks:[{
        _id:false,
        date: { type: Date, default: Date.now },
        plan: [{
            name: String, 
            _id: false,
            vyayam: [{
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Vyayam'
                },
                name: String,
                _id: false,
                duration: Number,//in minutes
                setCount: Number
            }]
        }]
    }],
    description: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserPlanner', UserPlannerSchema);

