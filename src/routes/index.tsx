import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div>
        <h1 className="text-3xl text-red-400 font-bold underline">Hello World!</h1>
        <div>
          <Button>Click</Button>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}