import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth, db } from "./firebase"
import type { User, MenuItem, Order } from "./types"

// Auth Services
export const signUpUser = async (email: string, password: string, fullName: string, phone: string, role: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, { displayName: fullName })

    // Create user document in Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email,
      fullName,
      phone,
      role,
      createdAt: serverTimestamp(),
    })

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data()
      return {
        uid: userData.uid,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        role: userData.role,
        createdAt: userData.createdAt?.toDate() || new Date(),
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Menu Item Services
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const q = query(collection(db, "menuItems"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as MenuItem[]
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return []
  }
}

// Get available menu items for customers
export const getAvailableMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const q = query(collection(db, "menuItems"), where("isAvailable", "==", true), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as MenuItem[]
  } catch (error) {
    console.error("Error fetching available menu items:", error)
    return []
  }
}

// Menu Item Management (Admin only)
export const addMenuItem = async (menuItem: Omit<MenuItem, "id" | "createdAt">): Promise<string | null> => {
  try {
    console.log("Adding menu item:", menuItem)
    const docRef = await addDoc(collection(db, "menuItems"), {
      ...menuItem,
      createdAt: serverTimestamp(),
    })
    console.log("Menu item added with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error adding menu item:", error)
    return null
  }
}

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, "menuItems", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating menu item:", error)
    return false
  }
}

export const deleteMenuItem = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "menuItems", id))
    return true
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return false
  }
}

// Real-time menu items subscription for admin
export const subscribeToMenuItems = (callback: (items: MenuItem[]) => void) => {
  const q = query(collection(db, "menuItems"), orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as MenuItem[]

    callback(items)
  })
}

// Real-time available menu items subscription for customers
export const subscribeToAvailableMenuItems = (callback: (items: MenuItem[]) => void) => {
  const q = query(collection(db, "menuItems"), where("isAvailable", "==", true), orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as MenuItem[]

    callback(items)
  })
}

// Order Services
export const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Create notification for admin
    await addDoc(collection(db, "notifications"), {
      userId: "admin",
      orderId: docRef.id,
      title: "New Order Received",
      message: `New order from ${orderData.customerName}`,
      isRead: false,
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating order:", error)
    return null
  }
}

export const updateOrderStatus = async (orderId: string, status: string, customerId: string) => {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status,
      updatedAt: serverTimestamp(),
    })

    // Create notification for customer
    const statusMessages = {
      accepted: "Your order has been accepted and is being prepared!",
      preparing: "Your order is being prepared with love!",
      out_for_delivery: "Your order is on its way to you!",
      delivered: "Your order has been delivered. Enjoy your meal!",
    }

    const message = statusMessages[status as keyof typeof statusMessages] || "Order status updated"

    await addDoc(collection(db, "notifications"), {
      userId: customerId,
      orderId,
      title: "Order Status Updated",
      message,
      isRead: false,
      createdAt: serverTimestamp(),
    })

    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const getOrders = async (userId: string, userRole: string): Promise<Order[]> => {
  try {
    let q

    if (userRole === "customer") {
      q = query(collection(db, "orders"), where("customerId", "==", userId), orderBy("createdAt", "desc"))
    } else {
      // Admin sees all orders
      q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    }

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[]
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// Real-time listeners
export const subscribeToOrders = (userId: string, userRole: string, callback: (orders: Order[]) => void) => {
  let q

  if (userRole === "customer") {
    q = query(collection(db, "orders"), where("customerId", "==", userId), orderBy("createdAt", "desc"))
  } else {
    // Admin sees all orders
    q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
  }

  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Order[]

    callback(orders)
  })
}

export const subscribeToOrderStatus = (orderId: string, callback: (order: Order | null) => void) => {
  return onSnapshot(doc(db, "orders", orderId), (doc) => {
    if (doc.exists()) {
      const orderData = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Order
      callback(orderData)
    } else {
      callback(null)
    }
  })
}
