import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DOCTORS,
  DOCTOR_CATEGORIES,
  Doctor,
} from "../../data/doctors";

export default function DoctorListScreen() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesCategory =
      selectedCategory === "All" ||
      doc.specialization === selectedCategory;

    const matchesSearch =
      doc.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      doc.specialization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      doc.hospital
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDoctorPress = (doctor: Doctor) => {
    router.push({
      pathname: "/doctor/[id]",
      params: {
        id: doctor.id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backBtnText}>
          ← Back to Dashboard
        </Text>
      </TouchableOpacity>

      <Text style={styles.header}>
        Find Your Doctor
      </Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search doctor, specialty, hospital..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {DOCTOR_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                selectedCategory === cat &&
                  styles.activeCategoryBtn,
              ]}
              onPress={() =>
                setSelectedCategory(cat)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat &&
                    styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({
          item,
        }: {
          item: Doctor;
        }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              handleDoctorPress(item)
            }
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.specialty}>
                {item.specialization} •{" "}
                {item.qualification}
              </Text>

              <Text style={styles.subInfo}>
                {item.hospital}, {item.location}
              </Text>

              <Text style={styles.subInfo}>
                Experience: {item.experience} Years
              </Text>

              <View style={styles.row}>
                <Text style={styles.rating}>
                  ⭐ {item.rating}
                </Text>

                <Text style={styles.fee}>
                  ৳{item.fee}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },

  backBtn: {
    marginTop: 10,
    marginBottom: 10,
  },

  backBtnText: {
    color: "#0284c7",
    fontWeight: "bold",
    fontSize: 15,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1e293b",
  },

  searchBar: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  categoryContainer: {
    height: 40,
    marginBottom: 15,
  },

  categoryBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    marginRight: 8,
    justifyContent: "center",
  },

  activeCategoryBtn: {
    backgroundColor: "#0284c7",
  },

  categoryText: {
    color: "#475569",
    fontWeight: "600",
  },

  activeCategoryText: {
    color: "#fff",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },

  specialty: {
    fontSize: 13,
    color: "#0284c7",
    fontWeight: "600",
    marginVertical: 2,
  },

  subInfo: {
    fontSize: 12,
    color: "#64748b",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  rating: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#f59e0b",
  },

  fee: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16a34a",
  },
});