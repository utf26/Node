const { text } = require('express')
const mongoose = require('mongoose')

const tls = new mongoose.Schema({
    date : {
        type: Date,
        default: Date.now
    },
    program : {
        type : String
    },
    music_day : {
        type: String
    },
    duration : {
        type: String
    }
})

const lesson_log = new mongoose.Schema({
    teacher : {
        type : String
    },
    time : {
        type : String
    },
    date : {
        type: Date,
        default: Date.now
    }
})

const hour_log = new mongoose.Schema({
    teacher : {
        type : String
    },
    time : {
        type : String
    },
    date : {
        type: Date,
        default: Date.now
    },
    notes : {
        type: String
    }
})

const case_notes = new mongoose.Schema({
    reviewer : {
        type : String
    },
    recent_changes : {
        type : String
    },
    communication : {
        type: String
    }
})

const lesson = new mongoose.Schema({
    trainer : {
        type : String
    },
    date : {
        type: Date,
        default: Date.now
    },
    lesson_length : {
        type: String
    },
    lesson_objectives : {
        type : String
    },
    message : {
        type : String
    },
    reflex : {
        type: String
    },
    tactile : {
        type : String
    },
    vestibular : {
        type : String
    },
    oral : {
        type: String
    },
    kinestesia : {
        type : String
    },
    muscle_tone : {
        type : String
    },
    proprioception : {
        type: String
    },
    vision : {
        type : String
    },
    emotions : {
        type: String
    },
    others : {
        type : String
    },
    plan_for_next_session : {
        type : String
    },
    parent_feedback : {
        type: String
    }
})

const StudentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Provide an Email'],
        maxlength: 60
    },
    dob: {
        type: Date,
        default: Date.now,
        required: [true, 'Please Provide Date of Birth'],
    },
    name: {
        type: String,
        required: [true, 'Please Provide Name'],
        maxlength: 60
    },
    parents_concern: {
        type: String
    },
    emotional_regulation: {
        type: String
    },
    total_hours: {
        type: Number,
        default: 40,
    },
    completed_hours: {
        type: Number,
    },
    tls: [tls],
    lesson_log: [lesson_log],
    hour_log: [hour_log],
    case_notes: [case_notes],
    lesson: [lesson],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please Provide User'],
    },
}, { timestamps: true })


module.exports = mongoose.model('Student', StudentSchema)