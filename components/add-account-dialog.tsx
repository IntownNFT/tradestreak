import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface AddAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddAccount: (login: string, password: string, server: string) => void
}

export function AddAccountDialog({ isOpen, onClose, onAddAccount }: AddAccountDialogProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [server, setServer] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddAccount(login, password, server)
    setLogin('')
    setPassword('')
    setServer('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#141414] text-[rgba(229,231,235,1)] border-none">
        <DialogHeader>
          <DialogTitle className="text-[rgba(191,219,254,1)]">Add New Trading Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="login" className="text-right">
                Login
              </Label>
              <Input
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="col-span-3 bg-[#1c1c1c] border-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3 bg-[#1c1c1c] border-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="server" className="text-right">
                Server
              </Label>
              <Input
                id="server"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="col-span-3 bg-[#1c1c1c] border-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[rgba(191,219,254,1)] text-[#0f0f0f] hover:bg-[rgba(191,219,254,0.8)]">
              Add Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}