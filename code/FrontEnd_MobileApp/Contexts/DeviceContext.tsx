import { createContext, ReactNode, useContext, useState } from "react";

type Device = {
  id: number;
  mac: string;
  name: string;
  zoneName: string;
  location: string;
  addedAt: string;
  active: boolean;
  user: User;
  plant: Plant;
  thresholdAssigned: boolean;
};

interface Plant {
  id: number;
  name: string;
  description: string;
  temperatureLow: number;
  temperatureHigh: number;
  humidityLow: number;
  humidityHigh: number;
  moistureLow: number;
  moistureHigh: number;
  phosphorus: number;
  nitrogen: number;
  potassium: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

interface User {
  name: string;
  email: string;
  phoneNumber: number;
  imageData: string;
  imageType: string;
  imageName: string;
  authMethod?: string;
}

interface DeviceContextType {
  devices: Device[] | null;
  setDevices: (devices: Device[] | null) => void;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceContextProvider = ({children} : {children: ReactNode}) => {
    const [devices, setDevices] = useState<Device[] | null>([]);

  return (
    <DeviceContext.Provider value={{ devices, setDevices }}>
      {children}
    </DeviceContext.Provider>
  );
};

// Custom hook for easier usage
export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDeviceContext must be used within a DeviceContextProvider');
  }
  return context;
};