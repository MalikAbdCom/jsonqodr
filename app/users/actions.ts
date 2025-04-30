'use server'

import { db, users } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// Type for user form data
export type UserFormData = {
  name: string
  username: string
  email: string
  phone?: string
  website?: string
  street?: string
  suite?: string
  city?: string
  zipcode?: string
  lat?: string
  lng?: string
  companyName?: string
  companyCatchPhrase?: string
  companyBs?: string
}

// Create a new user
export async function createUser(data: UserFormData): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    // Validate required fields
    if (!data.name || !data.username || !data.email) {
      return {
        success: false,
        message: 'Name, username, and email are required',
      }
    }

    // Check if username or email already exists
    const existingUser = await db.query.users.findFirst({
      where: (users) => {
        return eq(users.username, data.username) || eq(users.email, data.email)
      },
    })

    if (existingUser) {
      return {
        success: false,
        message: 'Username or email already exists',
      }
    }

    // Insert new user
    const newUser = await db.insert(users).values({
      name: data.name,
      username: data.username,
      email: data.email,
      phone: data.phone || null,
      website: data.website || null,
      street: data.street || null,
      suite: data.suite || null,
      city: data.city || null,
      zipcode: data.zipcode || null,
      lat: data.lat || null,
      lng: data.lng || null,
      companyName: data.companyName || null,
      companyCatchPhrase: data.companyCatchPhrase || null,
      companyBs: data.companyBs || null,
    }).returning()

    revalidatePath('/users')
    
    return {
      success: true,
      message: 'User created successfully',
      user: newUser[0],
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      success: false,
      message: 'Failed to create user',
    }
  }
}

// Get all users
export async function getUsers(): Promise<any[]> {
  try {
    return await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.id)],
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Get a single user by ID
export async function getUserById(id: number): Promise<any | null> {
  try {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    return null
  }
}

// Update a user
export async function updateUser(id: number, data: Partial<UserFormData>): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    // Check if user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    // If username or email is being updated, check if they already exist
    if (data.username || data.email) {
      const duplicateUser = await db.query.users.findFirst({
        where: (users) => {
          const conditions = []
          if (data.username) {
            conditions.push(eq(users.username, data.username))
          }
          if (data.email) {
            conditions.push(eq(users.email, data.email))
          }
          return conditions.length > 0 ? conditions[0] : undefined
        },
      })

      if (duplicateUser && duplicateUser.id !== id) {
        return {
          success: false,
          message: 'Username or email already exists',
        }
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Only include fields that are provided
    if (data.name !== undefined) updateData.name = data.name
    if (data.username !== undefined) updateData.username = data.username
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.website !== undefined) updateData.website = data.website
    if (data.street !== undefined) updateData.street = data.street
    if (data.suite !== undefined) updateData.suite = data.suite
    if (data.city !== undefined) updateData.city = data.city
    if (data.zipcode !== undefined) updateData.zipcode = data.zipcode
    if (data.lat !== undefined) updateData.lat = data.lat
    if (data.lng !== undefined) updateData.lng = data.lng
    if (data.companyName !== undefined) updateData.companyName = data.companyName
    if (data.companyCatchPhrase !== undefined) updateData.companyCatchPhrase = data.companyCatchPhrase
    if (data.companyBs !== undefined) updateData.companyBs = data.companyBs

    // Update user
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()

    revalidatePath('/users')
    
    return {
      success: true,
      message: 'User updated successfully',
      user: updatedUser[0],
    }
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return {
      success: false,
      message: 'Failed to update user',
    }
  }
}

// Delete a user
export async function deleteUser(id: number): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id))

    revalidatePath('/users')
    
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    return {
      success: false,
      message: 'Failed to delete user',
    }
  }
}
