import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Miniaturas 3D. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
