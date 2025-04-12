import Patient from "../models/patient.model.js";
import mongoose from 'mongoose';


export const getPatients = async (req, res) => {
    try {
      const patients = await Patient.find(); // fetch all patients
      res.status(200).json({ success: true, data: patients });
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };


export const getPatientById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const patient = await Patient.findById(id);
      if (!patient) {
        return res.status(404).json({ success: false, message: "Patient not found" });
      }
      res.status(200).json({ success: true, data: patient });
    } catch (error) {
      console.error("Error fetching patient by ID:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };


  export const createPatient = async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      age,
      gender,
      audioFileUrl,
      videoFileUrl,
      modelPrediction,
      doctorResponse,
      diagnosisStatus,
      notesFromDoctor
    } = req.body;
  
    if (!firstName || !lastName || !email || !audioFileUrl || !videoFileUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: firstName, lastName, email, audioFileUrl, and videoFileUrl."
      });
    }
  
    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      phoneNumber,
      age,
      gender,
      audioFileUrl,
      videoFileUrl,
      modelPrediction,
      doctorResponse,
      diagnosisStatus,
      notesFromDoctor
    });
  
    try {
      await newPatient.save();
      res.status(201).json({ success: true, data: newPatient });
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = req.body;

    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success:false, message: "Invalid Patient Id" });
    }

    try {
      const updatedPatient = await Patient.findByIdAndUpdate(id, patient, {
        new: true,            // return the updated document
        runValidators: true,  // validate before updating
      });
  
      if (!updatedPatient) {
        return res.status(404).json({ success: false, message: "Patient not found" });
      } //chatgpt
  
      res.status(200).json({ success: true, data: updatedPatient });
    } catch (error) {
      console.error("Error updating patient:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  
export const deletePatient =  async(req,res) => {
    
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success:false, message: "Invalid Patient Id" });
    }

    try{

        await Patient.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Patient deleted" });

    } catch (error) {

        res.status(500).json({ success: false, message: "Server Error" });
    }

};