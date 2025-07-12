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
import { Axios } from "../../AxiosRequestBuilder";
import { useLocalSearchParams } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const dataTypes = [
  { key: "temperature", name: "T", unit: "°C" },
  { key: "humidity", name: "H", unit: "%" },
  { key: "soilMoisture", name: "SM", unit: "%" },
  { key: "nitrogenLevel", name: "N", unit: "ppm" },
  { key: "phosphorusLevel", name: "P", unit: "ppm" },
  { key: "potassiumLevel", name: "K", unit: "ppm" },
];

const StatisticsDisplay: React.FC = () => {
  const { theme } = themeAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ avg: 0, min: 0, max: 0, trend: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataFromBackend, setDataFromBackend] = useState<any[]>([]);
  const params = useLocalSearchParams();
  const deviceId = params.deviceId ? JSON.parse(params.deviceId as string) : null;

  // Validate date format and logical correctness
  const isValidDate = (dateStr: string) => {
    // Check format yyyy-mm-dd
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(dateStr)) return false;
    // Check if date is valid
    const date = new Date(dateStr);
    return dateStr === date.toISOString().slice(0, 10);
  };

  const fetchFilteredData = async () => {
    if (!startDate || !endDate) {
      alert("Please enter both start and end dates.");
      return;
    }
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      alert("Please enter valid dates in yyyy-mm-dd format.");
      return;
    }

    try {
      console.log(deviceId, startDate, endDate);
      
      const res = await Axios.get(`/sensors/summary/${deviceId}`, {
        params: {
          startDate,
          endDate
        }
      });
      setDataFromBackend(res.data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      alert("Failed to fetch data. Please check the server.");
    }
  };

  useEffect(() => {
    // Fetch data from today to previous month same date on mount
    const today = new Date();
    const prevMonth = new Date(today);
    prevMonth.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date) =>
      date.toISOString().slice(0, 10);

    setStartDate(formatDate(prevMonth));
    setEndDate(formatDate(today));

    console.log(`Fetching data from ${formatDate(prevMonth)} to ${formatDate(today)}`);
    setDataFromBackend([]); // Reset data before fetching new data
    const fetchData = async () => {
      try {
        const res = await Axios.get(`/sensors/summary/${deviceId}`, {
          params: {
            startDate: formatDate(prevMonth),
            endDate: formatDate(today)
          }
        });
        setDataFromBackend(res.data);
        console.log("Fetched data:", res.data);
        
      } catch (error) {
        console.error("Error fetching sensor data:", error); 
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dataFromBackend.length > 0) {
      analyzeData(dataFromBackend, dataTypes[currentIndex].key);
    } else {
      setStats({ avg: 0, min: 0, max: 0, trend: 0 });
    }
  }, [currentIndex, dataFromBackend]);

  const analyzeData = (data: any[], key: string) => {
    const values = data.map((item) => item[key]);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const trend = values[values.length - 1] - values[0];
    setStats({ avg, min, max, trend });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const displayedParam = dataTypes[currentIndex].key;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
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
              placeholderTextColor="#999"
              style={[styles.dateInput, { color: theme.colors.text, borderColor: theme.colors.text }]}
              value={startDate}
              onChangeText={setStartDate}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              placeholder="End Date (yyyy-mm-dd)"
              placeholderTextColor="#999"
              style={[styles.dateInput, { color: theme.colors.text, borderColor: theme.colors.text }]}
              value={endDate}
              onChangeText={setEndDate}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
              onPress={fetchFilteredData}
            >
              <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Parameter Selector */}
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => (prev - 1 + dataTypes.length) % dataTypes.length)}
              style={[styles.arrowButton, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.dataTypeContainer}>
              <Text style={[styles.dataTypeName, { color: theme.colors.text }]}>
                {dataTypes[currentIndex].name}
              </Text>
              <Text style={[styles.dataTypeUnit, { color: theme.colors.text }]}>
                ({dataTypes[currentIndex].unit})
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setCurrentIndex((prev) => (prev + 1) % dataTypes.length)}
              style={[styles.arrowButton, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons name="arrow-forward" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Stats Summary */}
          <View style={[styles.summaryContainer, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.statItem}>
              <Ionicons name="stats-chart" size={20} color="#4CAF50" />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                Avg: {stats.avg.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={20} color="#FF5722" />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                Max: {stats.max.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-down" size={20} color="#2196F3" />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                Min: {stats.min.toFixed(2)}
              </Text>
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

          {/* Line Chart */}
          {dataFromBackend.length > 0 && (
            <>
              <View style={styles.chartWrapper}>
                <View style={styles.yAxisLabelContainer}>
                  <Text style={[styles.axisLabel, { color: theme.colors.text }]}>
                    {dataTypes[currentIndex].name} ({dataTypes[currentIndex].unit})
                  </Text>
                </View>

                <LineChart
                  data={{
                    labels: dataFromBackend.map((d) => d.date.substring(5)),
                    datasets: [{ data: dataFromBackend.map((d) => d[displayedParam]) }]
                  }}
                  width={screenWidth - 60}
                  height={300}
                  yAxisSuffix=""
                  yAxisInterval={1}
                  fromZero={false}
                  chartConfig={{
                    backgroundColor: theme.colors.cardBackground,
                    backgroundGradientFrom: theme.colors.primary,
                    backgroundGradientTo: theme.colors.primary,
                    decimalPlaces: 2,
                    color: (opacity = 1) => theme.dark ? `rgba(255,255,255,${opacity})`: `rgba(0,0,0,${opacity})`,
                    labelColor: (opacity = 1) => theme.dark ? `rgba(255,255,255,${opacity})`: `rgba(0,0,0,${opacity})`,
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

              <View style={styles.xAxisLabelContainer}>
                <Text style={[styles.XaxisLabel, { color: theme.colors.text }]}>
                  Date (Time Series)
                </Text>
              </View>
            </>
          )}
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  yAxisLabelContainer: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: "bold",
    transform: [{ rotate: "-90deg" }],
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  xAxisLabelContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  XaxisLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default StatisticsDisplay;