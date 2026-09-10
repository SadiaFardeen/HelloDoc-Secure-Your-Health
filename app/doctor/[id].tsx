import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/custom-button";
import { COLORS } from "../../constants/theme";
import { Doctor } from "../../data/doctors";
import api from "../../services/api";


export default function DoctorDetailsScreen() {

  const params = useLocalSearchParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;


  const [doctor, setDoctor] =
    useState<Doctor | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadDoctor = useCallback(
    async () => {

      if (!id) {
        setError("Doctor ID missing");
        setLoading(false);
        return;
      }


      try {

        setLoading(true);
        setError("");


        const response =
          await api.get(
            `/doctors/${id}`
          );


        const doctorData =
          response.data;


        const formattedDoctor: Doctor = {

          id:
            doctorData.id.toString(),

          name:
            doctorData.name,

          specialization:
            doctorData.specialization,

          qualification:
            doctorData.qualification,

          experience:
            doctorData.experience,

          hospital:
            doctorData.hospital,

          location:
            doctorData.location,

          fee:
            doctorData.fee,

          rating:
            Number(doctorData.rating),

          availability:
            doctorData.availability,

          imageUrl:
            doctorData.image_url,

          about:
            doctorData.about,

          languages:
            doctorData.languages,

        };


        setDoctor(
          formattedDoctor
        );


      } catch(error) {

        console.log(
          "Doctor details error:",
          error
        );

        setError(
          "Unable to load doctor information."
        );


      } finally {

        setLoading(false);

      }


    },
    [id]
  );



  useEffect(() => {

    loadDoctor();

  }, [loadDoctor]);



  const handleStartConsultation = () => {

    if (!doctor) return;


    router.push({

      pathname:
        "/consultation/[id]",

      params:{
        id: doctor.id,
      },

    });

  };



  const handleBookAppointment = () => {

    if (!doctor) return;


    router.push({

      pathname:
        "/(tabs)/booking",

      params:{

        doctorId:
          doctor.id,

        doctorName:
          doctor.name,

        specialty:
          doctor.specialization,

        fee:
          doctor.fee.toString(),

      },

    });

  };



  if(loading){

    return(

      <SafeAreaView style={styles.screen}>

        <View style={styles.center}>

          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.stateText}>
            Loading doctor profile...
          </Text>

        </View>

      </SafeAreaView>

    );

  }



  if(error || !doctor){

    return(

      <SafeAreaView style={styles.screen}>

        <View style={styles.center}>

          <Text style={styles.errorText}>
            {error || "Doctor not found"}
          </Text>


          <CustomButton
            title="Go Back"
            onPress={() =>
              router.back()
            }
          />

        </View>

      </SafeAreaView>

    );

  }



  return (

    <SafeAreaView style={styles.screen}>

      <View style={styles.header}>

        <Text
          style={styles.back}
          onPress={() =>
            router.back()
          }
        >
          ‹ Back
        </Text>


        <Text style={styles.headerTitle}>
          Doctor Profile
        </Text>

      </View>



      <ScrollView
        contentContainerStyle={styles.content}
      >


        <View style={styles.card}>


          <Image

            source={{
              uri: doctor.imageUrl,
            }}

            style={styles.image}

          />


          <Text style={styles.name}>
            {doctor.name}
          </Text>


          <Text style={styles.specialization}>
            {doctor.specialization}
          </Text>


          <Text style={styles.text}>
            {doctor.qualification}
          </Text>


          <Text style={styles.text}>
            ★ {doctor.rating}
            {"  "}
            {doctor.experience} years experience
          </Text>


          <Text style={styles.available}>
            ● {doctor.availability}
          </Text>


        </View>



        <View style={styles.card}>

          <Text style={styles.title}>
            Workplace
          </Text>


          <Text style={styles.text}>
            {doctor.hospital}
          </Text>


          <Text style={styles.text}>
            {doctor.location}
          </Text>


        </View>



        <View style={styles.card}>

          <Text style={styles.title}>
            About
          </Text>


          <Text style={styles.text}>
            {doctor.about}
          </Text>


        </View>



        <View style={styles.card}>

          <Text style={styles.title}>
            Languages
          </Text>


          <Text style={styles.text}>
            {doctor.languages?.join(", ")}
          </Text>


        </View>



        <View style={styles.card}>

          <Text style={styles.title}>
            Consultation Fee
          </Text>


          <Text style={styles.fee}>
            ৳{doctor.fee}
          </Text>


        </View>



        <CustomButton
          title="Start Consultation"
          onPress={
            handleStartConsultation
          }
          style={styles.button}
        />


        <CustomButton
          title="Book Appointment"
          variant="outline"
          onPress={
            handleBookAppointment
          }
          style={styles.button}
        />


      </ScrollView>


    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

screen:{
  flex:1,
  backgroundColor:COLORS.background,
},

header:{
  backgroundColor:COLORS.secondary,
  padding:20,
},

back:{
  color:"#CCFBF1",
  fontWeight:"600",
},

headerTitle:{
  color:"#fff",
  fontSize:22,
  fontWeight:"800",
  marginTop:8,
},

content:{
  padding:16,
},

card:{
  backgroundColor:COLORS.surface,
  padding:16,
  borderRadius:12,
  marginBottom:14,
},

image:{
  width:110,
  height:110,
  borderRadius:55,
  alignSelf:"center",
},

name:{
  fontSize:22,
  fontWeight:"800",
  textAlign:"center",
  marginTop:12,
},

specialization:{
  color:COLORS.primary,
  textAlign:"center",
  fontWeight:"700",
  marginTop:5,
},

title:{
  fontWeight:"800",
  marginBottom:8,
},

text:{
  color:COLORS.textSecondary,
  marginTop:5,
},

available:{
  color:"green",
  marginTop:8,
},

fee:{
  fontSize:24,
  fontWeight:"800",
  color:COLORS.primary,
},

button:{
  marginTop:10,
},

center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
},

stateText:{
  marginTop:10,
},

errorText:{
  color:"red",
  marginBottom:20,
},

});