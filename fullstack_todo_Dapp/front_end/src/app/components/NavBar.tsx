"use client";
import Link from "next/link";
const NavBar: React.FC = () => {


  return (
    <nav className="bg-white  bg-opacity-45 absolute w-screen top-0 text-black px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-gray-200">
            <img src="todo.jpeg" className="w-20 rounded-md" alt="Logo" />
          </Link>
        </div>
        <ul className="flex gap-10 space-x-4">
          <li className="hover:text-gray-200 flex items-center justify-center">
            <Link
              href="/create"
              className="hover:text-gray-400 font-sans flex items-center justify-center"
            >
              <span>Create</span>
            </Link>
          </li>
          <li className="flex items-center relative justify-center">
            <Link
              href="/list"
              className="hover:text-gray-200 font-sans flex items-center justify-center"
            >
              <span>List</span>
            </Link>
         
          </li>
         
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
