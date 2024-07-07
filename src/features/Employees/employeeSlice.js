import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create entity adapter
const employeeAdapter = createEntityAdapter({
  selectId: (entity) => entity.id,
});

// Initial state using the adapter
const initialState = employeeAdapter.getInitialState({
  status: "idle",
  error: null,
});

// Define API endpoints
export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => "/employees/", // Adjust endpoint as per your API
      transformResponse: (responseData) => {
        return employeeAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Employees", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Employees", id })),
            ]
          : [{ type: "Employees", id: "LIST" }],
    }),
  }),
});

// Export API hooks
export const { useGetEmployeesQuery } = employeeApiSlice;

// Selectors
export const selectEmployeesResult = employeeApiSlice.endpoints.getEmployees.select();

// Use the selector to get normalized data
const selectEmployeesData = createSelector(
  selectEmployeesResult,
  (employeesResult) => employeesResult.data // normalized state object with ids & entities
);

// Export adapter selectors
export const {
  selectAll: selectAllEmployees,
  selectById: selectEmployeeById,
  selectIds: selectEmployeeIds,
  selectTotal: selectTotalEmployees,
} = employeeAdapter.getSelectors((state) => selectEmployeesData(state) ?? initialState);