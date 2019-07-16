'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VyayamSchema = new Schema({
    name: String,
    url: String,
    bodyPart: {
        type: String,
        enum:['Chest', 'Back', 'Shoulder', 'Legs', 'Biceps', 'Triceps']
    },
    vyayamType: {
        type: String,
        enum:['Compound', 'Isolation', 'Light', 'Heavy']
    },
    category: {
        type: String,
        enum:['Barbell', 'Machine', 'Dumbbell', 'Assisted Body', 'Weighted bodyweight']
    },
    muscleGroup: [{
            muscleId: String,
            name: String
    }],
    description: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vyayam', VyayamSchema);
