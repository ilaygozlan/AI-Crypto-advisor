import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export function ProfileForm() {
  const { user, doLogout } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // In a real app, this would call an API to update the user profile
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  const handleLogout = () => {
    doLogout()
  }

  return (
    <Card title="👤 Profile">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
              Edit Profile
            </Button>
          )}
        </div>

        <div className="pt-6 border-t border-border">
          <Button variant="destructive" onClick={handleLogout} size="sm">
            Logout
          </Button>
        </div>
      </div>
    </Card>
  )
}
