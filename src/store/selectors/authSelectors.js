export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsTutor = (state) => state.auth.user?.role === 'tutor';
export const selectIsStudent = (state) => state.auth.user?.role === 'student';