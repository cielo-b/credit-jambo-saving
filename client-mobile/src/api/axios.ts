import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

const API_URL = "http://localhost:5000/api"; // Change to your API URL

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      // Navigation will be handled by app state
    }
    return Promise.reject(error);
  }
);

// Helper to get device info
export const getDeviceInfo = async () => {
  const deviceId =
    (await AsyncStorage.getItem("deviceId")) || `device-${Date.now()}`;
  await AsyncStorage.setItem("deviceId", deviceId);

  return {
    deviceId,
    deviceName: Device.modelName || "Unknown Device",
    deviceModel: Device.deviceName || "Unknown",
    osVersion: Device.osVersion || "Unknown",
  };
};

export default axiosInstance;
