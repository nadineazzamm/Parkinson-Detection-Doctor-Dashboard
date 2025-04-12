// src/pages/DoctorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button.tsx';
import { 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  PlusCircle, 
  RefreshCw,
  Filter,
  ChevronDown,
  UserPlus,
  Clipboard,
  CheckCircle
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.tsx';
import { toast } from '../components/ui/toast.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog.tsx';
import { AddPatientForm } from '../components/AddPatientForm.tsx';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  modelResult?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
  lastVisit?: string;
}

const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/patients');
      setPatients(response.data.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch patients data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeletePatient = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`http://localhost:5001/api/patients/${id}`);
        setPatients(patients.filter(patient => patient._id !== id));
        toast({
          title: "Success",
          description: "Patient deleted successfully",
          variant: "default"
        });
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast({
          title: "Error",
          description: "Failed to delete patient",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddPatient = async (newPatient: Omit<Patient, '_id'>) => {
    try {
      const response = await axios.post('http://localhost:5001/api/patients', newPatient);
      setPatients([...patients, response.data.data]);
      setAddPatientOpen(false);
      toast({
        title: "Success",
        description: "Patient added successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive"
      });
    }
  };

  const getFilteredPatients = () => {
    let filtered = patients;
    
    // Apply search filter
    filtered = filtered.filter((patient) =>
      `${patient.firstName} ${patient.lastName} ${patient.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => {
        if (filterStatus === 'pending') return !p.modelResult;
        if (filterStatus === 'confirmed') return p.modelResult;
        return true;
      });
    }
    
    // Apply tab filter
    if (currentTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(p => p.createdAt?.split('T')[0] === today);
    } else if (currentTab === 'pending') {
      filtered = filtered.filter(p => !p.modelResult);
    } else if (currentTab === 'confirmed') {
      filtered = filtered.filter(p => p.modelResult);
    }
    
    return filtered;
  };

  const filteredPatients = getFilteredPatients();

  const stats = {
    total: patients.length,
    pending: patients.filter(p => !p.modelResult).length,
    confirmed: patients.filter(p => p.modelResult).length,
    today: patients.filter(p => {
      const today = new Date().toISOString().split('T')[0];
      return p.createdAt?.split('T')[0] === today;
    }).length
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with gradient background */}
      <div className="bg-blue-900 text-white py-6 px-8 shadow-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold">Doctor's Dashboard</h1>
      <p className="mt-1 text-indigo-100">Manage your patients and appointments</p>
    </div>
    <div className="flex space-x-3">
      <Button 
        variant="outline" 
        className="flex items-center gap-2 text-black border-indigo-300 hover:bg-indigo-600 transition-colors"
        onClick={fetchPatients}
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
      <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">
            <UserPlus className="h-4 w-4" />
            New Patient
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <AddPatientForm onSubmit={handleAddPatient} />
        </DialogContent>
      </Dialog>
    </div>
  </div>
</div>






      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-slate-800">Total Patients</CardTitle>
              <div className="p-2 bg-indigo-100 rounded-full">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
              <p className="text-sm text-slate-500 mt-1">Registered patients</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-slate-800">Pending</CardTitle>
              <div className="p-2 bg-amber-100 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{stats.pending}</div>
              <p className="text-sm text-slate-500 mt-1">Awaiting diagnosis</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-emerald-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-slate-800">Confirmed</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{stats.confirmed}</div>
              <p className="text-sm text-slate-500 mt-1">Diagnosis confirmed</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-slate-800">Today</CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{stats.today}</div>
              <p className="text-sm text-slate-500 mt-1">New appointments</p>
            </CardContent>
          </Card>
        </div>



       {/* Tabs with improved styling and bigger sizes */}
          <Card className="shadow-md mb-12 overflow-hidden border-0">
            <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
              <div className="bg-white px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <TabsList className="bg-slate-100 p-1.5 rounded-md min-h-12">
                  <TabsTrigger 
                    value="all" 
                    className="text-base px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    All Patients
                  </TabsTrigger>
                  <TabsTrigger 
                    value="today" 
                    className="text-base px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    Today
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className="text-base px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger 
                    value="confirmed" 
                    className="text-base px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    Confirmed
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-4 pb-4 md:pb-0">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-12 w-72 text-base h-12 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 h-12 px-5 border-slate-300 text-base">
                        <Filter className="h-5 w-5" />
                        Filter
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="shadow-lg border border-slate-200">
                      <DropdownMenuItem onClick={() => setFilterStatus('all')} className="text-base py-3">
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('pending')} className="text-base py-3">
                        Pending Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('confirmed')} className="text-base py-3">
                        Confirmed Only
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="all" className="mt-0 p-0">
                <PatientTable 
                  patients={filteredPatients} 
                  navigate={navigate} 
                  onDelete={handleDeletePatient} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="today" className="mt-0 p-0">
                <PatientTable 
                  patients={filteredPatients} 
                  navigate={navigate} 
                  onDelete={handleDeletePatient} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0 p-0">
                <PatientTable 
                  patients={filteredPatients} 
                  navigate={navigate} 
                  onDelete={handleDeletePatient} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="confirmed" className="mt-0 p-0">
                <PatientTable 
                  patients={filteredPatients} 
                  navigate={navigate} 
                  onDelete={handleDeletePatient} 
                  isLoading={isLoading} 
                />
              </TabsContent>
            </Tabs>
          </Card>
      </div>
    </div>
  );
};

interface PatientTableProps {
  patients: Patient[];
  navigate: (path: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, navigate, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-16 w-16 text-indigo-500 animate-spin" />
          <p className="mt-6 text-xl text-slate-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex items-center justify-center p-16 bg-white border-t border-slate-200">
        <div className="text-center">
          <Clipboard className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-slate-800">No patients found</h3>
          <p className="mt-2 text-lg text-slate-500">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  // The key change is here - we'll modify just the table itself
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base bg-white">
        <thead>
          <tr className="border-t border-b border-slate-200 bg-slate-50 text-slate-700">
            <th className="text-left py-5 px-6 font-semibold text-lg">Patient Name</th>
            <th className="text-left py-5 px-6 font-semibold text-lg">Email</th>
            <th className="text-left py-5 px-6 font-semibold text-lg">Date Added</th>
            <th className="text-left py-5 px-6 font-semibold text-lg">Status</th>
            <th className="text-right py-5 px-6 font-semibold text-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => {
            const createdDate = patient.createdAt 
              ? new Date(patient.createdAt).toLocaleDateString() 
              : 'N/A';
            
            return (
              <tr 
                key={patient._id} 
                className={`
                  border-b border-slate-200 hover:bg-slate-50 transition-colors
                  ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                `}
              >
                <td className="py-5 px-6 font-medium text-slate-800 text-lg">
                  {patient.firstName} {patient.lastName}
                </td>
                <td className="py-5 px-6 text-slate-600 text-lg">{patient.email}</td>
                <td className="py-5 px-6 text-slate-600 text-lg">{createdDate}</td>
                <td className="py-5 px-6">
                  {patient.modelResult ? (
                    <span className="px-4 py-2 rounded-full text-base font-medium bg-emerald-100 text-emerald-800 flex items-center w-fit gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Confirmed
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-full text-base font-medium bg-amber-100 text-amber-800 flex items-center w-fit gap-2">
                      <Clock className="h-5 w-5" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-5 px-6 text-right">
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/patient/${patient._id}`)}
                      className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-colors py-2 px-4 text-base h-auto"
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/patient/${patient._id}/edit`)}
                      className="text-amber-600 border-amber-200 hover:bg-amber-50 transition-colors py-2 px-4 text-base h-auto"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onDelete(patient._id)}
                      className="text-red-600 border-red-200 hover:bg-red-50 transition-colors py-2 px-4 text-base h-auto"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default DoctorDashboard;