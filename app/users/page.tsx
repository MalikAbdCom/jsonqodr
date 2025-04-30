'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"
import { UsersList } from "./components/users-list"
import { CreateUserForm } from "./components/create-user-form"
import { UpdateUserForm } from "./components/update-user-form"
import { useState } from "react"

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  
  return (
    <div className="container mx-auto py-10">
      <Toaster position="top-center" />
      
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">List Users</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
          <TabsTrigger value="update" disabled={!selectedUserId}>Update User</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                View, edit, and delete users from the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersList onSelectUser={setSelectedUserId} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>
                Add a new user to the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateUserForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Update User</CardTitle>
              <CardDescription>
                Edit an existing user's information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUserId && <UpdateUserForm userId={selectedUserId} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
