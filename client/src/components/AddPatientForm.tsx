// src/components/AddPatientForm.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label.tsx';
import { RadioGroup, RadioGroupItem } from './ui/radio-group.tsx';
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import { Textarea } from './ui/textarea.tsx';

interface Patient {
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
}

interface AddPatientFormProps {
  onSubmit: (data: Patient) => void;
}

export const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Patient>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    medicalHistory: '',
    allergies: [],
    medications: []
  });

  const [allergiesInput, setAllergiesInput] = useState('');
  const [medicationsInput, setMedicationsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData({ ...formData, gender: value });
    if (errors.gender) {
      setErrors({ ...errors, gender: '' });
    }
  };

  const addAllergy = () => {
    if (allergiesInput.trim()) {
      setFormData({
        ...formData,
        allergies: [...(formData.allergies || []), allergiesInput.trim()]
      });
      setAllergiesInput('');
    }
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = [...(formData.allergies || [])];
    updatedAllergies.splice(index, 1);
    setFormData({ ...formData, allergies: updatedAllergies });
  };

  const addMedication = () => {
    if (medicationsInput.trim()) {
      setFormData({
        ...formData,
        medications: [...(formData.medications || []), medicationsInput.trim()]
      });
      setMedicationsInput('');
    }
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...(formData.medications || [])];
    updatedMedications.splice(index, 1);
    setFormData({ ...formData, medications: updatedMedications });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup 
            value={formData.gender || ''} 
            onValueChange={handleGenderChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medicalHistory">Medical History</Label>
        <Textarea
          id="medicalHistory"
          name="medicalHistory"
          value={formData.medicalHistory || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Allergies</Label>
        <div className="flex space-x-2">
          <Input
            value={allergiesInput}
            onChange={(e) => setAllergiesInput(e.target.value)}
            placeholder="Add allergy"
          />
          <Button 
            type="button" 
            onClick={addAllergy}
            variant="outline"
          >
            Add
          </Button>
        </div>
        {formData.allergies && formData.allergies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.allergies.map((allergy, index) => (
              <div 
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-sm">{allergy}</span>
                <button
                  type="button"
                  onClick={() => removeAllergy(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Medications</Label>
        <div className="flex space-x-2">
          <Input
            value={medicationsInput}
            onChange={(e) => setMedicationsInput(e.target.value)}
            placeholder="Add medication"
          />
          <Button 
            type="button" 
            onClick={addMedication}
            variant="outline"
          >
            Add
          </Button>
        </div>
        {formData.medications && formData.medications.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.medications.map((medication, index) => (
              <div 
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-sm">{medication}</span>
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          Add Patient
        </Button>
      </div>
    </form>
  );
};