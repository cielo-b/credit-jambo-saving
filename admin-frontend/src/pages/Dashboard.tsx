import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchStats, fetchPendingDevices } from "../store/adminSlice";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, pendingDevices } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchPendingDevices());
  }, [dispatch]);

  const statCards = [
    {
      name: "Total Users",
      value: stats?.users.total || 0,
      subtext: `${stats?.users.verified || 0} verified`,
      color: "bg-blue-500",
    },
    {
      name: "Pending Devices",
      value: stats?.devices.pendingVerification || 0,
      subtext: "Awaiting verification",
      color: "bg-yellow-500",
    },
    {
      name: "Total Transactions",
      value: stats?.transactions.total || 0,
      subtext: "All time",
      color: "bg-green-500",
    },
    {
      name: "Total Balance",
      value: `$${stats?.financials.totalBalance.toFixed(2) || "0.00"}`,
      subtext: "System-wide",
      color: "bg-indigo-500",
    },
  ];

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                    <div className="h-6 w-6 text-white text-center font-bold">
                      {typeof stat.value === "number" ? stat.value : "$"}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                      <dd className="text-xs text-gray-500">{stat.subtext}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Overview */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Financial Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats?.financials.totalDeposits.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-sm text-gray-600">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">
                ${stats?.financials.totalWithdrawals.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className="text-2xl font-bold text-indigo-600">
                ${stats?.financials.totalBalance.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Pending Devices */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Device Verifications ({pendingDevices.length})
          </h2>
          {pendingDevices.length === 0 ? (
            <p className="text-gray-500">No pending device verifications</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDevices.slice(0, 5).map((device: any) => (
                    <tr key={device.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {device.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {device.deviceName} - {device.deviceModel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(device.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
