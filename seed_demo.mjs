import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase configuration (placeholders - user needs to provide or I use common test ones if I have them)
// Since I don't have the real keys, I can't seed their actual database.
// However, I can provide the script for them to run.
// Wait, I can try to use the environment variables if I have access to them in a script.

// But wait, the environment variables are in .env and I'm on Windows.
// I'll create a node script and use 'dotenv'.

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

async function seed() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const demoEmail = "demo@dizluv.com";
  const demoPassword = "Password123!";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
    const uid = userCredential.user.uid;

    // Create user profile
    await setDoc(doc(db, "users", uid), {
      uid,
      name: "Demo User",
      email: demoEmail,
      bio: "I love exploring high-tech concepts and modern dating apps.",
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    });

    // Create a mock match
    const chatId = "demo_chat_123";
    await setDoc(doc(db, "chats", chatId), {
      participants: [uid, "ai_match_1"],
      lastMessage: "Hey! Can't wait for our first date.",
      messageCount: 5,
      otherUserName: "Sophia",
      otherUserPhoto: "https://i.pravatar.cc/150?u=sophia",
      updatedAt: serverTimestamp(),
    });

    // Add some messages
    const msgsRef = collection(db, "chats", chatId, "messages");
    await addDoc(msgsRef, { text: "Hi! I really liked your bio.", senderId: "ai_match_1", createdAt: serverTimestamp() });
    await addDoc(msgsRef, { text: "Thanks Sophia! What's your ideal Sunday?", senderId: uid, createdAt: serverTimestamp() });
    await addDoc(msgsRef, { text: "Hiking with coffee, definitely.", senderId: "ai_match_1", createdAt: serverTimestamp() });

    console.log("Seeding successful!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
