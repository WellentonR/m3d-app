"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface OrdersTableProps {
  orders: any[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId)
    await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
    setUpdatingOrder(null)
    router.refresh()
  }

  const handlePaymentStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId)
    await supabase
      .from("orders")
      .update({
        payment_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
    setUpdatingOrder(null)
    router.refresh()
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Itens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.profile?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{order.profile?.email}</p>
                </div>
              </TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell className="font-semibold">R$ {order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                  disabled={updatingOrder === order.id}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={order.payment_status}
                  onValueChange={(value) => handlePaymentStatusChange(order.id, value)}
                  disabled={updatingOrder === order.id}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{order.order_items.length} item(s)</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
