'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="border-white/30 bg-transparent text-chalk hover:bg-white/10 hover:text-chalk"
      onClick={() => window.print()}
    >
      <Printer /> Print
    </Button>
  )
}
