// Firebase Firestore initialization script
// Run this in your Firebase console or using Firebase Admin SDK

const admin = require("firebase-admin")

// Initialize Firebase Admin (you'll need to set up service account)
const serviceAccount = require("./path-to-your-service-account-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Sample data for restaurants
const restaurants = [
  {
    name: "Spice Paradise",
    description: "Authentic North Indian cuisine with rich flavors",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "North Indian",
    rating: 4.5,
    deliveryTime: "25-35 mins",
    ownerId: "sample-owner-id-1",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: "South Delights",
    description: "Traditional South Indian dishes made with love",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "South Indian",
    rating: 4.3,
    deliveryTime: "30-40 mins",
    ownerId: "sample-owner-id-2",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: "Dragon Wok",
    description: "Fresh Chinese cuisine with authentic flavors",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Chinese",
    rating: 4.2,
    deliveryTime: "20-30 mins",
    ownerId: "sample-owner-id-3",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: "Pasta Corner",
    description: "Italian classics made fresh daily",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Italian",
    rating: 4.4,
    deliveryTime: "25-35 mins",
    ownerId: "sample-owner-id-4",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: "Burger Junction",
    description: "Juicy burgers and crispy fries",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Fast Food",
    rating: 4.1,
    deliveryTime: "15-25 mins",
    ownerId: "sample-owner-id-5",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: "Sweet Treats",
    description: "Delicious desserts and sweet delights",
    imageUrl: "/placeholder.svg?height=200&width=300",
    cuisineType: "Desserts",
    rating: 4.6,
    deliveryTime: "20-30 mins",
    ownerId: "sample-owner-id-6",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
]

// Sample menu items
const menuItems = [
  // North Indian items
  {
    restaurantId: "restaurant-1",
    name: "Butter Chicken",
    description: "Creamy tomato-based chicken curry",
    price: 299,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    restaurantId: "restaurant-1",
    name: "Dal Makhani",
    description: "Rich and creamy black lentil curry",
    price: 199,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    restaurantId: "restaurant-1",
    name: "Garlic Naan",
    description: "Soft bread with garlic and herbs",
    price: 79,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Bread",
    isAvailable: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  // South Indian items
  {
    restaurantId: "restaurant-2",
    name: "Masala Dosa",
    description: "Crispy crepe with spiced potato filling",
    price: 149,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Main Course",
    isAvailable: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    restaurantId: "restaurant-2",
    name: "Idli Sambar",
    description: "Steamed rice cakes with lentil curry",
    price: 99,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Breakfast",
    isAvailable: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    restaurantId: "restaurant-2",
    name: "Filter Coffee",
    description: "Traditional South Indian coffee",
    price: 49,
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Beverages",
    isAvailable: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
]

// Function to seed data
async function seedData() {
  try {
    console.log("Starting to seed data...")

    // Add restaurants
    for (const restaurant of restaurants) {
      await db.collection("restaurants").add(restaurant)
      console.log(`Added restaurant: ${restaurant.name}`)
    }

    // Add menu items
    for (const item of menuItems) {
      await db.collection("menuItems").add(item)
      console.log(`Added menu item: ${item.name}`)
    }

    console.log("Data seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding data:", error)
  }
}

// Run the seeding function
seedData()
