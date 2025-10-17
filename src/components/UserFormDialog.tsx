// src/components/UserFormDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
// FIX: Use 'type' keyword for type-only imports
import type { User, UserFormValues } from '../types';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  userToEdit?: User; // Optional prop for editing
  onSave: (values: UserFormValues & { id?: number }) => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  userToEdit,
  onSave,
}) => {
  const isEditing = !!userToEdit;

  // Initial state for the form
  const [formData, setFormData] = useState<UserFormValues>({
    name: '',
    email: '',
    username: '',
  });

  // Simple validation state
  const [errors, setErrors] = useState<Partial<UserFormValues>>({});

  // Effect to pre-fill data when editing
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        username: userToEdit.username,
      });
    } else {
      // Reset form when adding a new user
      setFormData({ name: '', email: '', username: '' });
    }
    setErrors({});
  }, [userToEdit, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for the field as user types
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const newErrors: Partial<UserFormValues> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Pass the ID if editing, otherwise it will be undefined (for adding)
      onSave({ ...formData, id: userToEdit?.id });
      onClose(); // Close the dialog after submission
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} pt={1}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEditing ? 'Save Changes' : 'Add User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;