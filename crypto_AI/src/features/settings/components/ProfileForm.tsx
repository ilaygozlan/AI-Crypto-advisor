import { Card } from '@/components/common/Card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export function ProfileForm() {
  const { user, doLogout } = useAuth()

  const handleLogout = () => {
    doLogout()
  }

  return (
    <Card title="👤 Profile">
      <div className="space-y-6">
        {/* Display Name */}
        <div className="space-y-2">
          <Label>Display Name</Label>
          <div className="p-3 bg-muted rounded-md">
            <span className="text-sm">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Not set'}
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="p-3 bg-muted rounded-md">
            <span className="text-sm">{user?.email || 'Not set'}</span>
          </div>
        </div>

        {/* Account Status */}
        <div className="space-y-2">
          <Label>Account Status</Label>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
        </div>


        {/* Logout */}
        <div className="pt-6 border-t border-border">
          <Button variant="destructive" onClick={handleLogout} size="sm">
            Logout
          </Button>
        </div>
      </div>
    </Card>
  )
}
