import { router } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import CategoryChip from "../../components/category-chip";
import DoctorCard from "../../components/doctor-card";
import SearchBar from "../../components/search-bar";

import { COLORS } from "../../constants/theme";
import { Doctor } from "../../data/doctors";
import api from "../../services/api";


export default function HomeScreen() {

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [searchText, setSearchText] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadDoctors = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get("/doctors");


        const formattedDoctors =
          response.data.map(
            (doctor: any) => ({

              id:
                doctor.id.toString(),

              name:
                doctor.name,

              specialization:
                doctor.specialization,

              qualification:
                doctor.qualification,

              experience:
                doctor.experience,

              hospital:
                doctor.hospital,

              location:
                doctor.location,

              fee:
                doctor.fee,

              rating:
                Number(doctor.rating),

              availability:
                doctor.availability,

              imageUrl:
                doctor.image_url,

              about:
                doctor.about,

              languages:
                doctor.languages,

            })
          );


        setDoctors(formattedDoctors);


      } catch(error) {

        console.log(
          "Doctor API Error:",
          error
        );


        setError(
          "Unable to load doctors"
        );


      } finally {

        setLoading(false);

      }

    },
    []
  );


  useEffect(() => {

    loadDoctors();

  }, [loadDoctors]);



  const doctorCategories =
    useMemo(() => {

      const categories =
        doctors.map(
          (doctor) =>
            doctor.specialization
        );


      return [
        "All",
        ...Array.from(
          new Set(categories)
        ),
      ];


    }, [doctors]);



  const filteredDoctors =
    useMemo(() => {

      const query =
        searchText
        .trim()
        .toLowerCase();


      return doctors.filter(
        (doctor) => {

          const matchesSearch =
            doctor.name
            .toLowerCase()
            .includes(query)

            ||

            doctor.specialization
            .toLowerCase()
            .includes(query)

            ||

            doctor.hospital
            .toLowerCase()
            .includes(query);



          const matchesCategory =
            selectedCategory === "All"
            ||
            doctor.specialization ===
            selectedCategory;



          return (
            matchesSearch &&
            matchesCategory
          );

        }
      );


    },
    [
      doctors,
      searchText,
      selectedCategory
    ]
  );



  const handleDoctorPress =
    (doctor: Doctor) => {

      router.push({

        pathname:
          "../doctor/[id]",

        params:{
          id: doctor.id,
        },

      });

    };



  if(loading){

    return(

      <SafeAreaView
        style={styles.screen}
      >

        <View
          style={styles.stateContainer}
        >

          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text
            style={styles.stateText}
          >
            Loading doctors...
          </Text>


        </View>

      </SafeAreaView>

    );

  }



  if(error){

    return(

      <SafeAreaView
        style={styles.screen}
      >

        <View
          style={styles.stateContainer}
        >

          <Text
            style={styles.errorTitle}
          >
            {error}
          </Text>


          <Pressable
            style={styles.retryButton}
            onPress={loadDoctors}
          >

            <Text
              style={styles.retryText}
            >
              Retry
            </Text>


          </Pressable>


        </View>

      </SafeAreaView>

    );

  }



  return (

    <SafeAreaView
      style={styles.screen}
    >


      <View
        style={styles.header}
      >

        <Text
          style={styles.backText}
          onPress={() =>
            router.replace("/(tabs)")
          }
        >
          ‹ Back to Dashboard
        </Text>


        <View
          style={styles.headerTopRow}
        >

          <View>

            <Text
              style={styles.brandName}
            >
              HelloDoc
            </Text>


            <Text
              style={styles.tagline}
            >
              We secure your health
            </Text>


          </View>


          <View
            style={styles.profileCircle}
          >

            <Text
              style={styles.profileText}
            >
              P
            </Text>

          </View>


        </View>



        <Text
          style={styles.welcomeText}
        >
          Find the right doctor
        </Text>


        <Text
          style={styles.welcomeSubtext}
        >
          Search trusted specialists and start a secure consultation.
        </Text>


      </View>



      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search name, speciality or hospital"
      />



      <View
        style={styles.categorySection}
      >

        <FlatList

          data={doctorCategories}

          keyExtractor={(item)=>item}

          horizontal

          showsHorizontalScrollIndicator={false}

          contentContainerStyle={
            styles.categoryList
          }


          renderItem={({item})=>(

            <CategoryChip

              title={item}

              selected={
                selectedCategory===item
              }

              onPress={()=>
                setSelectedCategory(item)
              }

            />

          )}

        />

      </View>




      <View
        style={styles.resultHeader}
      >

        <Text
          style={styles.resultText}
        >
          {filteredDoctors.length} doctors found
        </Text>


      </View>




      <FlatList

        data={filteredDoctors}

        keyExtractor={(item)=>item.id}

        renderItem={({item})=>(

          <DoctorCard

            doctor={item}

            onPress={handleDoctorPress}

          />

        )}

        contentContainerStyle={
          styles.doctorList
        }

        ListEmptyComponent={

          <View
            style={styles.emptyBox}
          >

            <Text
              style={styles.emptyTitle}
            >
              No doctors found
            </Text>

          </View>

        }

      />


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
paddingHorizontal:20,
paddingTop:20,
paddingBottom:26,
borderBottomLeftRadius:28,
borderBottomRightRadius:28,
},

backText:{
fontSize:14,
fontWeight:"600",
color:"#CCFBF1",
marginBottom:14,
},

headerTopRow:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
},

brandName:{
fontSize:22,
fontWeight:"900",
color:"#fff",
},

tagline:{
fontSize:11,
color:"#99F6E4",
},

profileCircle:{
width:42,
height:42,
borderRadius:21,
backgroundColor:COLORS.primary,
alignItems:"center",
justifyContent:"center",
},

profileText:{
color:"#fff",
fontWeight:"800",
},

welcomeText:{
fontSize:26,
fontWeight:"900",
color:"#fff",
marginTop:28,
},

welcomeSubtext:{
fontSize:13,
color:"#D9F9F4",
marginTop:7,
},

categorySection:{
backgroundColor:COLORS.surface,
paddingBottom:12,
},

categoryList:{
paddingHorizontal:16,
},

resultHeader:{
padding:16,
},

resultText:{
fontSize:13,
fontWeight:"600",
color:COLORS.textSecondary,
},

doctorList:{
paddingBottom:30,
},

emptyBox:{
alignItems:"center",
padding:60,
},

emptyTitle:{
fontSize:18,
fontWeight:"700",
},

stateContainer:{
flex:1,
justifyContent:"center",
alignItems:"center",
},

stateText:{
marginTop:10,
color:COLORS.textSecondary,
},

errorTitle:{
fontSize:18,
fontWeight:"700",
color:"red",
},

retryButton:{
marginTop:20,
backgroundColor:COLORS.primary,
paddingHorizontal:25,
paddingVertical:12,
borderRadius:10,
},

retryText:{
color:"#fff",
fontWeight:"700",
},

categoryName:{
color:COLORS.primary,
},

});