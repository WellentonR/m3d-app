import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"
import Image from "next/image"

export default async function PerfilPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(*, product:products(*))
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <LogoutButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{profile?.full_name || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{profile?.phone || "Não informado"}</p>
              </div>
              {profile?.is_admin && (
                <div>
                  <Badge variant="secondary">Administrador</Badge>
                </div>
              )}
              {profile?.is_admin && (
                <Button asChild className="w-full">
                  <Link href="/admin">Painel Admin</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{order.status === "pending" ? "Pendente" : order.status}</Badge>
                          <p className="mt-1 font-bold text-primary">R$ {order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.order_items.slice(0, 2).map((item: any) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
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
                              <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.order_items.length - 2} item(s) adicional(is)
                          </p>
                        )}
                      </div>

                      <Button variant="outline" size="sm" className="mt-3 w-full bg-transparent" asChild>
                        <Link href={`/pedido/${order.id}`}>Ver Detalhes</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">Você ainda não fez nenhum pedido</p>
                  <Button asChild>
                    <Link href="/catalogo">Começar a Comprar</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
