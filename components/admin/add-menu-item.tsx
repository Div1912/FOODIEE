"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { addMenuItem } from "@/lib/firebase-services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Check } from "lucide-react"

interface AddMenuItemProps {
  onClose: () => void
  onSuccess: () => void
}

const foodImages = [
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
  "/placeholder.svg?height=200&width=300",
]

const categories = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Bread",
  "Rice",
  "Noodles",
  "Pizza",
  "Burgers",
  "Snacks",
  "Indian Sweets",
  "Breakfast",
]

export default function AddMenuItem({ onClose, onSuccess }: AddMenuItemProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: foodImages[0],
    isAvailable: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      // Extra validation and debug logging
      if (isNaN(Number.parseFloat(formData.price))) {
        setError("Price must be a valid number")
        setLoading(false)
        return
      }
      if (!formData.name.trim() || !formData.description.trim() || !formData.category || !formData.imageUrl) {
        setError("All fields are required")
        setLoading(false)
        return
      }
      const menuItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        isAvailable: formData.isAvailable,
      }
      console.log("[DEBUG] Submitting menu item:", menuItem)
      try {
        const result = await addMenuItem(menuItem)
        if (result) {
        console.log("Menu item added successfully with ID:", result)
        onSuccess()
        onClose()
      } else {
        setError("Failed to add menu item. Please try again.")
      }
    } catch (error: any) {
      console.error("[DEBUG] Error adding menu item:", error)
      setError((error && error.message) || JSON.stringify(error) || "An error occurred while adding the menu item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold font-poppins flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Add New Menu Item
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name */}
              <div>
                <Label htmlFor="name" className="font-roboto">
                  Item Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Butter Chicken"
                  className="font-roboto"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="font-roboto">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your delicious dish..."
                  className="font-roboto resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="font-roboto">
                    Price (₹) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="299"
                    className="font-roboto"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="1"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="font-roboto">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="font-roboto">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="font-roboto">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Selection */}
              <div>
                <Label className="font-roboto mb-3 block">Choose Image *</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {foodImages.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        formData.imageUrl === image
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, imageUrl: image })}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Food option ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                      {formData.imageUrl === image && (
                        <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-3 py-2">
                <Label htmlFor="isAvailable" className="font-roboto">
                  Available to Customers
                </Label>
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
                <span className="text-sm text-gray-500 font-roboto">
                  {formData.isAvailable ? "Visible to customers" : "Hidden from customers"}
                </span>
              </div>

              {/* Preview */}
              <div>
                <Label className="font-roboto">Preview</Label>
                <Card className="mt-2">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg font-poppins">{formData.name || "Item Name"}</h3>
                        <p className="text-gray-600 text-sm font-roboto mb-2">
                          {formData.description || "Item description will appear here..."}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-green-600 font-poppins">
                            ₹{formData.price || "0"}
                          </span>
                          <span className="text-sm text-gray-500 font-roboto bg-gray-100 px-2 py-1 rounded">
                            {formData.category || "Category"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 font-roboto bg-transparent"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-roboto"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Adding..." : "Add Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
