// adminDashboard.tsx
import React from "react";

const AdminDashboard: React.FC = () => {
  // const sections = [
  //   { name: "User Management", link: "/admin/userList" },
  //   { name: "Admin Management", link: "/admin/adminList" },
  //   { name: "News Management", link: "/admin/newsList" },
  //   { name: "Category Management", link: "/admin/categoryList" },
  //   { name: "Emergency Contacts", link: "/admin/emergencyContacts" },
  //   { name: "Historical Places", link: "/admin/historicalPlaceList" },
  //   { name: "Advertises", link: "/admin/advertises" },
  //   { name: "Post Requirements", link: "/admin/postRequirements" },
  //   { name: "Reporter Management", link: "/admin/reporterList" },
  //   { name: "Requirement Categories", link: "/admin/requirementCategories" },
  //   { name: "Special Stories", link: "/admin/specialStories" },
  //   { name: "Status Categories", link: "/admin/statusCategories" },
  //   { name: "Statuses", link: "/admin/statuses" },
  //   { name: "Stores", link: "/admin/stores" },
  //   { name: "Taluka List", link: "/admin/talukaList" },
  //   { name: "Videos", link: "/admin/videos" },
  // ];

  return (
    <p>Admin Dashboard</p>
    // <div className="flex h-screen bg-gray-100">
    //   {/* Sidebar */}
    //   <aside className="w-64 bg-white shadow-md h-full">
    //     <div className="px-4 py-6">
    //       <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
    //       <nav className="mt-6">
    //         <ul className="space-y-2">
    //           {sections.map((section, index) => (
    //             <li key={index}>
    //               <a
    //                 href={section.link}
    //                 className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
    //               >
    //                 {/* Custom SVG Icon for each section */}
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   fill="none"
    //                   viewBox="0 0 24 24"
    //                   stroke="currentColor"
    //                   className="w-6 h-6 mr-3"
    //                 >
    //                   <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     strokeWidth="2"
    //                     d="M3 7h18M3 12h18M3 17h18"
    //                   />
    //                 </svg>
    //                 {section.name}
    //               </a>
    //             </li>
    //           ))}
    //         </ul>
    //       </nav>
    //     </div>
    //   </aside>

    //   {/* Main Content */}
    //   <div className="flex-1 flex flex-col">
    //     {/* Header */}
    //     <header className="bg-white shadow-sm p-4 flex items-center justify-between">
    //       <div className="flex items-center">
    //         <input
    //           type="text"
    //           className="w-64 px-4 py-2 border border-gray-300 rounded-md"
    //           placeholder="Search..."
    //         />
    //       </div>
    //       <div className="flex items-center space-x-4">
    //         <button className="relative">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //             className="w-6 h-6 text-gray-600"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth="2"
    //               d="M15 17h5l-1.405-4.212A2 2 0 0016.671 12H8.329a2 2 0 00-1.924 1.788L5 17h5m0 0v1a3 3 0 006 0v-1m-6 0a3 3 0 11-6 0v-1m6 0V9"
    //             />
    //           </svg>
    //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
    //         </button>
    //         <div className="dropdown dropdown-end">
    //           <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
    //             <div className="w-10 rounded-full bg-gray-200">
    //               {/* User profile icon */}
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 className="w-6 h-6 text-gray-600"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   strokeWidth="2"
    //                   d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M12 9a4 4 0 100-8 4 4 0 000 8z"
    //                 />
    //               </svg>
    //             </div>
    //           </label>
    //           <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
    //             <li>
    //               <a href="/profile">Profile</a>
    //             </li>
    //             <li>
    //               <a href="/settings">Settings</a>
    //             </li>
    //             <li>
    //               <a href="/logout">Logout</a>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //     </header>

    //     {/* Dashboard Content */}
    //     <main className="flex-1 p-6 bg-gray-100">
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    //         {sections.map((section, index) => (
    //           <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
    //             <h3 className="text-lg font-semibold text-gray-700 mb-2">{section.name}</h3>
    //             <p className="text-sm text-gray-500">
    //               Manage {section.name.toLowerCase()} in the system, view statistics, and perform CRUD operations.
    //             </p>
    //             <a
    //               href={section.link}
    //               className="mt-4 inline-block text-blue-500 hover:text-blue-700 transition-colors duration-200"
    //             >
    //               Go to {section.name}
    //             </a>
    //           </div>
    //         ))}
    //       </div>
    //     </main>
    //   </div>
    // </div>
  );
};

export default AdminDashboard;
