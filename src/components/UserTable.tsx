// src/components/UserTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { User } from '../types'; 
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'; 
import type { SerializedError } from '@reduxjs/toolkit'; 

interface UserTableProps {
  users: User[] | undefined; 
  isLoading: boolean; 
  isError: boolean; 
  error: FetchBaseQueryError | SerializedError | undefined; 
  onEdit: (user: User) => void; 
  onDelete: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, isLoading, isError, error, onEdit, onDelete }) => {
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Users...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    const errorMessage = error && 'status' in error ? `Error: ${error.status}` : 'An unknown error occurred.';
    return <Typography color="error">Failed to fetch users: {errorMessage}</Typography>;
  }

  if (!users || users.length === 0) {
    return <Typography sx={{ p: 2 }}>No users found or list is empty.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="user management table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell align="right">
                <Button onClick={() => onEdit(user)} size="small" sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(user.id)}
                  size="small"
                  color="error"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;