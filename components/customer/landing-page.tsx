"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getRestaurants, subscribeToAvailableMenuItems } from "@/lib/firebase-services"
import type { Restaurant, MenuItem } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, Clock, Plus, ShoppingCart, User, Bell, MapPin, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

const cuisineTypes = [
  { name: "North Indian", emoji: "🍛", color: "from-orange-400 to-red-500", description: "Rich curries & tandoor" },
  { name: "South Indian", emoji: "🥥", color: "from-green-400 to-teal-500", description: "Dosas & filter coffee" },
  { name: "Chinese", emoji: "🥢", color: "from-red-400 to-pink-500", description: "Wok-tossed delights" },
  { name: "Italian", emoji: "🍝", color: "from-yellow-400 to-orange-500", description: "Pasta & pizza perfection" },
  { name: "Fast Food", emoji: "🍔", color: "from-purple-400 to-indigo-500", description: "Quick & tasty bites" },
  { name: "Desserts", emoji: "🍰", color: "from-pink-400 to-rose-500", description: "Sweet endings" },
]

const featuredOffers = [
  { title: "Free Delivery", subtitle: "On orders above ₹299", icon: "🚚", color: "bg-green-500" },
  { title: "20% Off", subtitle: "First order discount", icon: "🎉", color: "bg-orange-500" },
  { title: "Lightning Fast", subtitle: "30 min delivery", icon: "⚡", color: "bg-blue-500" },
]

export default function LandingPage() {
  const { user, signOut } = useAuth()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<MenuItem[]>([])
  const [showProfile, setShowProfile] = useState(false)

  // =================================================================
  // ===================== APPLIED FIX IS HERE =======================
  // =================================================================
  useEffect(() => {
    // Explicitly set loading to true when the effect runs.
    setLoading(true);

    // Fetch restaurants (this can happen in the background).
    fetchRestaurants();

    // Set up the real-time subscription for available menu items.
    // The callback will run once with the initial data (even if it's empty)
    // and then again whenever the data changes.
    const unsubscribe = subscribeToAvailableMenuItems((items) => {
      console.log("Available menu items updated:", items);
      setFeaturedItems(items);
      
      // Now it's safe to turn off the loader because we have received
      // a response from the database (either with items or an empty list).
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts.
    return () => unsubscribe();
  }, []); // The empty array ensures this effect runs only once.
  // =================================================================
  // ====================== END OF APPLIED FIX =======================
  // =================================================================

  const fetchRestaurants = async () => {
    try {
      const restaurantsData = await getRestaurants()
      setRestaurants(restaurantsData)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    }
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCuisine = !selectedCuisine || restaurant.cuisineType === selectedCuisine
    return matchesSearch && matchesCuisine
  })

  const filteredItems = featuredItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🍽️</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-poppins">
                INSTA BITE
              </span>
            </motion.div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for restaurants, cuisines..."
                  className="pl-10 pr-4 w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 font-roboto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={() => setShowProfile(!showProfile)}>
                  <User className="h-5 w-5" />
                  <span className="ml-2 hidden lg:inline font-roboto">{user?.fullName}</span>
                </Button>
              </motion.div>

              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent font-roboto"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Profile Section */}
      {showProfile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 p-4"
        >
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold font-poppins mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-roboto text-gray-600">Full Name</label>
                        <p className="font-semibold font-poppins">{user?.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-roboto text-gray-600">Email</label>
                        <p className="font-roboto">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-roboto text-gray-600">Phone</label>
                        <p className="font-roboto">{user?.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-roboto text-gray-600">Account Type</label>
                        <Badge className="bg-blue-500">Customer</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-20 px-4 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🍕</div>
          <div className="absolute top-20 right-20 text-4xl">🍔</div>
          <div className="absolute bottom-20 left-20 text-5xl">🍜</div>
          <div className="absolute bottom-10 right-10 text-3xl">🥘</div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <span className="text-yellow-300 font-roboto">India's Fastest Food Delivery</span>
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </motion.div>

          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-poppins"
          >
            INSTA BITE
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 font-roboto"
          >
            Bite into Instant Delights • Fast Food, Faster Delivery
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-md mx-auto relative md:hidden"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search restaurants or cuisines..."
              className="pl-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 font-roboto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Location Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-white/90 font-roboto">Delivering to your location</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Offers Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredOffers.map((offer, index) => (
              <motion.div
                key={offer.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`${offer.color} text-white p-4 rounded-lg text-center`}
              >
                <div className="text-2xl mb-2">{offer.icon}</div>
                <h3 className="font-bold font-poppins">{offer.title}</h3>
                <p className="text-sm font-roboto opacity-90">{offer.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold mb-8 text-gray-800 font-poppins text-center"
          >
            Explore Cuisines
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cuisineTypes.map((cuisine, index) => (
              <motion.div
                key={cuisine.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedCuisine === cuisine.name ? "ring-2 ring-orange-500" : ""
                  }`}
                  onClick={() => setSelectedCuisine(selectedCuisine === cuisine.name ? null : cuisine.name)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${cuisine.color} flex items-center justify-center text-2xl`}
                    >
                      {cuisine.emoji}
                    </div>
                    <h3 className="font-semibold text-gray-800 font-poppins mb-1">{cuisine.name}</h3>
                    <p className="text-xs text-gray-500 font-roboto">{cuisine.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold mb-8 text-gray-800 font-poppins text-center"
          >
            Featured Dishes ({filteredItems.length})
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="bg-white p-4 rounded-b-lg border border-t-0">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48">
                      <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white font-roboto">₹{item.price}</Badge>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black/70 text-white font-roboto text-xs">{item.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 font-poppins">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 font-roboto line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-roboto">4.5</span>
                          <span className="text-xs text-gray-400 font-roboto">(120+)</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 font-roboto"
                          onClick={() => addToCart(item)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-poppins">No dishes available yet</h3>
              <p className="text-gray-600 font-roboto">
                Restaurant owners are adding delicious items. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Restaurants */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="text-3xl font-bold mb-8 text-gray-800 font-poppins text-center"
          >
            Popular Restaurants ({filteredRestaurants.length})
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="relative h-48">
                    <Image
                      src={restaurant.imageUrl || "/placeholder.svg"}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white text-gray-800 font-roboto">{restaurant.cuisineType}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white font-roboto">
                        {restaurant.isActive ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg font-poppins">{restaurant.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-3 font-roboto">{restaurant.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-roboto font-semibold">{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 font-roboto">{restaurant.deliveryTime}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="font-roboto bg-transparent">
                        View Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-poppins">No restaurants found</h3>
              <p className="text-gray-600 font-roboto">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCuisine(null)
                }}
                className="mt-4 bg-orange-500 hover:bg-orange-600 font-roboto"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🍽️</span>
                </div>
                <span className="text-xl font-bold font-poppins">INSTA BITE</span>
              </div>
              <p className="text-gray-400 font-roboto">
                India's fastest food delivery service. Delivering happiness in every bite.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-poppins">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 font-roboto">
                <li>About Us</li>
                <li>Contact</li>
                <li>Help & Support</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-poppins">Categories</h4>
              <ul className="space-y-2 text-gray-400 font-roboto">
                <li>North Indian</li>
                <li>South Indian</li>
                <li>Chinese</li>
                <li>Fast Food</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-poppins">Contact Info</h4>
              <ul className="space-y-2 text-gray-400 font-roboto">
                <li>📞 1800-123-4567</li>
                <li>📧 support@instabite.com</li>
                <li>📍 Available across India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 font-roboto">
              © 2024 INSTA BITE. All rights reserved. Made with ❤️ for food lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
