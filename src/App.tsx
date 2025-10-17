// src/App.tsx
import { useState, useMemo } from 'react'; 
import { Box, Typography, Container, Button, TextField } from '@mui/material'; 

// FIX: IMPORT ALL CUSTOM COMPONENTS
import UserTable from './components/UserTable';
import UserFormDialog from './components/UserFormDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import NotificationSnackbar from './components/NotificationSnackbar';

import {
  // FIX: Ensure all hooks are correctly imported from the usersApi file
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery, 
  usersApi
} from './store/usersApi';

import type { User, UserFormValues } from './types'; 
import { useSelector, useDispatch } from 'react-redux'; 
import type { RootState } from './store/store'; 
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'; 
import type { SerializedError } from '@reduxjs/toolkit'; 
import { showSnackbar } from './store/uiSlice'; 


const selectUsersData = (state: RootState) => usersApi.endpoints.getUsers.select()(state)?.data;

function App() {
  const dispatch = useDispatch(); 

  const { data: _, isLoading, isError, error } = useGetUsersQuery(); 
  const allUsers = useSelector(selectUsersData);

  const [searchTerm, setSearchTerm] = useState(''); 

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

  // FIX: Hooks are correctly destructured here
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    if (!searchTerm) return allUsers;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return allUsers.filter(user =>
      user.name.toLowerCase().includes(lowerCaseSearch) ||
      user.username.toLowerCase().includes(lowerCaseSearch) ||
      user.email.toLowerCase().includes(lowerCaseSearch)
    );
  }, [allUsers, searchTerm]);
  

  const handleOpenAdd = () => {
    setUserToEdit(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setIsDialogOpen(true);
  };

  const handleSaveUser = async (values: UserFormValues & { id?: number }) => {
    try {
      if (values.id) {
        await updateUser(values as User).unwrap();
        dispatch(showSnackbar({ message: `User '${values.name}' updated successfully!`, severity: 'success' }));
      } else {
        await addUser({ ...values, id: Math.floor(Math.random() * 100000) }).unwrap(); 
        dispatch(showSnackbar({ message: `User '${values.name}' added successfully!`, severity: 'success' }));
      }
    } catch (err) {
      dispatch(showSnackbar({ message: `Failed to save user (Mock API error).`, severity: 'error' }));
      console.error('Failed to save user (Mock API response):', err);
    }
  };

  const handleOpenDeleteConfirm = (userId: number) => {
    const user = allUsers?.find(u => u.id === userId); 
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        dispatch(showSnackbar({ message: `User '${userToDelete.name}' deleted successfully.`, severity: 'success' }));
      } catch (err) {
        dispatch(showSnackbar({ message: `Failed to delete user (Mock API error).`, severity: 'error' }));
        console.error('Failed to delete user (Mock API response):', err);
      }
    }
    setIsDeleteConfirmOpen(false);
    setUserToDelete(undefined);
  };
  
  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Management Dashboard
        </Typography>
        <Button variant="contained" onClick={handleOpenAdd}>
          Add User
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search users by Name, Username, or Email"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <UserTable 
        users={filteredUsers} 
        isLoading={isLoading} 
        isError={isError}
        error={error as FetchBaseQueryError | SerializedError | undefined} 
        onEdit={handleOpenEdit} 
        onDelete={handleOpenDeleteConfirm} 
      />

      <UserFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        userToEdit={userToEdit}
        onSave={handleSaveUser}
      />

      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || `User ID: ${userToDelete?.id}`} 
      />
      
      <NotificationSnackbar />
    </Container>
  );
}

export default App;