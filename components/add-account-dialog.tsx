import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface AddAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddAccount: (name: string, login: string, password: string, server: string) => void
  suggestedServers: Record<string, string[]>
}

export function AddAccountDialog({ isOpen, onClose, onAddAccount, suggestedServers }: AddAccountDialogProps) {
  const [name, setName] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [server, setServer] = useState('')
  const [brokers, setBrokers] = useState<string[]>([])
  const [selectedBroker, setSelectedBroker] = useState('')

  useEffect(() => {
    setBrokers(Object.keys(suggestedServers))
  }, [suggestedServers])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddAccount(name, login, password, server)
    setName('')
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
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-[#1c1c1c] border-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
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
            {brokers.length > 0 ? (
              <>
                <Label htmlFor="broker">Broker</Label>
                <Select onValueChange={setSelectedBroker}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select broker" />
                  </SelectTrigger>
                  <SelectContent>
                    {brokers.map((broker) => (
                      <SelectItem key={broker} value={broker}>
                        {broker}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBroker && (
                  <>
                    <Label htmlFor="server">Server</Label>
                    <Select onValueChange={setServer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select server" />
                      </SelectTrigger>
                      <SelectContent>
                        {suggestedServers[selectedBroker].map((serverName) => (
                          <SelectItem key={serverName} value={serverName}>
                            {serverName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </>
            ) : (
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
            )}
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