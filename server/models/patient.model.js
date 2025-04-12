import mongoose from 'mongoose'
const patientSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
      },
      lastName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
      },
      /*
      phoneNumber: {
        type: String
      },
      age: {
        type: Number
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
      },*/
      audioFileUrl: {
        type: String,
        required: true
      },
      videoFileUrl: {
        type: String,
        required: true
      },
      /*
      uploadDate: {
        type: Date,
        default: Date.now
      },
      modelPrediction: {
        type: String, // example: "Positive", "Negative", "Uncertain"
        enum: ['Positive', 'Negative', 'Uncertain'],
        default: 'Uncertain'
      },
      doctorResponse: {
        type: String, // e.g., "Confirmed Positive", "Confirmed Negative", "Needs more data"
        default: null
      },
      diagnosisStatus: {
        type: String,
        enum: ['Pending', 'Reviewed'],
        default: 'Pending'
      },
      notesFromDoctor: {
        type: String
      }*/
    });

    const Patient = mongoose.model('Patient', patientSchema)

    export default Patient;