"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Database, Settings, Users } from "lucide-react"

export default function SetupGuide() {
  const steps = [
    {
      icon: Settings,
      title: "Firebase Configuration",
      description: "Add your Firebase environment variables",
      status: "required",
      details: [
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        "NEXT_PUBLIC_FIREBASE_APP_ID",
      ],
    },
    {
      icon: Database,
      title: "Initialize Sample Data",
      description: "Populate your database with restaurants and menu items",
      status: "optional",
      details: ["Use the Data Initializer in the admin dashboard", "Or manually add your own restaurants"],
    },
    {
      icon: Users,
      title: "Create User Accounts",
      description: "Sign up as customer or restaurant owner",
      status: "ready",
      details: ["Customer accounts can browse and order", "Restaurant owners can manage orders"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-poppins mb-4">
            🔥 INSTA BITE Setup Guide
          </h1>
          <p className="text-gray-600 font-roboto">Get your Firebase food delivery app up and running!</p>
        </motion.div>

        <div className="grid gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-poppins">
                    <div
                      className={`p-2 rounded-full ${
                        step.status === "required"
                          ? "bg-red-100 text-red-600"
                          : step.status === "optional"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span>{step.title}</span>
                    <Badge
                      variant={
                        step.status === "required"
                          ? "destructive"
                          : step.status === "optional"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {step.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 font-roboto">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-sm font-roboto">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-2 font-poppins">Ready to Start? 🚀</h2>
          <p className="font-roboto">
            Once you've completed the setup, refresh the page to start using your food delivery app!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
