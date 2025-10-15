import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { CartItem, Product } from "@/lib/types"
import { CheckoutForm } from "@/components/checkout-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: cartItems } = await supabase
    .from("cart")
    .select(
      `
      *,
      product:products(*)
    `,
    )
    .eq("user_id", user.id)
    .returns<(CartItem & { product: Product })[]>()

  if (!cartItems || cartItems.length === 0) {
    redirect("/carrinho")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: addresses } = await supabase.from("addresses").select("*").eq("user_id", user.id)

  const subtotal =
    cartItems?.reduce((sum, item) => {
      const price = item.product.discount_percentage
        ? item.product.price * (1 - item.product.discount_percentage / 100)
        : item.product.price
      return sum + price * item.quantity
    }, 0) || 0

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Finalizar Compra</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm profile={profile} addresses={addresses || []} cartItems={cartItems} />
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const price = item.product.discount_percentage
                    ? item.product.price * (1 - item.product.discount_percentage / 100)
                    : item.product.price

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
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
                        <p className="text-sm font-semibold">R$ {(price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">R$ 15.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">R$ {(subtotal + 15).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
