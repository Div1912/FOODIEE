import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate configuration
const validateFirebaseConfig = () => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]

  const missingFields = requiredFields.filter(
    (field) =>
      !firebaseConfig[field as keyof typeof firebaseConfig] ||
      firebaseConfig[field as keyof typeof firebaseConfig] === "undefined",
  )

  if (missingFields.length > 0) {
    console.error("❌ Missing Firebase configuration fields:", missingFields)
    console.error("🔧 Please check your environment variables")
    return false
  }

  console.log("✅ Firebase configuration validated successfully")
  return true
}

let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

try {
  if (validateFirebaseConfig()) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    console.log("🔥 Firebase initialized successfully")
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error)
}

export { auth, db, storage }
export default app
