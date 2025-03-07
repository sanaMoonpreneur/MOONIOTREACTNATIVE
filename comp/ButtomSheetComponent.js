import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Modalize } from 'react-native-modalize'

const BottomSheetComponent = ({ visible, onClose, onSelect }) => {
  if (!visible) {
    return null;
  }

  const handleSelection = (itemType) => {
    onSelect(itemType);
    onClose();
  };

  return (

    <View style={styles.container}>
      <Modalize
        handleStyle={{
          marginTop: 30,
          backgroundColor: "#e9e9e9",
          width: 80
        }}
        modalStyle={{
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
        }}
        alwaysOpen={570}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Add Item</Text>
          
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => handleSelection("Button")}
          >
            <Text style={styles.optionText}>Button</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

      </Modalize>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",


  },
  content: {
    backgroundColor: "white",
    marginTop: 40,
    width: '90%',
    marginLeft: 10

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#345c74'

  },
  optionContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: '#345c74'
  },
  closeButton: {
    backgroundColor: "#F19895",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default BottomSheetComponent;
