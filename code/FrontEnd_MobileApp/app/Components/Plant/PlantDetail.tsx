// PlantDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { Text, Image, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePlantContext } from '../../../Contexts/PlantContext';
import { themeAuth } from '../../../Contexts/ThemeContext';

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
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    imageData: string;
    imageType: string;
    imageName: string;
}

const PlantDetail = () => {
    const {theme} = themeAuth();
    const {plants} = usePlantContext();
    const [plant, setPlant] = useState<Plant>({
        id: 0,
        name: '',
        description: '',
        temperatureLow: 0,
        temperatureHigh: 0,
        humidityLow: 0,
        humidityHigh: 0,
        moistureLow: 0,
        moistureHigh: 0,
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        imageData: '',
        imageType: '',
        imageName: ''
    });
    const params = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (params.plantId) {
            try {
                const plantId = JSON.parse(params.plantId as string);
                const foundPlant = plants?.find(plant => plant.id == plantId);
                
                if (foundPlant) {
                    setPlant(foundPlant);
                } else {
                    setPlant({
                        id: 0,
                        name: '',
                        description: '',
                        temperatureLow: 0,
                        temperatureHigh: 0,
                        humidityLow: 0,
                        humidityHigh: 0,
                        moistureLow: 0,
                        moistureHigh: 0,
                        nitrogen: 0,
                        phosphorus: 0,
                        potassium: 0,
                        imageData: '',
                        imageType: '',
                        imageName: ''
                    });
                }
            } catch (error) {
                console.error("Error parsing plant data:", error);
            }
        }
    }, [params.plant, refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
        setRefreshing(false);
        }, 1500);
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.colors.background}]}
                refreshControl={
                <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            >
            <Text style={[styles.title, {color: theme.colors.text}]}>{plant.name}</Text>
            <Image
                source={{ uri: `data:${plant.imageType};base64,${plant.imageData}` } }
                style={styles.image}
            />
            <Text style={[styles.label, {color: theme.colors.text}]}>Description:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{plant.description}</Text>

            <Text style={[styles.label, {color: theme.colors.text}]}>Temperature:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{plant.temperatureLow}°C - {plant.temperatureHigh}°C</Text>

            <Text style={[styles.label, {color: theme.colors.text}]}>Humidity:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{plant.humidityLow}% - {plant.humidityHigh}%</Text>

            <Text style={[styles.label, {color: theme.colors.text}]}>Moisture:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{plant.moistureLow}% - {plant.moistureHigh}%</Text>

            <Text style={[styles.label, {color: theme.colors.text}]}>Nitrogen:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{plant.nitrogen} mg/kg</Text>

            <Text style={[styles.label, {color: theme.colors.text}]}>Phosphorus:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{plant.phosphorus} mg/kg</Text>

            <Text style={[styles.label, {color: theme.colors.text}]}>Potassium:</Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>{plant.potassium} mg/kg</Text>
        </ScrollView>
    );
    };

const styles = StyleSheet.create({
container: {
    backgroundColor: '#012A1C',
    flex: 1,
    padding: 20,
},
title: {
    fontSize: 26,
    color: '#ccc',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
},
image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
},
label: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 10,
},
value: {
    color: '#ccc',
    fontSize: 17,
    marginBottom: 5,
},
});

export default PlantDetail;

