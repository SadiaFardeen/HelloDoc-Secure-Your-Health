import React from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useApp } from "../Context/AppContext";

export default function PrescriptionList() {
  const { prescriptions } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Saved Prescriptions
      </Text>

      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.patient}>
              {item.patientName}
            </Text>

            <Text style={styles.heading}>
              Medicines
            </Text>

            {item.medicines.map((m, i) => (
              <Text key={i}>
                • {m}
              </Text>
            ))}

            <Text style={styles.heading}>
              Notes
            </Text>

            <Text>{item.notes}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8FAFC",
padding:20
},

title:{
fontSize:28,
fontWeight:"bold",
marginBottom:20
},

card:{
backgroundColor:"#fff",
padding:20,
borderRadius:12,
marginBottom:15
},

patient:{
fontSize:18,
fontWeight:"bold",
marginBottom:10
},

heading:{
marginTop:10,
fontWeight:"bold"
}

});