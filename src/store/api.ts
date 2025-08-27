// src/store/api.ts
// TODO: Enable when RTK Query is properly configured
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// TODO: Implement API slice when RTK Query is available
// export const lunaApi = createApi({
//   reducerPath: 'lunaApi',
//   baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
//   tagTypes: ['User', 'Mood', 'Sleep', 'Exercises'],
//   endpoints: (builder) => ({
//     getUserData: builder.query<User, void>({
//       query: () => 'user',
//       providesTags: ['User'],
//     }),
//     updateUserData: builder.mutation<User, Partial<User>>({
//       query: (update) => ({
//         url: 'user',
//         method: 'PATCH',
//         body: update,
//       }),
//       invalidatesTags: ['User'],
//     }),
//     // Add similar queries and mutations for mood, sleep, and exercises
//   }),
// });

// export const { useGetUserDataQuery, useUpdateUserDataMutation } = lunaApi;

// Temporary simple exports to avoid import errors
export const lunaApi = null;
export const useGetUserDataQuery = () => ({});
export const useUpdateUserDataMutation = () => [() => {}, {}];