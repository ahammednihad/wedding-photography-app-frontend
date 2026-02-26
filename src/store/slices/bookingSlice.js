import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";

export const fetchBookings = createAsyncThunk(
    "bookings/fetchBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.getMyBookings();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch bookings");
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        clearBookingError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
