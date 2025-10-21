import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const CustomSelect = ({ selectedValue, onValueChange, options, placeholder, value, onChange }) => {

  const [isOpen, setIsOpen] = useState(false);

  const currentValue = selectedValue || value;
  const currentOnChange = onValueChange || onChange;
  const selectedOption = options.find(option => option.value === currentValue);

  const handleSelect = (optionValue) => {
    currentOnChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity 
        style={[
          styles.selectButton, 
          { 
            backgroundColor: '#f9fafb', 
            borderColor: '#e5e7eb' 
          }
        ]} 
        onPress={() => setIsOpen(true)}
      >
        <Text style={[
          styles.selectText, 
          { 
            color: selectedOption ? '#111827' : '#9ca3af'
          }
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9ca3af" />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modal}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option, 
                    { borderBottomColor: '#e5e7eb' },
                    item.value === currentValue && { backgroundColor: '#f0fdf4' }
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                    styles.optionText, 
                    { 
                      color: item.value === currentValue ? '#15803d' : '#111827',
                      fontWeight: item.value === currentValue ? '600' : 'normal'
                    }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});

export default CustomSelect;