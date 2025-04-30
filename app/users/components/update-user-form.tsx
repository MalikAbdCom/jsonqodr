'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getUserById, updateUser, UserFormData } from '../actions'
import { toast } from 'sonner'

interface UpdateUserFormProps {
  userId: number
}

export function UpdateUserForm({ userId }: UpdateUserFormProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      website: '',
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      companyName: '',
      companyCatchPhrase: '',
      companyBs: '',
    },
  })

  // Load user data when component mounts or userId changes
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const user = await getUserById(userId)
        
        if (user) {
          // Update form with user data
          form.reset({
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone || '',
            website: user.website || '',
            street: user.street || '',
            suite: user.suite || '',
            city: user.city || '',
            zipcode: user.zipcode || '',
            companyName: user.companyName || '',
            companyCatchPhrase: user.companyCatchPhrase || '',
            companyBs: user.companyBs || '',
          })
        } else {
          toast.error('User not found')
        }
      } catch (error) {
        console.error('Error loading user:', error)
        toast.error('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [userId, form])

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)
    try {
      const result = await updateUser(userId, data)
      
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading user data...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="suite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suite/Apt</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt 4B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="companyCatchPhrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catch Phrase</FormLabel>
                  <FormControl>
                    <Input placeholder="Making dreams come true" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="companyBs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business</FormLabel>
                  <FormControl>
                    <Input placeholder="e-commerce solutions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
