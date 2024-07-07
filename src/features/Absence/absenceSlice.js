import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create entity adapter
const absenceAdapter = createEntityAdapter({
  selectId: (entity) => entity.id,
});

// Initial state using the adapter
const initialState = absenceAdapter.getInitialState({
  status: "idle",
  error: null,
});

// Define API endpoints
export const absenceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAbsences: builder.query({
      query: () => "/employee-absences/", // Adjust endpoint as per your API
      transformResponse: (responseData) => {
        return absenceAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Absences", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Absences", id })),
            ]
          : [{ type: "Absences", id: "LIST" }],
    }),
    createAbsence: builder.mutation({
      query: (absence) => ({
        url: "/employee-absences/",
        method: "POST",
        body: absence,
      }),
      invalidatesTags: [{ type: "Absences", id: "LIST" }],
    }),
    updateAbsence: builder.mutation({
      query: ({ id, ...absence }) => ({
        url: `/employee-absences/${id}/`,
        method: "PATCH",
        body: absence,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Absences", id }],
    }),
    deleteAbsence: builder.mutation({
      query: (id) => ({
        url: `/employee-absences/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Absences", id }],
    }),
  }),
});

// Export API hooks
export const { useGetAbsencesQuery, useCreateAbsenceMutation, useUpdateAbsenceMutation, useDeleteAbsenceMutation } = absenceApiSlice;

// Selectors
export const selectAbsencesResult = absenceApiSlice.endpoints.getAbsences.select();

// Use the selector to get normalized data
const selectAbsencesData = createSelector(
  selectAbsencesResult,
  (absencesResult) => absencesResult.data // normalized state object with ids & entities
);

// Export adapter selectors
export const {
  selectAll: selectAllAbsences,
  selectById: selectAbsenceById,
  selectIds: selectAbsenceIds,
  selectTotal: selectTotalAbsences,
} = absenceAdapter.getSelectors((state) => selectAbsencesData(state) ?? initialState);

