import { Routes, Route } from 'react-router-dom';
import { Header, HomePage, AboutPage, ContactPage, AuthPage, AddRecipe, DashboardPage, DashboardHome, MyRecipes, RecipePage } from './components';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path='recipe/:id' element={<RecipePage />}/>
        <Route path="/contact" element={<ContactPage />} />

        {/* Dashboard page w/nested routes */}
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="add-recipe" element={<AddRecipe />}></Route>
          <Route path="my-recipes" element={<MyRecipes />}></Route>
          <Route path="recipe/:id" element={<RecipePage />}></Route>
        </Route>
      </Routes>
    </>
  );
}
