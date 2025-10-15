import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      address:addresses(*),
      order_items(*, product:products(*))
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    redirect("/")
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CheckCircle2 className="mb-4 h-16 w-16 text-green-600" />
            <h1 className="mb-2 text-3xl font-bold">Pedido Confirmado!</h1>
            <p className="mb-6 text-muted-foreground">
              Obrigado pela sua compra. Seu pedido foi recebido e está sendo processado.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/catalogo">Continuar Comprando</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/perfil">Ver Meus Pedidos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Número do Pedido:</span>
                <span className="font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium">{new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary">{order.status === "pending" ? "Pendente" : order.status}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pagamento:</span>
                <Badge variant="outline">
                  {order.payment_method === "pix"
                    ? "PIX"
                    : order.payment_method === "credit_card"
                      ? "Cartão de Crédito"
                      : "Boleto"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {order.address.street}, {order.address.number}
            </p>
            {order.address.complement && <p className="text-sm text-muted-foreground">{order.address.complement}</p>}
            <p className="text-sm text-muted-foreground">
              {order.address.neighborhood}, {order.address.city} - {order.address.state}
            </p>
            <p className="text-sm text-muted-foreground">CEP: {order.address.zip_code}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-muted">
                  <Image
                    src={
                      item.product.image_url ||
                      `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(item.product.name) || "/placeholder.svg"}`
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                  <p className="font-semibold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">R$ {(order.total - 15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="font-medium">R$ 15.00</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
