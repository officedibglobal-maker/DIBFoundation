import React from 'react';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/admin/system/data-seeder" className="text-blue-500 hover:underline">
                Go to Data Seeder
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
