"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import type { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Package, Truck, MapPin, Phone, Star } from "lucide-react"

interface OrderTrackingProps {
  orderId: string
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()

    // Set up real-time subscription for order updates
    const orderSubscription = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log("Order updated:", payload)
          setOrder(payload.new as Order)
        },
      )
      .subscribe()

    return () => {
      orderSubscription.unsubscribe()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          restaurants (name, phone, image_url)
        `)
        .eq("id", orderId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusSteps = () => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: Clock, description: "Your order has been placed" },
      {
        key: "accepted",
        label: "Order Accepted",
        icon: CheckCircle,
        description: "Restaurant has accepted your order",
      },
      { key: "preparing", label: "Preparing", icon: Package, description: "Your food is being prepared" },
      { key: "out_for_delivery", label: "Out for Delivery", icon: Truck, description: "Your order is on the way" },
      { key: "delivered", label: "Delivered", icon: CheckCircle, description: "Order delivered successfully" },
    ]

    const currentStepIndex = steps.findIndex((step) => step.key === order?.status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex,
      active: index === currentStepIndex,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">Order Not Found</h2>
          <p className="text-gray-600 font-roboto">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">Track Your Order</h1>
          <p className="text-gray-600 font-roboto">Order #{order.id.slice(-8)}</p>
        </motion.div>

        {/* Order Status Timeline */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-poppins">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusSteps.map((step, index) => (
                  <motion.div
                    key={step.key}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-500 text-white"
                          : step.active
                            ? "bg-orange-500 text-white animate-pulse"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold font-poppins ${
                          step.completed || step.active ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </h3>
                      <p
                        className={`text-sm font-roboto ${
                          step.completed || step.active ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    {step.completed && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500">
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Details */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-poppins">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold font-roboto">Restaurant:</span>
                  <span className="font-roboto">{order.restaurants?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold font-roboto">Order Time:</span>
                  <span className="font-roboto">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold font-roboto">Total Amount:</span>
                  <span className="font-bold text-lg font-poppins">₹{order.total_amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold font-roboto">Payment Method:</span>
                  <Badge variant="outline" className="font-roboto">
                    Cash on Delivery
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-poppins">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <h4 className="font-semibold font-poppins">{item.name}</h4>
                      <p className="text-sm text-gray-600 font-roboto">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold font-poppins">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery Address */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-poppins">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-roboto">{order.delivery_address}</p>
              <div className="flex items-center gap-2 mt-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="font-roboto">{order.phone}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        {order.status === "delivered" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4 font-poppins">How was your experience?</h3>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-gray-300 hover:text-yellow-400 transition-colors">
                      <Star className="h-6 w-6" />
                    </button>
                  ))}
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 font-roboto">Rate & Review</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
