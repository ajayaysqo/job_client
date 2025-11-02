// client/src/app/import-history/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function ImportHistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggering, setTriggering] = useState(false);

  // Fetch import history on load
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/import-history');
        if (!res.ok) throw new Error('Failed to fetch import history');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Trigger manual import
  const handleTriggerImport = async () => {
    setTriggering(true);
    try {
      const res = await fetch('http://localhost:5000/api/trigger-import');
      if (!res.ok) throw new Error('Failed to trigger import');
      const result = await res.json();
      alert(result.message);
      // Refetch logs after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Import History</h1>
            <p className="text-gray-600 mt-1">
              View logs of all automated and manual job imports from RSS feeds.
            </p>
          </div>
          <button
            onClick={handleTriggerImport}
            disabled={triggering}
            className={`px-4 py-2 rounded-md font-medium text-white transition ${
              triggering
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {triggering ? 'Triggering...' : 'Trigger Import Now'}
          </button>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Loading import history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">❌ Error: {error}</p>
            <p className="text-red-600 mt-2">Make sure your backend server is running on port 5000.</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No import history found.</p>
            <p className="text-gray-400 mt-2">Click "Trigger Import Now" to start your first import.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feed URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      New
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Failed
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={log.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline max-w-xs truncate block"
                        >
                          {log.fileName}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {log.totalFetched}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">
                        {log.newJobs}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-600 font-medium">
                        {log.updatedJobs}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">
                        {log.failedJobs.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Data is pulled from your local backend server (port 5000)</p>
        </div>
      </div>
    </div>
  );
}