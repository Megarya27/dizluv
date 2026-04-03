import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, Mail, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-20">
        <View className="items-center mb-10">
          <Text className="text-primary text-5xl font-bold mb-2">Dizluv</Text>
          <Text className="text-slate-400 text-lg">Connect deeper, see better.</Text>
        </View>

        <View className="space-y-4">
          <Text className="text-white text-3xl font-bold mb-6">Welcome Back</Text>

          {error ? (
            <Text className="text-red-500 bg-red-500/10 p-3 rounded-lg mb-4">{error}</Text>
          ) : null}

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
            onPress={handleLogin}
            disabled={loading}
            className="bg-primary rounded-xl p-4 flex-row justify-center items-center mt-4"
          >
            <Text className="text-white text-lg font-bold mr-2">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
            {!loading && <ArrowRight size={20} color="white" />}
          </TouchableOpacity>

          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-slate-400 text-sm">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-end pb-10">
          <View className="flex-row justify-center items-center mb-6">
            <View className="h-[1px] bg-slate-800 flex-1" />
            <Text className="text-slate-500 mx-4 text-xs font-semibold">OR CONTINUE WITH</Text>
            <View className="h-[1px] bg-slate-800 flex-1" />
          </View>

          <TouchableOpacity 
             className="bg-white rounded-xl p-4 flex-row justify-center items-center mb-6"
             onPress={() => alert("Google sign-in structural implementation only.")}
          >
            <Text className="text-slate-900 text-base font-bold">Sign in with Google</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-slate-400 text-base">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text className="text-primary text-base font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
