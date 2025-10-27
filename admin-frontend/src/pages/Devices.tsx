import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import {
  fetchPendingDevices,
  verifyDevice,
  fetchUsers,
} from "../store/adminSlice";

const Devices: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pendingDevices, users } = useAppSelector((state) => state.admin);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchPendingDevices());
    dispatch(fetchUsers({}));
  };

  const handleVerify = async (deviceId: string, isVerified: boolean) => {
    await dispatch(verifyDevice({ deviceId, isVerified }));
    loadData(); // Reload data after verification
  };

  // Get all devices from all users
  const allDevices = users.flatMap((user: any) =>
    user.devices.map((device: any) => ({
      ...device,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }))
  );

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Device Management
          </h1>
          <div className="text-sm text-gray-600">
            Pending: {pendingDevices.length} | Total: {allDevices.length}
          </div>
        </div>

        {/* Pending Devices */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Verifications ({pendingDevices.length})
          </h2>
          {pendingDevices.length === 0 ? (
            <p className="text-gray-500">No pending device verifications</p>
          ) : (
            <div className="space-y-4">
              {pendingDevices.map((device: any) => (
                <div
                  key={device.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                          <span className="text-yellow-600 font-semibold">
                            📱
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {device.deviceName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Model: {device.deviceModel} | OS: {device.osVersion}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          User: {device.user.firstName} {device.user.lastName} (
                          {device.user.email})
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered:{" "}
                          {new Date(device.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVerify(device.id, true)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleVerify(device.id, false)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Devices */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Devices</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allDevices.map((device: any) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {device.deviceName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {device.deviceModel} - {device.osVersion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {device.user.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {device.user.firstName} {device.user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {device.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.lastUsedAt
                      ? new Date(device.lastUsedAt).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {device.isVerified ? (
                      <button
                        onClick={() => handleVerify(device.id, false)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(device.id, true)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Devices;
