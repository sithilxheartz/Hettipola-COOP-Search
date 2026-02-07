"use client";
import { useState, useEffect } from "react";

interface Customer {
  id: string | number;
  name: string;
  nic: string;
  address: string;
}

export default function Home() {
  const [data, setData] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    fetch("/customers.json")
      .then((res) => res.json())
      .then((customers) => {
        setData(customers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading JSON:", error);
        setLoading(false);
      });
  }, []);

  // Search Logic (Updated to include Address)
  const filteredData = data.filter((customer) => {
    if (search === "") return false;
    const searchLower = search.toLowerCase();
    
    // Check if search term exists in Name, ID, NIC, OR Address
    const nameMatch = customer.name && String(customer.name).toLowerCase().includes(searchLower);
    const idMatch = customer.id && String(customer.id).toLowerCase().includes(searchLower);
    const nicMatch = customer.nic && String(customer.nic).toLowerCase().includes(searchLower);
    const addressMatch = customer.address && String(customer.address).toLowerCase().includes(searchLower);

    return nameMatch || idMatch || nicMatch || addressMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
          Hettipola Vote List
        </h1>

        {/* Search Input - Updated Placeholder */}
        <input
          type="text"
          placeholder="Search Name, ID, NIC, or Address..."
          className="w-full p-3 md:p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-base md:text-lg mb-6 text-black"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Results Info */}
        {!loading && search !== "" && (
            <p className="mb-4 text-gray-600 text-sm md:text-base">Found {filteredData.length} results</p>
        )}

        {loading ? (
          <p className="text-gray-600 text-center">Loading database...</p>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NIC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 50).map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{customer.id}</td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900 font-medium">{customer.name}</td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-500">{customer.address}</td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-500">{customer.nic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredData.slice(0, 50).map((customer, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                  <div className="font-bold text-gray-800 text-lg mb-2">
                    {customer.name}
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">ID:</div>
                    <div className="text-gray-900 font-medium">{customer.id}</div>
                    
                    <div className="text-gray-500">Address:</div>
                    <div className="text-gray-900">{customer.address}</div>

                    <div className="text-gray-500">NIC:</div>
                    <div className="text-gray-900">{customer.nic}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {search !== "" && filteredData.length === 0 && (
               <div className="p-10 text-center text-gray-500 bg-white rounded-lg mt-4">
                 No customers found matching "<strong>{search}</strong>"
               </div>
            )}
            
            {search === "" && (
                <div className="p-10 text-center text-gray-400">
                   Type a Name, Address, or ID to start searching
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}