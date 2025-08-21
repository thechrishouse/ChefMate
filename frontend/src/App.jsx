import { Routes, Route } from 'react-router-dom';
import { Header, HomePage, AboutPage, AuthPage, AddRecipe, DashboardPage, DashboardHome, MyRecipes } from './components';


export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage /> }></Route>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/contact-us" element={<ContactUs />} />

        {/* Dashboard page w/nested routes */}
        <Route path='/dashboard' element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path='add-recipe' element={<AddRecipe />}></Route>
          <Route path='my-recipes' element={<MyRecipes />}></Route>
        </Route>
      </Routes>
    </>
  );
}
