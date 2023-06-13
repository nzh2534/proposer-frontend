// import { createSlice} from '@reduxjs/toolkit';

// //createSlice defines state/actions/and reducers

// export const counterSlice = createSlice({
//   name: "counter",
//   initialState: {
//     count: 0
//   },
//   reducers: {
//     increment: (state) => {
//       state.count += 1;
//     },
//     decrement: (state) => {
//       state.count -= 1;
//     },
//     incrementByAmount: (state, action) => {
//       state.count += action.payload;
//     }
//   }
// });

// getCount();

// // Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// export default counterSlice.reducer;

// --------------------------------------------------------------

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
// export const getProposals = createAsyncThunk('proposals/getProposals', async () => {
//   const response = await axios.get('http://127.0.0.1:8000/api/proposals/')
//   return response.data
// })
// export const proposalsSlice = createSlice({
//   name: 'proposals',
//   initialState: {
//     data: [],
//     loading: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(getProposals.pending, (state, action) => {
//       if (state.loading === 'idle') {
//         state.loading = 'pending'
//       }
//     })
//     builder.addCase(getProposals.fulfilled, (state, action) => {
//       if (state.loading === 'pending') {
//         state.data = action.payload
//         state.loading = 'idle'
//       }
//     })
//     builder.addCase(getProposals.rejected, (state, action) => {
//       if (state.loading === 'pending') {
//         state.loading = 'idle'
//         state.error = 'Error occured'
//       }
//     })
//   },
// })
// export default proposalsSlice.reducer