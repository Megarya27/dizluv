import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Image, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { BlurView } from 'expo-blur';
import { Send, Sparkles, X, User } from 'lucide-react-native';
import { calculateBlurIntensity } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [loadingHints, setLoadingHints] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [otherUser, setOtherUser] = useState<any>(null);
  
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id || !auth.currentUser) return;

    // Fetch chat metadata and current message count
    const chatRef = doc(db, 'chats', id as string);
    const unsubscribeChat = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessageCount(data.messageCount || 0);
        // Normally we'd fetch the other participant's data here
        setOtherUser({
          name: data.otherUserName || 'Match',
          photo: data.otherUserPhoto || 'https://i.pravatar.cc/150?u=' + id,
        });
      }
    });

    // Real-time messages
    const q = query(
      collection(db, 'chats', id as string, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [id]);

  const handleSend = async () => {
    if (!inputText.trim() || !auth.currentUser || !id) return;

    const chatRef = doc(db, 'chats', id as string);
    const messageData = {
      text: inputText,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || 'Me',
      createdAt: serverTimestamp(),
    };

    try {
      // Add message to subcollection
      await addDoc(collection(db, 'chats', id as string, 'messages'), messageData);
      
      // Update message count in chat document (triggers unblur)
      await updateDoc(chatRef, {
        lastMessage: inputText,
        messageCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getAIHints = async () => {
    setLoadingHints(true);
    setShowHints(true);
    try {
      const chatMessages = messages.map(m => ({
        sender: m.senderId === auth.currentUser?.uid ? 'User' : 'Match',
        text: m.text
      }));

      const response = await fetch('/api/wingman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages }),
      });
      const data = await response.json();
      if (data.starters) {
        setHints(data.starters);
      }
    } catch (error) {
      console.error("AI Hints Error:", error);
    } finally {
      setLoadingHints(false);
    }
  };

  const blurIntensity = calculateBlurIntensity(messageCount);

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === auth.currentUser?.uid;
    return (
      <View className={`mb-4 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
        <View 
          className={`px-4 py-3 rounded-2xl max-w-[80%] ${
            isMe ? 'bg-primary' : 'bg-surface'
          }`}
        >
          <Text className="text-white text-base leading-relaxed">{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-background"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header Profile Summary (Blurred) */}
      <View className="flex-row items-center p-4 border-b border-slate-800 bg-background/50">
        <View className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image source={{ uri: otherUser?.photo }} className="w-full h-full" />
          {blurIntensity > 0 && (
             <BlurView intensity={blurIntensity} style={StyleSheet.absoluteFill} tint="dark" />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">{otherUser?.name}</Text>
          <Text className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
            {blurIntensity === 0 ? 'Fully Revealed' : `${blurIntensity}% Blurred`}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={getAIHints}
          className="bg-primary/10 border border-primary/20 p-2 rounded-full flex-row items-center"
        >
          <Sparkles size={20} color="#FE3C72" className="mr-1" />
          <Text className="text-primary text-xs font-bold px-1">Wingman</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* AI Hints Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHints}
        onRequestClose={() => setShowHints(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface rounded-t-3xl p-6 pb-12">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Sparkles size={24} color="#FE3C72" />
                <Text className="text-white text-xl font-bold ml-2">Wingman's Advice</Text>
              </View>
              <TouchableOpacity onPress={() => setShowHints(false)} className="p-1">
                <X size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {loadingHints ? (
              <View className="py-10 items-center">
                <Text className="text-slate-400 mb-4 animate-pulse">Analyzing the vibe...</Text>
              </View>
            ) : (
              <View className="space-y-4">
                {hints.map((hint, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => {
                      setInputText(hint);
                      setShowHints(false);
                    }}
                    className="bg-slate-800 border border-slate-700/50 p-4 rounded-xl active:bg-slate-700"
                  >
                    <Text className="text-white text-base">"{hint}"</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text className="text-slate-500 text-xs text-center mt-6">
              Tap a suggestion to use it as your next message.
            </Text>
          </View>
        </View>
      </Modal>

      <View className="p-4 bg-surface border-t border-slate-800">
        <View className="flex-row items-center bg-slate-900 rounded-full px-4 py-1">
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#64748B"
            className="flex-1 text-white py-3 pr-4"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity 
            onPress={handleSend}
            disabled={!inputText.trim()}
            className={`${inputText.trim() ? 'bg-primary' : 'bg-slate-800'} p-2 rounded-full`}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
