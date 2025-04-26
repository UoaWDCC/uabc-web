"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useValidateEmailMutation } from "@/hooks/mutations/registration"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { Button } from "../../Generic/ui/button"
import { useToast } from "../../Generic/ui/use-toast"
import { OTPFormAlertDialog } from "./OTPFormAlertDialog"
import { emailSchema, passwordSchema } from "./formSchema"

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const EmailSignUpForm = () => {
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)

  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    email: "",
    password: "",
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate, isPending } = useValidateEmailMutation()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutate(data.email, {
      onSuccess: () => {
        setDialogOpen(true)
        setFormData(data)
      },
      onError: (e) => {
        if (e.message === "400") {
          setError("email", {
            type: "manual",
            message: "Email already in use",
          })
        } else {
          toast({
            title: "Uh oh! Something went wrong",
            description: "An error occurred while creating your account. Please try again.",
            variant: "destructive",
          })
        }
      },
    })
  }

  const handleSuccessfulSignUp = async () => {
    throw new Error("Sign up not implemented")
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <span className="text-center text-foreground">Create an Account</span>
          <TextInput
            autoFocus
            errorMessage={errors.email?.message}
            isError={!!errors.email}
            label="Email"
            type={InputType.Email}
            {...register("email")}
          />
          <TextInput
            errorMessage={errors.password?.message}
            isError={!!errors.password}
            label="Password"
            type={InputType.Password}
            {...register("password")}
          />
          <Button disabled={isPending} large type="submit">
            Sign Up with Email
          </Button>
        </div>
      </form>
      <OTPFormAlertDialog
        email={formData.email}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccessfulSignUp}
        open={dialogOpen}
        password={formData.password}
      />
    </>
  )
}
