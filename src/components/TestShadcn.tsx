import { Button } from "@/components/ui/button"

export function TestShadcn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">shadcn/ui Button Test</h1>
        <p className="text-gray-600">This button is from shadcn/ui components</p>
        <Button>Click me</Button>
      </div>
    </div>
  )
}