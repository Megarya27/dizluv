import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth, isSimulation } from '@/lib/firebase';
import { BlurView } from 'expo-blur';
import { MessageSquare, Users, Sparkles } from 'lucide-react-native';

interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  messageCount: number;
  otherUserName?: string;
  otherUserPhoto?: string;
}

const MOCK_CHATS = [
  { id: '1', participants: ['demo_user', 'ai_1'], lastMessage: 'The hike was amazing!', messageCount: 2, otherUserName: 'Maya', otherUserPhoto: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', participants: ['demo_user', 'ai_2'], lastMessage: 'Maybe next Sunday?', messageCount: 8, otherUserName: 'Liam', otherUserPhoto: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', participants: ['demo_user', 'ai_3'], lastMessage: 'Start the conversation...', messageCount: 0, otherUserName: 'Secret Match', otherUserPhoto: 'https://i.pravatar.cc/150?u=3' },
];

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isSimulation) {
      setChats(MOCK_CHATS as Chat[]);
      setLoading(false);
      return;
    }
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList: Chat[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      setChats(chatList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const renderChatItem = ({ item }: { item: Chat }) => {
    // Determine blur intensity based on message count (max 100, min 0)
    const blurIntensity = Math.max(0, 100 - (item.messageCount * 10));

    return (
      <TouchableOpacity 
        onPress={() => router.push(`/chat/${item.id}`)}
        className="flex-row items-center p-4 bg-surface rounded-2xl mb-4"
      >
        <View className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image 
            source={{ uri: item.otherUserPhoto || 'https://i.pravatar.cc/150?u=' + item.id }} 
            className="w-full h-full"
          />
          {blurIntensity > 0 && (
            <BlurView intensity={blurIntensity} style={StyleSheet.absoluteFill} tint="dark" />
          )}
        </View>
        
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-white text-lg font-bold">
              {item.otherUserName || 'Secret Match'}
            </Text>
            <Text className="text-slate-500 text-xs">
              {item.messageCount} msgs
            </Text>
          </View>
          <Text className="text-slate-400" numberOfLines={1}>
            {item.lastMessage || 'Start the conversation...'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#FE3C72" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-10">
      <View className="flex-row justify-between items-center mb-8 px-2">
        <View>
          <Text className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-xs">Your Connections</Text>
          <Text className="text-white text-3xl font-bold">Dizluv Chats</Text>
        </View>
        <TouchableOpacity className="bg-surface p-3 rounded-full">
          <Sparkles size={24} color="#FE3C72" />
        </TouchableOpacity>
      </View>

      {chats.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="bg-surface p-8 rounded-full mb-6">
            <MessageSquare size={64} color="#334155" />
          </View>
          <Text className="text-white text-xl font-bold text-center mb-2">No matches yet</Text>
          <Text className="text-slate-400 text-center">
            Complete your profile and start discovering people who share your passions.
          </Text>
          <TouchableOpacity 
            className="bg-primary rounded-xl px-8 py-4 mt-10"
            onPress={() => alert("Mocking a match...")}
          >
            <Text className="text-white font-bold text-lg">Find Matches</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
