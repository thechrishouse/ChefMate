import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AuthPage from './components/AuthPage';
import AddRecipe from './components/AddRecipe';
import Dashboard from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import MyRecipes from './components/MyRecipes';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Dashboard page w/nested routes */}
      <Route path='/dashboard' element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path='add-recipe' element={<AddRecipe />}></Route>
        <Route path='my-recipes' element={<MyRecipes />}></Route>
      </Route>
    </Routes>
  );
}
