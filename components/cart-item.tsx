"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import type { CartItem, Product } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface CartItemComponentProps {
  item: CartItem & { product: Product }
}

export function CartItemComponent({ item }: CartItemComponentProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const finalPrice = item.product.discount_percentage
    ? item.product.price * (1 - item.product.discount_percentage / 100)
    : item.product.price

  const updateQuantity = async (newQuantity: number) => {
    setIsUpdating(true)
    setQuantity(newQuantity)

    await supabase
      .from("cart")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id)

    setIsUpdating(false)
    router.refresh()
  }

  const removeItem = async () => {
    setIsUpdating(true)
    await supabase.from("cart").delete().eq("id", item.id)
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={
                item.product.image_url ||
                `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(item.product.name) || "/placeholder.svg"}`
              }
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold text-balance line-clamp-1">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">R$ {finalPrice.toFixed(2)} cada</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isUpdating}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(Math.min(item.product.stock, quantity + 1))}
                  disabled={quantity >= item.product.stock || isUpdating}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-primary">R$ {(finalPrice * quantity).toFixed(2)}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={removeItem} disabled={isUpdating}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
