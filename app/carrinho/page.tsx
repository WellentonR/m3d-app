import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { CartItem, Product } from "@/lib/types"
import { CartItemComponent } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export default async function CarrinhoPage() {
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

  const total =
    cartItems?.reduce((sum, item) => {
      const price = item.product.discount_percentage
        ? item.product.price * (1 - item.product.discount_percentage / 100)
        : item.product.price
      return sum + price * item.quantity
    }, 0) || 0

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Carrinho de Compras</h1>

      {cartItems && cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">Calculado no checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Seu carrinho está vazio</h2>
            <p className="mb-6 text-muted-foreground">Adicione produtos para começar suas compras</p>
            <Button asChild>
              <Link href="/catalogo">Ver Catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
