import { Card, CardBody, CardHeader, SkeletonText } from "@yamada-ui/react"

const SkeletonSessionCard = () => {
  return (
    <Card variant="subtle">
      <CardHeader>
        <SkeletonText lineClamp={1} textHeight={6} width="200px" />
      </CardHeader>
      <CardBody gap={1}>
        <SkeletonText lineClamp={1} textHeight={4} width="125px" />
        <SkeletonText lineClamp={1} textHeight={4} width="150px" />
      </CardBody>
    </Card>
  )
}

export default SkeletonSessionCard
