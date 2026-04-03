import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Lock, Mail, User, Phone, ArrowLeft } from 'lucide-react-native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      });

      // Redirect to onboarding
      router.replace('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-12 pb-10">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-surface w-10 h-10 rounded-full items-center justify-center mb-6"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
          <Text className="text-slate-400 text-base">Start your journey to deeper connections.</Text>
        </View>

        <View className="space-y-4">
          {error ? (
            <Text className="text-red-500 bg-red-500/10 p-3 rounded-lg mb-4">{error}</Text>
          ) : null}

          <View className="bg-surface rounded-xl p-4 flex-row items-center mb-4">
            <User size={20} color="#94A3B8" className="mr-3" />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              className="flex-1 text-white text-base"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="bg-surface rounded-xl p-4 flex-row items-center mb-4">
            <Mail size={20} color="#94A3B8" className="mr-3" />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#94A3B8"
              className="flex-1 text-white text-base"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="bg-surface rounded-xl p-4 flex-row items-center mb-4">
            <Phone size={20} color="#94A3B8" className="mr-3" />
            <TextInput
              placeholder="Phone number (optional)"
              placeholderTextColor="#94A3B8"
              className="flex-1 text-white text-base"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View className="bg-surface rounded-xl p-4 flex-row items-center mb-4">
            <Lock size={20} color="#94A3B8" className="mr-3" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              className="flex-1 text-white text-base"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            onPress={handleSignup}
            disabled={loading}
            className="bg-primary rounded-xl p-4 mt-6 items-center"
          >
            <Text className="text-white text-lg font-bold">
              {loading ? 'Creating Account...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-end pt-10">
          <View className="flex-row justify-center">
            <Text className="text-slate-400 text-base">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary text-base font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
