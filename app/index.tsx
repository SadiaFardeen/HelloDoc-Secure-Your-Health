import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (role === 'patient') {
      if (cleanEmail.includes('doctor')) {
        setErrorMsg('This email belongs to a Doctor account. Please switch to Doctor login.');
        return;
      }
      router.replace('/patient/dashboard');
    } else if (role === 'doctor') {
      if (cleanEmail.includes('patient')) {
        setErrorMsg('This email belongs to a Patient account. Please switch to Patient login.');
        return;
      }
      router.replace('/doctorDashboard/dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Hello<Text style={styles.titleHighlight}>Doc</Text>
        </Text>
        <Text style={styles.subtitle}>Welcome back! Please login to continue.</Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'patient' && styles.activeRole]}
          onPress={() => {
            setRole('patient');
            setErrorMsg('');
          }}
        >
          <Text style={role === 'patient' ? styles.activeText : styles.roleText}>Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleBtn, role === 'doctor' && styles.activeRole]}
          onPress={() => {
            setRole('doctor');
            setErrorMsg('');
          }}
        >
          <Text style={role === 'doctor' ? styles.activeText : styles.roleText}>Doctor</Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TextInput 
        style={styles.input} 
        placeholder={role === 'patient' ? "Patient Email (e.g. patient@mail.com)" : "Doctor Email (e.g. doctor@mail.com)"} 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Login as {role === 'patient' ? 'Patient' : 'Doctor'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#fff' },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  title: { 
    fontSize: 36, 
    fontWeight: '800', 
    color: '#1e293b', 
    letterSpacing: 0.5 
  },
  titleHighlight: { 
    color: '#0284c7' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#64748b', 
    marginTop: 6 
  },
  roleContainer: { flexDirection: 'row', marginBottom: 15, borderRadius: 8, backgroundColor: '#f0f0f0', padding: 4 },
  roleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeRole: { backgroundColor: '#0284c7' },
  roleText: { color: '#666', fontWeight: '600' },
  activeText: { color: '#fff', fontWeight: '600' },
  errorText: { color: '#dc3545', textAlign: 'center', marginBottom: 15, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15 },
  loginBtn: { backgroundColor: '#0284c7', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});