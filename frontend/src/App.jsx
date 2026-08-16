import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}