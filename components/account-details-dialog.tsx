import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TradingAccount } from "@/types/trading"

interface AccountDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  account: TradingAccount
}

export function AccountDetailsDialog({ isOpen, onClose, account }: AccountDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141414] text-white border-none max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[rgba(191,219,254,1)]">Account Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card className="bg-[#1c1c1c] border-none">
            <CardHeader>
              <CardTitle className="text-[rgba(191,219,254,1)]">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="grid grid-cols-2 gap-4">
                <div>Name: {account.name}</div>
                <div>Login: {account.login}</div>
                <div>Server: {account.server}</div>
                <div>Balance: {account.accountInfo?.balance}</div>
                <div>Equity: {account.accountInfo?.equity}</div>
                <div>Leverage: {account.accountInfo?.leverage}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1c1c1c] border-none">
            <CardHeader>
              <CardTitle className="text-[rgba(191,219,254,1)]">Open Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[rgba(191,219,254,0.9)]">Symbol</TableHead>
                    <TableHead className="text-[rgba(191,219,254,0.9)]">Type</TableHead>
                    <TableHead className="text-[rgba(191,219,254,0.9)]">Volume</TableHead>
                    <TableHead className="text-[rgba(191,219,254,0.9)]">Open Price</TableHead>
                    <TableHead className="text-[rgba(191,219,254,0.9)]">Current Price</TableHead>
                    <TableHead className="text-[rgba(191,219,254,0.9)]">Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-white">
                  {account.openTrades && account.openTrades.length > 0 ? (
                    account.openTrades.map((trade, index) => (
                      <TableRow key={index}>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell>{trade.type}</TableCell>
                        <TableCell>{trade.volume}</TableCell>
                        <TableCell>{trade.openPrice}</TableCell>
                        <TableCell>{trade.currentPrice}</TableCell>
                        <TableCell>{trade.profit}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No open trades</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}