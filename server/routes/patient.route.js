import express from "express";

import { getPatients, getPatientById, createPatient, updatePatient, deletePatient } from "../controllers/patient.controller.js";

const router = express.Router();


router.post("/", createPatient);
router.delete("/:id", deletePatient);
router.get("/", getPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);


export default router;
