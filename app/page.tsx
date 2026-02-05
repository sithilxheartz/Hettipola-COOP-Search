"use client";
import { useState, useEffect } from "react";

// This defines what your customer data looks like so TypeScript understands it
interface Customer {
  id: string | number;
  name: string;
  nic: string;
  address: string;
}

export default function Home() {
  // We use <Customer[]> to tell React this is a list of customers
  const [data, setData] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Load the data when the page starts
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

  // 2. The Search Logic
  const filteredData = data.filter((customer) => {
    if (search === "") return false; // Show nothing if search is empty
    
    const searchLower = search.toLowerCase();
    
    // safe check: ensure name/id exist before searching
    const nameMatch = customer.name && String(customer.name).toLowerCase().includes(searchLower);
    const idMatch = customer.id && String(customer.id).toLowerCase().includes(searchLower);
    const nicMatch = customer.nic && String(customer.nic).toLowerCase().includes(searchLower);

    return nameMatch || idMatch || nicMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Customer Database Search
        </h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Name, ID, or NIC..."
          className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg mb-8 text-black"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Results Info */}
        {!loading && search !== "" && (
            <p className="mb-4 text-gray-600">Found {filteredData.length} results</p>
        )}

        {/* Results Table */}
        {loading ? (
          <p className="text-gray-600">Loading database...</p>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NIC</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 50).map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">
                      {customer.id}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 font-medium">
                      {customer.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-500">
                      {customer.nic}
                    </td>
                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-500">
                      {customer.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {search !== "" && filteredData.length === 0 && (
               <div className="p-10 text-center text-gray-500">
                 No customers found matching "<strong>{search}</strong>"
               </div>
            )}
            
            {search === "" && (
                <div className="p-10 text-center text-gray-400">
                    Type a name or ID to start searching
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}