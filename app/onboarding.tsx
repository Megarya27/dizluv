import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Sparkles, MessageCircle, Heart, Star, ArrowRight } from 'lucide-react-native';

const questions = [
  { id: 1, text: "What's your ideal Sunday?", placeholder: "e.g. Hiking with coffee, or reading by the fire..." },
  { id: 2, text: "If you could have dinner with anyone, who?", placeholder: "e.g. Marie Curie, or my grandmother..." },
  { id: 3, text: "What's one thing you're passionate about?", placeholder: "e.g. Sustainable living, or ancient history..." },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      await generateBio();
    }
  };

  const generateBio = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();

      if (data.bio) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          bio: data.bio,
          onboardingComplete: true,
          answers,
        });
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error("Onboarding Error:", error);
      alert("Something went wrong during bio generation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[step];

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Sparkles size={48} color="#FE3C72" className="mb-6 animate-pulse" />
        <Text className="text-white text-2xl font-bold text-center mb-2">Crafting your story...</Text>
        <Text className="text-slate-400 text-center">Our AI is analyzing your answers to create a unique narrative bio for your profile.</Text>
        <ActivityIndicator size="large" color="#FE3C72" className="mt-8" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-background"
    >
      <View className="flex-1 px-8 pt-20">
        <View className="flex-row justify-between items-center mb-12">
          <View className="flex-row items-center">
            <Sparkles size={24} color="#FE3C72" />
            <Text className="text-white text-xl font-bold ml-2">Guided Onboarding</Text>
          </View>
          <Text className="text-slate-500 font-bold">{step + 1}/{questions.length}</Text>
        </View>

        <View className="mb-10">
          <Text className="text-white text-3xl font-bold mb-4">{currentQuestion.text}</Text>
          <View className="bg-surface rounded-2xl p-6 min-h-[150px]">
            <TextInput
              multiline
              placeholder={currentQuestion.placeholder}
              placeholderTextColor="#64748B"
              className="text-white text-lg leading-relaxed"
              value={answers[step]}
              onChangeText={(text) => {
                const newAnswers = [...answers];
                newAnswers[step] = text;
                setAnswers(newAnswers);
              }}
              autoFocus
            />
          </View>
        </View>

        <View className="flex-1 justify-end pb-12">
          <TouchableOpacity 
            onPress={handleNext}
            disabled={!answers[step].trim()}
            className={`rounded-2xl p-5 flex-row items-center justify-center ${answers[step].trim() ? 'bg-primary' : 'bg-slate-800'}`}
          >
            <Text className="text-white text-xl font-bold mr-2">
              {step === questions.length - 1 ? 'Generate Bio' : 'Next Question'}
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
