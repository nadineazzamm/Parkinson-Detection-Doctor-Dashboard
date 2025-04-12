// src/pages/PatientDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button.tsx';
import { toast } from '../components/ui/toast.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog.tsx';
import EditPatientForm from '../components/EditPatientForm.tsx';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  Edit, 
  Trash, 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronRight,
  FileCheck,
  FilePlus,
  Stethoscope,
  ClipboardList,
  Activity,
  PlusCircle
} from 'lucide-react';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string[];
  medications?: string[];
  modelResult?: string;
  modelConfidence?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
  lastVisit?: string;
  notes?: string;
}

interface Appointment {
  _id: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

const PatientDetailsSkeleton = () => (
  <div className="min-h-screen bg-slate-50 p-8">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-40 bg-slate-200 rounded animate-pulse"></div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-slate-200 animate-pulse mr-3"></div>
                    <div className="h-5 w-full bg-slate-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-slate-200 animate-pulse mr-3"></div>
                    <div className="h-5 w-full bg-slate-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [diagnosisEditMode, setDiagnosisEditMode] = useState(false);
  
  // Mock appointments data - in a real app, you'd fetch this from your API
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      _id: '1',
      date: '2025-04-15',
      time: '10:00 AM',
      reason: 'Initial Consultation',
      status: 'confirmed'
    },
    {
      _id: '2',
      date: '2025-04-22',
      time: '2:30 PM',
      reason: 'Follow-up',
      status: 'pending'
    }
  ]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/patients/${id}`);
      setPatient(response.data.data);
      setDiagnosisInput(response.data.data.modelResult || '');
      setError(null);
    } catch (err) {
      console.error("Error fetching patient details:", err);
      setError("Failed to load patient details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const handleUpdatePatient = async (updatedData: Partial<Patient>) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/patients/${id}`, updatedData);
      setPatient(response.data.data);
      setEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Patient information updated",
        variant: "default"
      });
    } catch (err) {
      console.error("Error updating patient:", err);
      toast({
        title: "Error",
        description: "Failed to update patient information",
        variant: "destructive"
      });
    }
  };

  const handleDeletePatient = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/patients/${id}`);
      toast({
        title: "Success",
        description: "Patient deleted successfully",
        variant: "default"
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Error deleting patient:", err);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDiagnosis = async () => {
    try {
      const response = await axios.put(`http://localhost:5001/api/patients/${id}`, {
        modelResult: diagnosisInput
      });
      setPatient(response.data.data);
      setDiagnosisEditMode(false);
      toast({
        title: "Success",
        description: "Diagnosis updated successfully",
        variant: "default"
      });
    } catch (err) {
      console.error("Error updating diagnosis:", err);
      toast({
        title: "Error",
        description: "Failed to update diagnosis",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <PatientDetailsSkeleton />;
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-200 bg-red-50 shadow-md">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Patient</h2>
              <p className="text-red-600 mb-6">{error || "Patient not found"}</p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-red-600 hover:bg-red-700 transition-colors"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top header bar with gradient */}
      <div className="bg-blue-900 text-white py-6 px-8 shadow-md">
  <div className="max-w-5xl mx-auto flex items-center justify-between">
    
    <div className="flex items-center space-x-2 text-lg">
      <Button 
        variant="ghost" 
        className="!text-2xl flex items-center gap-2 text-white hover:bg-indigo-600 transition-colors"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="!text-2xl hidden md:flex items-center">
        <ChevronRight className="h-4 w-4 mx-1 opacity-70" />
        <span>Patient Details</span>
      </div>
   </div>


    <div className="flex items-center gap-3">
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-black border-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit Patient
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
          </DialogHeader>
          {patient && (
            <EditPatientForm patient={patient} onSubmit={handleUpdatePatient} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-black border-red-200 hover:bg-red-700 hover:text-white transition-colors"
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="mb-4">Are you sure you want to delete this patient? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 transition-colors"
                onClick={handleDeletePatient}
              >
                Delete Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</div>





      <div className="max-w-5xl mx-auto p-8">
        {/* Patient Overview Card */}
        <Card className="mb-8 shadow-md overflow-hidden border-0">
          <div className="bg-white border-b border-slate-100 py-4 px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {patient.firstName} {patient.lastName}
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Patient ID: {patient._id}
                </CardDescription>
              </div>
              <div>
                {patient.modelResult ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    <CheckCircle className="h-4 w-4" />
                    Diagnosis Confirmed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    <AlertCircle className="h-4 w-4" />
                    Diagnosis Pending
                  </span>
                )}
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Full Name:</div>
                    <div className="font-medium text-slate-800">{patient.firstName} {patient.lastName}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Email:</div>
                    <div className="font-medium text-slate-800">{patient.email}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Phone:</div>
                    <div className="font-medium text-slate-800">{patient.phone || 'Not provided'}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Date of Birth:</div>
                    <div className="font-medium text-slate-800">{patient.dateOfBirth || 'Not provided'}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Gender:</div>
                    <div className="font-medium text-slate-800">{patient.gender || 'Not provided'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Created:</div>
                    <div className="font-medium text-slate-800">{formatDate(patient.createdAt)}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Last Visit:</div>
                    <div className="font-medium text-slate-800">{formatDate(patient.lastVisit)}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-28 text-slate-500 font-medium">Diagnosis:</div>
                    <div className="font-medium text-slate-800">
                      {patient.modelResult ? (
                        <span className="text-emerald-600">{patient.modelResult}</span>
                      ) : (
                        <span className="text-amber-600">Pending diagnosis</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Management */}
        <Card className="mb-8 shadow-md overflow-hidden border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg text-slate-800">Diagnosis Management</CardTitle>
            </div>
            <CardDescription>Review and update patient's diagnosis status</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-5 rounded-lg bg-slate-50 mb-5 border border-slate-100">
              <h3 className="text-lg font-medium mb-3 text-slate-700">Current Status</h3>
              {patient.modelResult ? (
                <div className="flex items-center text-emerald-700 bg-emerald-50 p-4 rounded-md border border-emerald-100">
                  <CheckCircle className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Diagnosis: {patient.modelResult}</div>
                    {patient.modelConfidence && (
                      <div className="text-sm mt-1">
                        Confidence: {(patient.modelConfidence * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-md border border-amber-100">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Pending diagnosis</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-lg font-medium mb-4 text-slate-700">Update Diagnosis</h3>
              
              {diagnosisEditMode ? (
                <div className="bg-white p-5 rounded-lg border border-slate-200 mb-4">
                  <label htmlFor="diagnosis" className="block text-sm font-medium text-slate-700 mb-2">
                    Diagnosis
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="diagnosis"
                      value={diagnosisInput}
                      onChange={(e) => setDiagnosisInput(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter diagnosis"
                    />
                    <Button 
                      onClick={handleUpdateDiagnosis} 
                      disabled={!diagnosisInput.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setDiagnosisEditMode(false);
                        setDiagnosisInput(patient.modelResult || '');
                      }}
                      className="border-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="mb-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors"
                  onClick={() => setDiagnosisEditMode(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {patient.modelResult ? 'Update Diagnosis' : 'Add Diagnosis'}
                </Button>
              )}

              <div className="text-sm text-slate-500 mt-2 bg-slate-50 p-3 rounded-md border border-slate-100">
                <p>Update the patient's diagnosis based on available medical information and test results.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card className="mb-8 shadow-md overflow-hidden border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg text-slate-800">Medical History</CardTitle>
            </div>
            <CardDescription>Patient's medical background and records</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 bg-slate-50 p-5 rounded-lg">
              <h3 className="text-md font-semibold mb-3 text-slate-700">Summary</h3>
              <p className="text-slate-700">
                {patient.medicalHistory || 'No medical history recorded.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-lg">
                <h3 className="text-md font-semibold mb-3 text-slate-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Allergies
                </h3>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <ul className="space-y-2">
                    {patient.allergies.map((allergy, index) => (
                      <li key={index} className="flex items-center gap-2 text-slate-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                        {allergy}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">No known allergies</p>
                )}
              </div>

              <div className="bg-slate-50 p-5 rounded-lg">
                <h3 className="text-md font-semibold mb-3 text-slate-700 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-blue-600" />
                  Medications
                </h3>
                {patient.medications && patient.medications.length > 0 ? (
                  <ul className="space-y-2">
                    {patient.medications.map((medication, index) => (
                      <li key={index} className="flex items-center gap-2 text-slate-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        {medication}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">No current medications</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="mb-8 shadow-md overflow-hidden border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg text-slate-800">Appointments</CardTitle>
            </div>
            <CardDescription>Patient's scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div 
                    key={appointment._id}
                    className="flex items-center justify-between border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-3 rounded-full mr-4">
                        <CalendarIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{appointment.reason}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    <div>
                      {appointment.status === 'confirmed' ? (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle className="h-3 w-3" />
                          Confirmed
                        </span>
                      ) : appointment.status === 'cancelled' ? (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3" />
                          Cancelled
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-lg">
                <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No appointments scheduled</p>
              </div>
            )}
            <div className="mt-6">
              <Button className="bg-indigo-600 hover:bg-indigo-700 transition-colors">
                <PlusCircle className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="shadow-md overflow-hidden border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg text-slate-800">Clinical Notes</CardTitle>
            </div>
            <CardDescription>Doctor's observations and notes</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-slate-50 p-5 rounded-lg mb-5 border border-slate-100">
              {patient.notes ? (
                <p className="text-slate-700 whitespace-pre-line">{patient.notes}</p>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 italic">No clinical notes recorded</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button className="bg-indigo-600 hover:bg-indigo-700 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Add Notes
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-4 text-sm text-slate-500 bg-slate-50 px-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>All patient data is protected and compliant with healthcare regulations.</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetails;