import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { themeAuth } from '../../../Contexts/ThemeContext';

const supportTeam = [
  {
    name: 'Vithushan',
    phone: '+94 71 234 5678',
    email: 'vithushan@greentech.com',
  },
  {
    name: 'Jegatheesan',
    phone: '+94 77 987 6543',
    email: 'jegatheesan@greentech.com',
  },
  {
    name: 'Eniyavan',
    phone: '+94 75 321 4567',
    email: 'eniyavan@greentech.com',
  },
  {
    name: 'Rishopika',
    phone: '+94 76 789 1234',
    email: 'rishopika@greentech.com',
  },
];

const HelpSupportScreen = () => {
  const { theme } = themeAuth();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.header, { color: theme.colors.text }]}>📞 Help & Support</Text>
      <Text style={[styles.description, { color: theme.colors.text }]}>
        Need assistance? Our support team is here to help you with anything related to Green-Tech.
      </Text>

      {supportTeam.map((person, index) => (
        <View key={index} style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{person.name}</Text>
          <Text style={[styles.detail, { color: theme.colors.text }]}><Ionicons name="call" size={16} color="#10B981" /> {person.phone}</Text>
          <Text style={[styles.detail, { color: theme.colors.text }]}><Ionicons name="mail" size={16} color="#10B981" /> {person.email}</Text>
        </View>
      ))}

      <View style={styles.commonContact}>
        <Text style={styles.sectionTitle}>📧 Common Support Email</Text>
        <Text style={styles.commonEmail}>greenhouse.3yp@gmail.com</Text>
      </View>

      <Text style={styles.footer}>Thank you for choosing Green-Tech!</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#012A1C',
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#01694D',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderColor: '#10B981',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  detail: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34d399',
    marginTop: 30,
    marginBottom: 5,
    textAlign: 'center',
  },
  commonEmail: {
    fontSize: 16,
    color: '#a7f3d0',
    textAlign: 'center',
  },
  commonContact: {
    marginTop: 10,
  },
  footer: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 30,
    textAlign: 'center',
  },
});

export default HelpSupportScreen;
