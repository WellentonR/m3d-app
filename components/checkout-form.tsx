"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { CartItem, Product } from "@/lib/types"

interface CheckoutFormProps {
  profile: any
  addresses: any[]
  cartItems: (CartItem & { product: Product })[]
}

export function CheckoutForm({ profile, addresses, cartItems }: CheckoutFormProps) {
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((a) => a.is_default)?.id || "new")
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [newAddress, setNewAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zip_code: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      let addressId = selectedAddress

      // Create new address if needed
      if (selectedAddress === "new") {
        const { data: address, error: addressError } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            ...newAddress,
          })
          .select()
          .single()

        if (addressError) throw addressError
        addressId = address.id
      }

      // Calculate total
      const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product.discount_percentage
          ? item.product.price * (1 - item.product.discount_percentage / 100)
          : item.product.price
        return sum + price * item.quantity
      }, 0)

      const total = subtotal + 15 // Adding shipping

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          address_id: addressId,
          total,
          status: "pending",
          payment_status: "pending",
          payment_method: paymentMethod,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => {
        const price = item.product.discount_percentage
          ? item.product.price * (1 - item.product.discount_percentage / 100)
          : item.product.price

        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price,
        }
      })

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      await supabase.from("cart").delete().eq("user_id", user.id)

      router.push(`/pedido/${order.id}`)
    } catch (error) {
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length > 0 ? (
            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                    <p className="font-medium">
                      {address.street}, {address.number}
                    </p>
                    {address.complement && <p className="text-sm text-muted-foreground">{address.complement}</p>}
                    <p className="text-sm text-muted-foreground">
                      {address.neighborhood}, {address.city} - {address.state}
                    </p>
                    <p className="text-sm text-muted-foreground">CEP: {address.zip_code}</p>
                  </Label>
                </div>
              ))}
              <div className="flex items-start space-x-2 rounded-lg border p-4">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="cursor-pointer font-medium">
                  Adicionar novo endereço
                </Label>
              </div>
            </RadioGroup>
          ) : (
            <p className="mb-4 text-sm text-muted-foreground">Nenhum endereço cadastrado. Adicione um novo.</p>
          )}

          {(selectedAddress === "new" || addresses.length === 0) && (
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="zip_code">CEP</Label>
                <Input
                  id="zip_code"
                  value={newAddress.zip_code}
                  onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={newAddress.number}
                    onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={newAddress.complement}
                    onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={newAddress.neighborhood}
                  onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    required
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
              <SelectItem value="boleto">Boleto Bancário</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Processando..." : "Confirmar Pedido"}
      </Button>
    </form>
  )
}
