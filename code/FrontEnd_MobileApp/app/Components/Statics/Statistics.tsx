import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { themeAuth } from "../../../Contexts/ThemeContext";

const screenWidth = Dimensions.get("window").width;

type DataType = {
  id: number;
  humidity: number;
  soilMoisture: number;
  temp: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  updatedAt: string;
};

const dataTypes = [
  { key: "temp", name: "Temperature", unit: "°C" },
  { key: "humidity", name: "Humidity", unit: "%" },
  { key: "soilMoisture", name: "Soil Moisture", unit: "%" },
  { key: "nitrogenLevel", name: "Nitrogen", unit: "ppm" },
  { key: "phosphorusLevel", name: "Phosphorus", unit: "ppm" },
  { key: "potassiumLevel", name: "Potassium", unit: "ppm" },
];

const StatisticsDisplay: React.FC = () => {
  const { theme } = themeAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ avg: 0, min: 0, max: 0, trend: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [datas, setDatas] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);

  // Static data
  const staticData: DataType[] = [
  {
    device: "Device 1",
    temp: 29.94,
    humidity: 49.61,
    soilMoisture: 49.04,
    nitrogenLevel: 8.95,
    phosphorusLevel: 6.53,
    potassiumLevel: 1.43,
    updatedAt: "2025-02-09",
    actuatorStatus: [true, false, true, false, false]
  },
  {
    device: "Device 1",
    temp: 21.64,
    humidity: 91.88,
    soilMoisture: 11.33,
    nitrogenLevel: 7.86,
    phosphorusLevel: 4.54,
    potassiumLevel: 6.42,
    updatedAt: "2025-02-12",
    actuatorStatus: [false, true, false, true, false]
  },
  {
    device: "Device 1",
    temp: 26.08,
    humidity: 70.26,
    soilMoisture: 91.62,
    nitrogenLevel: 7.78,
    phosphorusLevel: 4.52,
    potassiumLevel: 8.49,
    updatedAt: "2025-02-14",
    actuatorStatus: [true, true, false, false, true]
  },
  {
    device: "Device 2",
    temp: 21.24,
    humidity: 46.37,
    soilMoisture: 53.24,
    nitrogenLevel: 9.68,
    phosphorusLevel: 7.53,
    potassiumLevel: 5.04,
    updatedAt: "2025-02-15",
    actuatorStatus: [false, false, true, true, false]
  },
  {
    device: "Device 2",
    temp: 23.25,
    humidity: 45.80,
    soilMoisture: 16.18,
    nitrogenLevel: 1.40,
    phosphorusLevel: 7.66,
    potassiumLevel: 2.26,
    updatedAt: "2025-02-16",
    actuatorStatus: [true, false, false, true, true]
  },
  {
    device: "Device 2",
    temp: 24.82,
    humidity: 83.86,
    soilMoisture: 86.51,
    nitrogenLevel: 3.62,
    phosphorusLevel: 2.16,
    potassiumLevel: 1.95,
    updatedAt: "2025-02-17",
    actuatorStatus: [false, true, true, false, false]
  },
  {
    device: "Device 3",
    temp: 26.91,
    humidity: 21.36,
    soilMoisture: 86.59,
    nitrogenLevel: 8.30,
    phosphorusLevel: 1.75,
    potassiumLevel: 2.86,
    updatedAt: "2025-02-18",
    actuatorStatus: [true, false, true, false, true]
  },
  {
    device: "Device 3",
    temp: 23.68,
    humidity: 32.55,
    soilMoisture: 30.59,
    nitrogenLevel: 7.65,
    phosphorusLevel: 9.21,
    potassiumLevel: 3.17,
    updatedAt: "2025-02-19",
    actuatorStatus: [false, true, false, true, false]
  },
  {
    device: "Device 3",
    temp: 29.14,
    humidity: 70.85,
    soilMoisture: 93.75,
    nitrogenLevel: 8.02,
    phosphorusLevel: 6.63,
    potassiumLevel: 8.76,
    updatedAt: "2025-02-20",
    actuatorStatus: [true, true, true, false, false]
  },
  {
    device: "Device 4",
    temp: 28.98,
    humidity: 28.99,
    soilMoisture: 48.96,
    nitrogenLevel: 4.05,
    phosphorusLevel: 8.90,
    potassiumLevel: 3.85,
    updatedAt: "2025-02-21",
    actuatorStatus: [false, false, true, true, true]
  },
  {
    device: "Device 4",
    temp: 28.25,
    humidity: 54.62,
    soilMoisture: 33.62,
    nitrogenLevel: 1.84,
    phosphorusLevel: 2.35,
    potassiumLevel: 4.52,
    updatedAt: "2025-02-22",
    actuatorStatus: [true, false, false, false, true]
  },
  {
    device: "Device 4",
    temp: 22.15,
    humidity: 22.78,
    soilMoisture: 60.59,
    nitrogenLevel: 4.40,
    phosphorusLevel: 3.21,
    potassiumLevel: 4.17,
    updatedAt: "2025-02-23",
    actuatorStatus: [false, true, true, false, false]
  },
  {
    device: "Device 5",
    temp: 22.34,
    humidity: 41.94,
    soilMoisture: 57.47,
    nitrogenLevel: 1.88,
    phosphorusLevel: 6.86,
    potassiumLevel: 4.10,
    updatedAt: "2025-02-24",
    actuatorStatus: [true, false, true, true, false]
  },
  {
    device: "Device 5",
    temp: 23.78,
    humidity: 22.30,
    soilMoisture: 77.05,
    nitrogenLevel: 6.90,
    phosphorusLevel: 6.93,
    potassiumLevel: 2.31,
    updatedAt: "2025-02-25",
    actuatorStatus: [false, true, false, true, true]
  },
  {
    device: "Device 5",
    temp: 25.19,
    humidity: 86.53,
    soilMoisture: 74.15,
    nitrogenLevel: 5.00,
    phosphorusLevel: 5.81,
    potassiumLevel: 1.56,
    updatedAt: "2025-02-26",
    actuatorStatus: [true, true, false, false, true]
  },
  {
    device: "Device 6",
    temp: 25.85,
    humidity: 83.30,
    soilMoisture: 52.74,
    nitrogenLevel: 5.50,
    phosphorusLevel: 2.84,
    potassiumLevel: 1.75,
    updatedAt: "2025-02-27",
    actuatorStatus: [false, false, true, true, false]
  },
  {
    device: "Device 6",
    temp: 26.26,
    humidity: 28.66,
    soilMoisture: 81.59,
    nitrogenLevel: 4.98,
    phosphorusLevel: 5.46,
    potassiumLevel: 2.20,
    updatedAt: "2025-02-28",
    actuatorStatus: [true, false, true, false, true]
  },
  {
    device: "Device 6",
    temp: 28.87,
    humidity: 47.29,
    soilMoisture: 93.52,
    nitrogenLevel: 3.61,
    phosphorusLevel: 1.65,
    potassiumLevel: 2.01,
    updatedAt: "2025-03-01",
    actuatorStatus: [false, true, false, true, false]
  },
  {
    device: "Device 7",
    temp: 29.79,
    humidity: 48.60,
    soilMoisture: 56.55,
    nitrogenLevel: 6.96,
    phosphorusLevel: 4.18,
    potassiumLevel: 9.15,
    updatedAt: "2025-03-02",
    actuatorStatus: [true, true, true, false, false]
  },
  {
    device: "Device 7",
    temp: 22.84,
    humidity: 38.70,
    soilMoisture: 45.78,
    nitrogenLevel: 4.22,
    phosphorusLevel: 5.00,
    potassiumLevel: 7.85,
    updatedAt: "2025-03-03",
    actuatorStatus: [false, false, true, true, true]
  },
  {
    device: "Device 7",
    temp: 28.38,
    humidity: 46.58,
    soilMoisture: 99.50,
    nitrogenLevel: 6.32,
    phosphorusLevel: 6.08,
    potassiumLevel: 6.94,
    updatedAt: "2025-03-04",
    actuatorStatus: [true, false, false, false, true]
  },
  {
    device: "Device 8",
    temp: 28.02,
    humidity: 82.43,
    soilMoisture: 85.25,
    nitrogenLevel: 8.27,
    phosphorusLevel: 5.06,
    potassiumLevel: 2.31,
    updatedAt: "2025-03-05",
    actuatorStatus: [false, true, true, false, false]
  },
  {
    device: "Device 8",
    temp: 21.94,
    humidity: 79.48,
    soilMoisture: 71.99,
    nitrogenLevel: 6.10,
    phosphorusLevel: 6.37,
    potassiumLevel: 2.38,
    updatedAt: "2025-03-06",
    actuatorStatus: [true, false, true, true, false]
  },
  {
    device: "Device 8",
    temp: 25.85,
    humidity: 84.87,
    soilMoisture: 49.77,
    nitrogenLevel: 7.03,
    phosphorusLevel: 5.10,
    potassiumLevel: 4.97,
    updatedAt: "2025-03-07",
    actuatorStatus: [false, true, false, true, true]
  },
  {
    device: "Device 9",
    temp: 25.77,
    humidity: 29.34,
    soilMoisture: 58.95,
    nitrogenLevel: 3.52,
    phosphorusLevel: 6.76,
    potassiumLevel: 7.13,
    updatedAt: "2025-03-08",
    actuatorStatus: [true, true, false, false, true]
  },
  {
    device: "Device 9",
    temp: 24.35,
    humidity: 65.42,
    soilMoisture: 42.18,
    nitrogenLevel: 5.75,
    phosphorusLevel: 3.89,
    potassiumLevel: 5.22,
    updatedAt: "2025-03-09",
    actuatorStatus: [false, false, true, true, false]
  },
  {
    device: "Device 9",
    temp: 27.91,
    humidity: 52.67,
    soilMoisture: 78.23,
    nitrogenLevel: 7.45,
    phosphorusLevel: 4.12,
    potassiumLevel: 3.78,
    updatedAt: "2025-03-10",
    actuatorStatus: [true, false, true, false, true]
  },
  {
    device: "Device 10",
    temp: 23.45,
    humidity: 38.92,
    soilMoisture: 63.41,
    nitrogenLevel: 6.78,
    phosphorusLevel: 5.34,
    potassiumLevel: 4.56,
    updatedAt: "2025-03-11",
    actuatorStatus: [false, true, false, true, false]
  },
  {
    device: "Device 10",
    temp: 26.78,
    humidity: 72.15,
    soilMoisture: 88.92,
    nitrogenLevel: 8.12,
    phosphorusLevel: 7.45,
    potassiumLevel: 2.67,
    updatedAt: "2025-03-12",
    actuatorStatus: [true, true, true, false, false]
  },
  {
    device: "Device 10",
    temp: 22.56,
    humidity: 45.78,
    soilMoisture: 52.34,
    nitrogenLevel: 5.23,
    phosphorusLevel: 6.78,
    potassiumLevel: 7.89,
    updatedAt: "2025-03-13",
    actuatorStatus: [false, false, true, true, true]
  }
];

  useEffect(() => {
    setDatas(staticData);
    setFilteredData([]);
  }, []);

  useEffect(() => {
    const activeData = filteredData.length > 0 ? filteredData : datas;
    if (activeData.length > 0) {
      analyzeData(activeData, dataTypes[currentIndex].key as keyof DataType);
    } else {
      setStats({ avg: 0, min: 0, max: 0, trend: 0 });
    }
  }, [currentIndex, filteredData, datas]);

  const analyzeData = (data: DataType[], type: keyof DataType) => {
    const values = data.map((item) => item[type] as number);
    if (values.length === 0) {
      setStats({ avg: 0, min: 0, max: 0, trend: 0 });
      return;
    }
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const trend = values[values.length - 1] - values[0];
    setStats({ avg, min, max, trend });
  };

  const applyDateFilter = () => {
    if (!startDate || !endDate) {
      setFilteredData([]);
      return;
    }
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (isNaN(start) || isNaN(end) || start > end) {
      alert("Please enter valid start and end dates (yyyy-mm-dd) with start <= end.");
      return;
    }
    const result = datas.filter((item) => {
      const itemTime = new Date(item.updatedAt).getTime();
      return itemTime >= start && itemTime <= end;
    });
    setFilteredData(result);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const displayedData = filteredData.length > 0 ? filteredData : datas;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Live Data Statistics</Text>

          {/* Date Filter */}
          <View style={styles.dateFilterContainer}>
            <TextInput
              placeholder="Start Date (yyyy-mm-dd)"
              placeholderTextColor={theme.colors.secondaryText}
              style={[styles.dateInput, { color: theme.colors.text, borderColor: theme.colors.primary }]}
              value={startDate}
              onChangeText={setStartDate}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              placeholder="End Date (yyyy-mm-dd)"
              placeholderTextColor={theme.colors.secondaryText}
              style={[styles.dateInput, { color: theme.colors.text, borderColor: theme.colors.primary }]}
              value={endDate}
              onChangeText={setEndDate}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
              onPress={applyDateFilter}
              activeOpacity={0.8}
            >
              <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Data Type Selector */}
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => (prev - 1 + dataTypes.length) % dataTypes.length)}
              style={[styles.arrowButton, { backgroundColor: theme.colors.primary }]}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.dataTypeContainer}>
              <Text style={[styles.dataTypeName, { color: theme.colors.text }]}>
                {dataTypes[currentIndex].name}
              </Text>
              <Text style={[styles.dataTypeUnit, { color: theme.colors.secondaryText }]}>
                ({dataTypes[currentIndex].unit})
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => (prev + 1) % dataTypes.length)}
              style={[styles.arrowButton, { backgroundColor: theme.colors.primary }]}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-forward" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Statistical Summary */}
          <View style={[styles.summaryContainer, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.statItem}>
              <Ionicons name="stats-chart" size={20} color="#4CAF50" />
              <Text style={[styles.statText, { color: theme.colors.text }]}>Avg: {stats.avg.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={20} color="#FF5722" />
              <Text style={[styles.statText, { color: theme.colors.text }]}>Max: {stats.max.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-down" size={20} color="#2196F3" />
              <Text style={[styles.statText, { color: theme.colors.text }]}>Min: {stats.min.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name={stats.trend > 0 ? "arrow-up" : "arrow-down"}
                size={20}
                color={stats.trend > 0 ? "#4CAF50" : "#F44336"}
              />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                Trend: {stats.trend > 0 ? "Increasing" : "Decreasing"}
              </Text>
            </View>
          </View>

          {/* Chart with Axis Labels */}
          <View style={styles.chartWrapper}>
            {/* Y-axis label */}
            <View style={styles.yAxisLabelContainer}>
              <Text style={[styles.axisLabel, {color: theme.colors.text}]}>
                {dataTypes[currentIndex].name} ({dataTypes[currentIndex].unit})
              </Text>
            </View>
            
            {/* Main Chart */}
            <LineChart
              data={{
                labels: displayedData.map((_, i) => (i + 1).toString()),
                datasets: [
                  {
                    data: displayedData.map(
                      (item) => item[dataTypes[currentIndex].key as keyof DataType] as number
                    ),
                  },
                ],
              }}
              width={screenWidth - 60} // Adjusted for label space
              height={300}
              yAxisLabel={dataTypes[currentIndex].unit === "°C" ? "°" : dataTypes[currentIndex].unit + " "}
              yAxisSuffix=""
              yAxisInterval={1}
              fromZero={false}
              chartConfig={{
                backgroundColor: theme.colors.cardBackground,
                backgroundGradientFrom: theme.colors.primary,
                backgroundGradientTo: theme.colors.primary,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#fff",
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
          
          {/* X-axis label */}
          <View style={styles.xAxisLabelContainer}>
            <Text style={[styles.XaxisLabel, {color: theme.colors.text}]}>
              Data Points (Time Series)
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dateFilterContainer: {
    width: "100%",
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  applyButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  arrowButton: {
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  dataTypeContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  dataTypeName: {
    fontSize: 20,
    fontWeight: "600",
  },
  dataTypeUnit: {
    fontSize: 14,
    marginTop: 4,
  },
  summaryContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    elevation: 3,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginVertical: 8,
  },
  statText: {
    fontSize: 16,
    marginLeft: 8,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  yAxisLabelContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }],
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  xAxisLabelContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  XaxisLabel:{
    fontSize:12,
    fortWeight: 'bold',
    textAlign: 'center',
  },
});

export default StatisticsDisplay;