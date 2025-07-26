"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  subscribeToOrders,
  updateOrderStatus,
  subscribeToMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/firebase-services"
import type { Order, MenuItem } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Bell,
  IndianRupee,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  User,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import DataInitializer from "./data-initializer"
import AddMenuItem from "./add-menu-item"

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showAddMenuItem, setShowAddMenuItem] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    todayRevenue: 0,
    completedToday: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Set up real-time subscription for orders
    const unsubscribeOrders = subscribeToOrders(user.uid, user.role, (ordersData) => {
      setOrders(ordersData)
      calculateStats(ordersData)
    })

    // Set up real-time subscription for menu items
    const unsubscribeMenuItems = subscribeToMenuItems((itemsData) => {
      console.log("Menu items updated:", itemsData)
      setMenuItems(itemsData)
      setLoading(false)
    })

    return () => {
      unsubscribeOrders()
      unsubscribeMenuItems()
    }
  }, [user])

  const calculateStats = (ordersData: Order[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = ordersData.filter((order) => order.createdAt >= today)

    const totalOrders = todayOrders.length
    const activeOrders = todayOrders.filter((order) =>
      ["pending", "accepted", "preparing", "out_for_delivery"].includes(order.status),
    ).length
    const completedToday = todayOrders.filter((order) => order.status === "delivered").length
    const todayRevenue = todayOrders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + order.totalAmount, 0)

    setStats({
      totalOrders,
      activeOrders,
      todayRevenue,
      completedToday,
    })
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, customerId: string) => {
    try {
      await updateOrderStatus(orderId, newStatus, customerId)
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      await updateMenuItem(itemId, { isAvailable: !currentStatus })
    } catch (error) {
      console.error("Error updating menu item:", error)
    }
  }

  const handleDeleteMenuItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(itemId)
      } catch (error) {
        console.error("Error deleting menu item:", error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      accepted: "bg-blue-500",
      preparing: "bg-orange-500",
      out_for_delivery: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      accepted: CheckCircle,
      preparing: Package,
      out_for_delivery: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons] || Clock
    return <Icon className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">INSTA BITE</h2>
          <p className="text-gray-600 font-roboto">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">INSTA BITE Admin</h1>
              <p className="text-gray-600 font-roboto">Welcome back, {user?.fullName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(!showProfile)}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
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
        </motion.div>

        {/* Profile Section */}
        {showProfile && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-poppins">Admin Profile</CardTitle>
              </CardHeader>
              <CardContent>
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
                        <label className="text-sm font-roboto text-gray-600">Role</label>
                        <Badge className="bg-red-500">Administrator</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Orders Today",
              value: stats.totalOrders,
              icon: Package,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Active Orders",
              value: stats.activeOrders,
              icon: Clock,
              color: "from-orange-500 to-orange-600",
            },
            {
              title: "Today's Revenue",
              value: `₹${stats.todayRevenue}`,
              icon: IndianRupee,
              color: "from-green-500 to-green-600",
            },
            {
              title: "Completed Today",
              value: stats.completedToday,
              icon: CheckCircle,
              color: "from-purple-500 to-purple-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${stat.color} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm font-roboto">{stat.title}</p>
                        <p className="text-2xl font-bold font-poppins">{stat.value}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-white/80" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Data Initializer - Show only if no menu items exist */}
        {!loading && menuItems.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <DataInitializer />
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="orders" className="font-roboto">
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="menu" className="font-roboto">
              Menu Management ({menuItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-poppins">
                  <Bell className="h-5 w-5" />
                  Live Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold font-poppins">Order #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-gray-600 font-roboto">
                              {order.customerName} • {order.phone}
                            </p>
                            <p className="text-xs text-gray-500 font-roboto">{order.createdAt.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} text-white mb-2`}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status.replace("_", " ").toUpperCase()}
                              </span>
                            </Badge>
                            <p className="font-bold text-lg font-poppins">₹{order.totalAmount}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium mb-2 font-roboto">Items:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="font-roboto">
                                  {item.name} x {item.quantity}
                                </span>
                                <span className="font-roboto">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-roboto">
                            <strong>Delivery Address:</strong> {order.deliveryAddress}
                          </p>
                        </div>

                        {order.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, "accepted", order.customerId)}
                              className="bg-green-500 hover:bg-green-600 font-roboto"
                            >
                              Accept Order
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateOrderStatus(order.id, "cancelled", order.customerId)}
                              className="font-roboto"
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {order.status === "accepted" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, "preparing", order.customerId)}
                            className="bg-orange-500 hover:bg-orange-600 font-roboto"
                          >
                            Start Preparing
                          </Button>
                        )}

                        {order.status === "preparing" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, "out_for_delivery", order.customerId)}
                            className="bg-purple-500 hover:bg-purple-600 font-roboto"
                          >
                            Out for Delivery
                          </Button>
                        )}

                        {order.status === "out_for_delivery" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, "delivered", order.customerId)}
                            className="bg-green-500 hover:bg-green-600 font-roboto"
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-roboto">No orders yet today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-poppins">Menu Management</CardTitle>
                  <Button
                    onClick={() => setShowAddMenuItem(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-roboto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={item.isAvailable ? "bg-green-500" : "bg-red-500"}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 font-poppins">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 font-roboto line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <span className="font-bold text-xl text-green-600 font-poppins">₹{item.price}</span>
                          <Badge variant="outline" className="font-roboto">
                            {item.category}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                            className="flex-1 font-roboto"
                          >
                            {item.isAvailable ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                Show
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="font-roboto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {menuItems.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-roboto mb-4">No menu items yet</p>
                    <Button
                      onClick={() => setShowAddMenuItem(true)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-roboto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Menu Item
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Menu Item Modal */}
        <AnimatePresence>
          {showAddMenuItem && (
            <AddMenuItem
              onClose={() => setShowAddMenuItem(false)}
              onSuccess={() => {
                console.log("Menu item added successfully!")
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
