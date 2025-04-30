'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { deleteUser, getUsers } from '../actions'
import { toast } from 'sonner'

interface UsersListProps {
  onSelectUser: (userId: number) => void
}

export function UsersList({ onSelectUser }: UsersListProps) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const fetchedUsers = await getUsers()
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Failed to load users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Handle user deletion
  const handleDelete = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser(userId)
        
        if (result.success) {
          toast.success(result.message)
          // Update the local state to reflect the deletion
          setUsers(users.filter(user => user.id !== userId))
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  // Handle user selection for editing
  const handleEdit = (userId: number) => {
    onSelectUser(userId)
    // Find the tab with value "update" and click it
    const updateTab = document.querySelector('[data-value="update"]') as HTMLElement
    if (updateTab) {
      updateTab.click()
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading users...</div>
  }

  if (users.length === 0) {
    return <div className="text-center p-4">No users found. Create one to get started!</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || '-'}</TableCell>
              <TableCell>{user.website || '-'}</TableCell>
              <TableCell className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
