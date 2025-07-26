// Firebase data seeding script
// This script initializes your Firestore database with sample data

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

// Firebase configuration (you'll need to replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample restaurants data
const restaurants = [
  {
    name: "Spice Paradise",
    description: "Authentic North Indian cuisine with rich flavors",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "North Indian",
    rating: 4.5,
    deliveryTime: "25-35 mins",
    ownerId: "sample-owner-1", // This should be replaced with actual user IDs
    isActive: true,
    createdAt: serverTimestamp(),
  },
  {
    name: "South Delights",
    description: "Traditional South Indian dishes made with love",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "South Indian",
    rating: 4.3,
    deliveryTime: "30-40 mins",
    ownerId: "sample-owner-2",
    isActive: true,
    createdAt: serverTimestamp(),
  },
  {
    name: "Dragon Wok",
    description: "Fresh Chinese cuisine with authentic flavors",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Chinese",
    rating: 4.2,
    deliveryTime: "20-30 mins",
    ownerId: "sample-owner-3",
    isActive: true,
    createdAt: serverTimestamp(),
  },
  {
    name: "Pasta Corner",
    description: "Italian classics made fresh daily",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Italian",
    rating: 4.4,
    deliveryTime: "25-35 mins",
    ownerId: "sample-owner-4",
    isActive: true,
    createdAt: serverTimestamp(),
  },
  {
    name: "Burger Junction",
    description: "Juicy burgers and crispy fries",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Fast Food",
    rating: 4.1,
    deliveryTime: "15-25 mins",
    ownerId: "sample-owner-5",
    isActive: true,
    createdAt: serverTimestamp(),
  },
  {
    name: "Sweet Treats",
    description: "Delicious desserts and sweet delights",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Desserts",
    rating: 4.6,
    deliveryTime: "20-30 mins",
    ownerId: "sample-owner-6",
    isActive: true,
    createdAt: serverTimestamp(),
  },
]

// Sample menu items data
const menuItems = [
  // North Indian items
  {
    restaurantId: "spice-paradise", // This will be updated with actual restaurant IDs
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry with aromatic spices",
    price: 299,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "spice-paradise",
    name: "Dal Makhani",
    description: "Rich and creamy black lentil curry slow-cooked to perfection",
    price: 199,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "spice-paradise",
    name: "Garlic Naan",
    description: "Soft bread with fresh garlic and herbs, baked in tandoor",
    price: 79,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Bread",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },

  // South Indian items
  {
    restaurantId: "south-delights",
    name: "Masala Dosa",
    description: "Crispy crepe with spiced potato filling and coconut chutney",
    price: 149,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "south-delights",
    name: "Idli Sambar",
    description: "Steamed rice cakes with lentil curry and coconut chutney",
    price: 99,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Breakfast",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "south-delights",
    name: "Filter Coffee",
    description: "Traditional South Indian coffee with perfect blend",
    price: 49,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Beverages",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },

  // Chinese items
  {
    restaurantId: "dragon-wok",
    name: "Chicken Fried Rice",
    description: "Wok-tossed rice with chicken, vegetables and soy sauce",
    price: 179,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "dragon-wok",
    name: "Chilli Chicken",
    description: "Spicy chicken with bell peppers in Indo-Chinese style",
    price: 249,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Appetizer",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "dragon-wok",
    name: "Veg Hakka Noodles",
    description: "Stir-fried noodles with fresh vegetables and sauces",
    price: 159,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },

  // Italian items
  {
    restaurantId: "pasta-corner",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    price: 299,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Pizza",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "pasta-corner",
    name: "Chicken Alfredo Pasta",
    description: "Creamy pasta with grilled chicken and parmesan cheese",
    price: 349,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Pasta",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "pasta-corner",
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: 129,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Appetizer",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },

  // Fast Food items
  {
    restaurantId: "burger-junction",
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, cheese and special sauce",
    price: 199,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Burgers",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "burger-junction",
    name: "Chicken Wings",
    description: "Spicy buffalo chicken wings with ranch dip",
    price: 249,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Appetizer",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "burger-junction",
    name: "French Fries",
    description: "Crispy golden fries with ketchup and mayo",
    price: 99,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Sides",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },

  // Dessert items
  {
    restaurantId: "sweet-treats",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with ganache and fresh berries",
    price: 199,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Cakes",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "sweet-treats",
    name: "Gulab Jamun",
    description: "Traditional Indian sweet in sugar syrup with cardamom",
    price: 89,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Indian Sweets",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
  {
    restaurantId: "sweet-treats",
    name: "Ice Cream Sundae",
    description: "Vanilla ice cream with chocolate sauce and nuts",
    price: 149,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Ice Cream",
    isAvailable: true,
    createdAt: serverTimestamp(),
  },
]

// Function to seed restaurants
async function seedRestaurants() {
  console.log("🏪 Seeding restaurants...")
  const restaurantIds = []

  for (const restaurant of restaurants) {
    try {
      const docRef = await addDoc(collection(db, "restaurants"), restaurant)
      restaurantIds.push(docRef.id)
      console.log(`✅ Added restaurant: ${restaurant.name} (ID: ${docRef.id})`)
    } catch (error) {
      console.error(`❌ Error adding restaurant ${restaurant.name}:`, error)
    }
  }

  return restaurantIds
}

// Function to seed menu items
async function seedMenuItems(restaurantIds) {
  console.log("🍽️ Seeding menu items...")

  // Map restaurant names to IDs for menu items
  const restaurantMapping = {
    "spice-paradise": restaurantIds[0],
    "south-delights": restaurantIds[1],
    "dragon-wok": restaurantIds[2],
    "pasta-corner": restaurantIds[3],
    "burger-junction": restaurantIds[4],
    "sweet-treats": restaurantIds[5],
  }

  for (const item of menuItems) {
    try {
      const updatedItem = {
        ...item,
        restaurantId: restaurantMapping[item.restaurantId] || item.restaurantId,
      }

      const docRef = await addDoc(collection(db, "menuItems"), updatedItem)
      console.log(`✅ Added menu item: ${item.name} (ID: ${docRef.id})`)
    } catch (error) {
      console.error(`❌ Error adding menu item ${item.name}:`, error)
    }
  }
}

// Main seeding function
async function seedFirebaseData() {
  try {
    console.log("🚀 Starting Firebase data seeding...")
    console.log("📊 This will populate your Firestore database with sample data")

    // Seed restaurants first
    const restaurantIds = await seedRestaurants()

    // Then seed menu items with correct restaurant IDs
    await seedMenuItems(restaurantIds)

    console.log("🎉 Firebase data seeding completed successfully!")
    console.log("📱 You can now run your application and see the sample data")
  } catch (error) {
    console.error("💥 Error during data seeding:", error)
  }
}

// Export for use in other files or run directly
export { seedFirebaseData }

// If running this file directly
if (typeof window === "undefined") {
  seedFirebaseData()
}
