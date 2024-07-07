import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const TrackerAdapter = createEntityAdapter({
  selectId: (entity) => entity.id,
});

const initialState = TrackerAdapter.getInitialState();

export const TrackerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTracks: builder.query({
      query: () => "/work-hours/",
      transformResponse: (responseData) => {
        return TrackerAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        { type: "Tracks", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Tracks", id })),
      ],
      keepUnusedDataFor: 60 * 60,
    }),
    updateTrack: builder.mutation({
      query: (track) => ({
        url: `/work-hours/${track.id}/`,
        method: "PATCH",
        body: {
          ...track,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Tracks", id: arg.id },
      ],
    }),
    deleteTrack: builder.mutation({
      query: ({ id }) => ({
        url: `/work-hours/${id}/`,
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Tracks", id: arg.id },
      ],
    }),
    addTrack: builder.mutation({
      query: (track) => ({
        url: "/work-hours/",
        method: "POST",
        body: {
          ...track,
        },
      }),
      invalidatesTags: [{ type: "Tracks", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTracksQuery,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
  useAddTrackMutation,
} = TrackerApiSlice;

export const selectTracksResult =
  TrackerApiSlice.endpoints.getTracks.select();

const selectTracksData = createSelector(
  selectTracksResult,
  (TracksResult) => TracksResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllTracks,
  selectById: selectTrackById,
  selectIds: selectTracksIds,
  selectTotal: selectTotalTrack,
} = TrackerAdapter.getSelectors(
  (state) => selectTracksData(state) ?? initialState
);
