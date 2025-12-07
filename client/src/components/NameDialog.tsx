"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

interface NameDialogProps {
  open: boolean
  onSubmit: (name: string) => void
}

export function NameDialog({ open, onSubmit }: NameDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.name)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[425px] bg-card border-white/10"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display tracking-wide text-2xl">Welcome to Neon Cinema</DialogTitle>
          <DialogDescription>
            Enter your name to get started. Others will see this name when you reserve seats.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Wick"
                      {...field}
                      className="bg-secondary/50 border-white/10 focus:border-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold tracking-wider">
              CONTINUE
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
