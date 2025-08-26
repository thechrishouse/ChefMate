import { NavLink, Outlet } from 'react-router-dom';
import { useState, useEffect} from 'react';

export default function Dashboard() {
  const [user, setUser] = useState({firstName: ''});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])

  return (
    <div className="flex min-h-screen text-gray-500">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 py-10 px-4 flex flex-col gap-6">
        <h1 className="mb-5 text-2xl text-gray-900 font-bold">Welcome, {user.firstName}</h1>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "py-3 px-4 font-semibold rounded-md bg-green-600 text-gray-100" : "py-3 px-4 font-semibold rounded-md bg-transparent"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="my-recipes"
            className={({ isActive }) =>
              isActive ? "py-3 px-4 font-semibold rounded-md bg-green-600 text-gray-100" : "py-3 px-4 font-semibold rounded-md bg-transparent"
            }
          >
            My Recipes
          </NavLink>
          <NavLink
            to="add-recipe"
            className={({ isActive }) =>
              isActive ? "py-3 px-4 font-semibold rounded-md bg-green-600 text-gray-100" : "py-3 px-4 font-semibold rounded-md text-gray-700"
            }
          >
            Add Recipe
          </NavLink>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 bg-white px-10 py-10 min-w-4xl">
        <Outlet />
      </main>
    </div>
  );
}
