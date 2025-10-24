"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import type { Product } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single()

    if (existingItem) {
      await supabase
        .from("cart")
        .update({
          quantity: existingItem.quantity + quantity,
        })
        .eq("id", existingItem.id)
    } else {
      await supabase.from("cart").insert({
        user_id: user.id,
        product_id: product.id,
        quantity: quantity,
      })
    }

    setIsLoading(false)
    router.push("/carrinho")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantidade:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0 || isLoading}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isLoading ? "Adicionando..." : "Adicionar ao Carrinho"}
      </Button>
    </div>
  )
}
