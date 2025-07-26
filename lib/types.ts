export interface User {
  uid: string
  email: string
  fullName: string
  phone: string
  role: "customer" | "admin"
  createdAt: Date
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  isAvailable: boolean
  createdAt: Date
}

export interface Order {
  id: string
  customerId: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
  deliveryAddress: string
  phone: string
  customerName: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
}

export interface Address {
  id: string
  userId: string
  title: string
  addressLine: string
  city: string
  pincode: string
  isDefault: boolean
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  orderId: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}
