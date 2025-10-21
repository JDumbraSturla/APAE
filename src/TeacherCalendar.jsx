import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from './contexts/ThemeContext';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

const TeacherCalendar = ({ user }) => {
  const { theme } = useTheme();

  const openGoogleCalendar = async () => {
    const url = 'https://calendar.google.com/calendar/r';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // fallback to web
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open calendar', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }] }>
        <Text style={[styles.title, { color: theme.colors.info }]}>Agenda</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Abrir Google Calendar</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Card>
          <View style={{ padding: 12 }}>
            <Text style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>Abrir a sua agenda do Google no navegador ou app.</Text>
            <Button onPress={openGoogleCalendar}>Abrir Google Calendar</Button>
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center' },
});

export default TeacherCalendar;
