import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './contexts/ThemeContext';


const BottomMenu = ({ currentPage, onPageChange, userRole, onGoToLanding }) => {
  const { theme, isDark } = useTheme();

  const menuItems = [
    { id: 'dashboard', icon: 'home', label: 'Início' },
    { id: 'activities', icon: 'book', label: 'Atividades' },
    { id: 'notifications', icon: 'notifications', label: 'Avisos' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
    { id: 'settings', icon: 'settings', label: 'Config' },
  ];

  const roleColors = {
    teacher: theme?.colors?.info || '#1e40af',
    guardian: theme?.colors?.secondary || '#7c3aed',
    admin: theme?.colors?.textSecondary || '#6b7280',
    student: theme?.colors?.primary || '#15803d',
  };

  const getRoleColor = () => roleColors[userRole] || roleColors.student;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? theme?.colors?.surface : theme?.colors?.surface, borderTopColor: theme?.colors?.border }]}>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={() => onPageChange(item.id)}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={currentPage === item.id ? getRoleColor() : (isDark ? theme?.colors?.textSecondary : theme?.colors?.textSecondary)}
          />
          <Text
            style={[
              styles.menuLabel,
              { 
                color: currentPage === item.id ? getRoleColor() : (isDark ? theme?.colors?.textSecondary : theme?.colors?.textSecondary)
              }
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomMenu;