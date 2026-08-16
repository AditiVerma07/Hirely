import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ApplicationDetail from '../pages/ApplicationDetail';
import Landing from '../pages/Landing';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from '../context/AuthContext';
// import ProtectedRoute from './ProtectedRoute';
// import Landing from '../pages/Landing';
// import Login from '../pages/Login';
// import Register from '../pages/Register';
// import Dashboard from '../pages/Dashboard';
// import ApplicationDetail from '../pages/ApplicationDetail';

// // "/" should feel like a normal landing page for visitors, but a logged-in user
// // coming back to the root URL should land in their dashboard, not the pitch page.
// function RootRoute() {
//   const { user, isLoading } = useAuth();

//   if (isLoading) return null; // session restore in flight, avoid a flash of the wrong page

//   return user ? <Navigate to="/dashboard" replace /> : <Landing />;
// }

// function AppRoutesInner() {
//   return (
//     <Routes>
//       <Route path="/" element={<RootRoute />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/applications/:id"
//         element={
//           <ProtectedRoute>
//             <ApplicationDetail />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default function AppRoutes() {
//   return (
//     <AuthProvider>
//       <AppRoutesInner />
//     </AuthProvider>
//   );
// }