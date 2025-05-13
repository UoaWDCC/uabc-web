import { Card, CardBody, CardHeader, Center } from "@yamada-ui/react"

export function PendingApprovalCard() {
  return (
    <Card as={Center} variant="solid">
      <CardHeader>Account Pending Approval</CardHeader>
      <CardBody>
        Your account is pending approval. You will be able to book sessions once approved
      </CardBody>
    </Card>
  )
}
