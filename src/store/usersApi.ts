// src/store/usersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, UserFormValues } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com/';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Users'],
  
  keepUnusedDataFor: 86400, 
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false, 

  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      
      providesTags: (result: User[] | undefined) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    addUser: builder.mutation<User, UserFormValues & { id: number }>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
      async onQueryStarted(newUser, { dispatch, queryFulfilled }) {
        await queryFulfilled; 
        
        dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            draft.push({ ...newUser }); 
          })
        );
      },
      // FINAL FIX: Remove invalidatesTags to prevent immediate background GET request
      // invalidatesTags: [{ type: 'Users', id: 'LIST' }], <-- REMOVED
    }),

    updateUser: builder.mutation<User, User>({
      query: (user) => ({
        url: `users/${user.id}`,
        method: 'PUT',
        body: user,
      }),
      async onQueryStarted(user, { dispatch, queryFulfilled }) {
        dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const index = draft.findIndex(u => u.id === user.id);
            if (index !== -1) {
              draft[index] = user;
            }
          })
        );
        
        await queryFulfilled; 
      },
      // FINAL FIX: Remove invalidatesTags
      // invalidatesTags: (_, __, { id }) => [{ type: 'Users', id }], <-- REMOVED
    }),

    deleteUser: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const index = draft.findIndex(u => u.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );

        await queryFulfilled; 
      },
      // FINAL FIX: Remove invalidatesTags
      // invalidatesTags: [{ type: 'Users', id: 'LIST' }], <-- REMOVED
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;