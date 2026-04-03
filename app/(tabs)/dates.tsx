import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { MapPin, Star, Calendar, MessageSquare, Heart, X, CheckCircle } from 'lucide-react-native';

const venues = [
  {
    id: '1',
    name: 'The Glass House',
    type: 'French Fusion',
    rating: 4.8,
    reviews: 124,
    price: '$$$',
    address: '123 Crystal Ln, Downtown',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    description: 'A stunning architectural marvel offering panoramic city views and exquisite French-inspired cuisine.'
  },
  {
    id: '2',
    name: 'Velvet Jazz Loft',
    type: 'Jazz Bar & Cocktails',
    rating: 4.9,
    reviews: 89,
    price: '$$',
    address: '45 Blue Note St, West End',
    image: 'https://images.unsplash.com/photo-1514525253344-f252ea931661?auto=format&fit=crop&q=80&w=800',
    description: 'Immerse yourselves in soul-stirring jazz while sipping on award-winning artisanal cocktails in a cozy, velvet-lined loft.'
  },
  {
    id: '3',
    name: 'Sakura Garden',
    type: 'Zen Tea House',
    rating: 4.7,
    reviews: 56,
    price: '$',
    address: '7 Sakura Blvd, Uptown',
    image: 'https://images.unsplash.com/photo-1502404689324-741c7b22d1b0?auto=format&fit=crop&q=80&w=800',
    description: 'A tranquil escape from the city hustle. Enjoy traditional tea ceremonies and delicate wagashi in a serene garden setting.'
  },
  {
    id: '4',
    name: 'Midnight Library',
    type: 'Speakeasy',
    rating: 4.6,
    reviews: 210,
    price: '$$$',
    address: 'Secret Entrance, Old Town',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=800',
    description: 'Hidden behind a bookshelf, this speakeasy transports you to a bygone era of literary charm and sophisticated mixology.'
  }
];

export default function DatesScreen() {
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReserve = () => {
    setShowReservation(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedVenue(null);
    }, 3000);
  };

  const renderVenueItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => setSelectedVenue(item)}
      className="bg-surface rounded-3xl overflow-hidden mb-6"
    >
      <View className="h-48">
        <Image source={{ uri: item.image }} className="w-full h-full" />
        <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full flex-row items-center">
          <Star size={14} color="#FBBF24" />
          <Text className="text-white text-xs font-bold ml-1">{item.rating}</Text>
        </View>
        <TouchableOpacity className="absolute top-4 right-4 bg-black/60 p-2 rounded-full">
          <Heart size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text className="text-white text-xl font-bold">{item.name}</Text>
            <Text className="text-slate-400 text-sm">{item.type} • {item.price}</Text>
          </View>
        </View>
        <View className="flex-row items-center mt-2">
          <MapPin size={16} color="#475569" />
          <Text className="text-slate-500 text-sm ml-1">{item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background pt-10 px-4">
      <View className="mb-6 px-2">
        <Text className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-xs">Curated for Dizluv</Text>
        <Text className="text-white text-3xl font-bold">Perfect Dates</Text>
      </View>

      <FlatList
        data={venues}
        renderItem={renderVenueItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Venue Detail Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={!!selectedVenue}
        onRequestClose={() => setSelectedVenue(null)}
      >
        <View className="flex-1 bg-background">
          <ScrollView>
            <View className="h-96 relative">
              <Image source={{ uri: selectedVenue?.image }} className="w-full h-full" />
              <TouchableOpacity 
                onPress={() => setSelectedVenue(null)}
                className="absolute top-12 left-6 bg-black/60 p-3 rounded-full"
              >
                <X size={24} color="white" />
              </TouchableOpacity>
              <View className="absolute bottom-6 left-6 right-6">
                 <View className="bg-black/40 backdrop-blur-md p-4 rounded-2xl">
                    <Text className="text-white text-3xl font-bold mb-1">{selectedVenue?.name}</Text>
                    <View className="flex-row items-center">
                        <Star size={16} color="#FBBF24" />
                        <Text className="text-white font-bold ml-1">{selectedVenue?.rating}</Text>
                        <Text className="text-slate-300 ml-1">({selectedVenue?.reviews} reviews)</Text>
                    </View>
                 </View>
              </View>
            </View>

            <View className="p-6">
              <View className="flex-row space-x-4 mb-8">
                <View className="bg-surface px-4 py-3 rounded-2xl flex-row items-center">
                   <MapPin size={20} color="#FE3C72" />
                   <Text className="text-white ml-2">Downtown</Text>
                </View>
                <View className="bg-surface px-4 py-3 rounded-2xl flex-row items-center">
                   <Heart size={20} color="#FE3C72" />
                   <Text className="text-white ml-2">Romance</Text>
                </View>
              </View>

              <Text className="text-white text-xl font-bold mb-4">About the Venue</Text>
              <Text className="text-slate-400 text-lg leading-relaxed mb-8">
                {selectedVenue?.description}
              </Text>

              <View className="bg-surface p-6 rounded-3xl mb-10">
                <Text className="text-white text-lg font-bold mb-2">Location</Text>
                <Text className="text-slate-300 mb-4">{selectedVenue?.address}</Text>
                <View className="h-40 bg-slate-800 rounded-2xl items-center justify-center">
                   <Text className="text-slate-500 font-bold uppercase tracking-widest">Mock Map View</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="p-6 bg-background border-t border-slate-800">
            <TouchableOpacity 
              onPress={() => setShowReservation(true)}
              className="bg-primary rounded-2xl py-5 items-center flex-row justify-center"
            >
              <Calendar size={24} color="white" className="mr-2" />
              <Text className="text-white text-xl font-bold">Reserve Table</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reservation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showReservation}
          onRequestClose={() => setShowReservation(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/80 px-6">
            <View className="bg-surface w-full p-8 rounded-3xl">
              <Text className="text-white text-2xl font-bold text-center mb-6">Complete Reservation</Text>
              <Text className="text-slate-400 text-center mb-8">
                Are you sure you want to reserve a table at {selectedVenue?.name} for your next date?
              </Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity 
                   onPress={() => setShowReservation(false)}
                   className="flex-1 bg-slate-800 py-4 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={handleReserve}
                   className="flex-1 bg-primary py-4 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccess}
        >
          <View className="flex-1 justify-center items-center bg-black/80 px-6">
            <View className="bg-surface w-full p-10 rounded-3xl items-center">
              <View className="bg-green-500/10 p-6 rounded-full mb-6">
                <CheckCircle size={80} color="#10B981" />
              </View>
              <Text className="text-white text-3xl font-bold text-center mb-4">Reserved!</Text>
              <Text className="text-slate-400 text-center mb-8">
                Your reservation at {selectedVenue?.name} was successful. A confirmation has been sent to your email.
              </Text>
              <Text className="text-primary font-bold">Closing in 3 seconds...</Text>
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}
