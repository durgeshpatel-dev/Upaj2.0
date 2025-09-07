import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Tr } from '../ui/SimpleTranslation'

const ProfileCard = () => {
  const { user } = useAuth()

  // Format the join date from user data
  const formatJoinDate = (dateString) => {
    if (!dateString) return '2024'
    try {
      const date = new Date(dateString)
      return date.getFullYear().toString()
    } catch {
      return '2024'
    }
  }

  return (
    <Card className="border-border bg-background-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center">
              <User size={40} className="text-primary" />
            </div>
            <span
              className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary ring-2 ring-background-card"
              aria-hidden
            />
          </div>
          <h3 className="mt-4 text-text-primary font-semibold text-lg">{user?.name || 'User'}</h3>
          <p className="text-sm text-text-secondary"><Tr>Farmer</Tr></p>
          <p className="text-xs text-text-secondary mt-1">
            <Tr>Joined in</Tr> {formatJoinDate(user?.createdAt || user?.joinedDate)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard