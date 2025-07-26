"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Settings, ExternalLink, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function FirebaseErrorHandler() {
  const [copied, setCopied] = useState(false)

  const envVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]

  const currentConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  const copyEnvTemplate = () => {
    const template = `# Add these to your .env.local file:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`

    navigator.clipboard.writeText(template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
            >
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800 font-poppins">
              Firebase Configuration Error
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-roboto">
                <strong>Error:</strong> Firebase configuration not found. Your environment variables are missing or
                incorrect.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 font-poppins flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Configuration Status
              </h3>

              <div className="grid gap-3">
                {envVars.map((envVar) => {
                  const value =
                    currentConfig[
                      envVar.replace("NEXT_PUBLIC_FIREBASE_", "").toLowerCase() as keyof typeof currentConfig
                    ]
                  const isSet = value && value !== "undefined"

                  return (
                    <div key={envVar} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm text-gray-700">{envVar}</span>
                      <div className="flex items-center gap-2">
                        {isSet ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600 font-roboto">Set</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-red-600 font-roboto">Missing</span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 font-poppins">🔧 How to Fix This:</h3>

              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 font-poppins">Step 1: Create Firebase Project</h4>
                  <p className="text-blue-700 text-sm mb-3 font-roboto">
                    If you haven't already, create a new Firebase project:
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent"
                    onClick={() => window.open("https://console.firebase.google.com", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Firebase Console
                  </Button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 font-poppins">Step 2: Get Your Config</h4>
                  <ul className="text-green-700 text-sm space-y-1 font-roboto">
                    <li>• Go to Project Settings → General</li>
                    <li>• Scroll to "Your apps" section</li>
                    <li>• Click "Web app" or add a new web app</li>
                    <li>• Copy the config values</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2 font-poppins">Step 3: Add Environment Variables</h4>
                  <p className="text-orange-700 text-sm mb-3 font-roboto">
                    Create a <code className="bg-orange-100 px-1 rounded">.env.local</code> file in your project root:
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                    onClick={copyEnvTemplate}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "Copied!" : "Copy Template"}
                  </Button>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2 font-poppins">Step 4: Enable Services</h4>
                  <ul className="text-purple-700 text-sm space-y-1 font-roboto">
                    <li>• Enable Authentication (Email/Password)</li>
                    <li>• Create Firestore Database</li>
                    <li>• Set Firestore rules to allow read/write</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 font-poppins">📝 Quick Firestore Rules</h4>
              <p className="text-gray-600 text-sm mb-2 font-roboto">Add these rules to your Firestore Database:</p>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
              </pre>
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 font-roboto">
                <strong>Important:</strong> After adding the environment variables, restart your development server with{" "}
                <code>npm run dev</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
