"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, CheckCircle, AlertCircle } from "lucide-react"

export default function DataInitializer() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const sampleRestaurants = [
    {
      name: "Spice Paradise",
      description: "Authentic North Indian cuisine with rich flavors",
      imageUrl: "/placeholder.svg?height=200&width=300",
      cuisineType: "North Indian",
      rating: 4.5,
      deliveryTime: "25-35 mins",
      ownerId: "sample-owner-1",
      isActive: true,
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
    },
  ]

  const sampleMenuItems = [
    {
      name: "Butter Chicken",
      description: "Creamy tomato-based chicken curry with aromatic spices",
      price: 299,
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Main Course",
      isAvailable: true,
    },
    {
      name: "Masala Dosa",
      description: "Crispy crepe with spiced potato filling and coconut chutney",
      price: 149,
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Main Course",
      isAvailable: true,
    },
    {
      name: "Chicken Fried Rice",
      description: "Wok-tossed rice with chicken, vegetables and soy sauce",
      price: 179,
      imageUrl: "/placeholder.svg?height=200&width=300",
      category: "Main Course",
      isAvailable: true,
    },
  ]

  const initializeData = async () => {
    setLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      console.log("🚀 Starting data initialization...")

      // Add restaurants
      const restaurantIds = []
      for (const restaurant of sampleRestaurants) {
        const docRef = await addDoc(collection(db, "restaurants"), {
          ...restaurant,
          createdAt: serverTimestamp(),
        })
        restaurantIds.push(docRef.id)
        console.log(`✅ Added restaurant: ${restaurant.name}`)
      }

      // Add menu items
      for (let i = 0; i < sampleMenuItems.length; i++) {
        const item = sampleMenuItems[i]
        await addDoc(collection(db, "menuItems"), {
          ...item,
          restaurantId: restaurantIds[i] || restaurantIds[0],
          createdAt: serverTimestamp(),
        })
        console.log(`✅ Added menu item: ${item.name}`)
      }

      setStatus("success")
      setMessage("Sample data has been successfully added to your Firebase database!")
    } catch (error: any) {
      console.error("❌ Error initializing data:", error)
      setStatus("error")
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <Database className="h-5 w-5" />
            Initialize Sample Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 font-roboto">
            Click the button below to populate your Firebase database with sample restaurants and menu items.
          </p>

          <Button
            onClick={initializeData}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-roboto"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            {loading ? "Initializing..." : "Initialize Sample Data"}
          </Button>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-roboto">{message}</span>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-roboto">{message}</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
