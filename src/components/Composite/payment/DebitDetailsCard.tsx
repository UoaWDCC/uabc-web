import { CheckIcon, CopyIcon } from '@yamada-ui/lucide'
import { Card, CardBody, HStack, IconButton, Text, VStack, useClipboard } from '@yamada-ui/react'

interface DebitDetailsCardProps {
  title: string
  subtitle: string
  sessionId?: string
  copyText?: string
}

export const DebitDetailsCard = ({
  title,
  subtitle,
  sessionId,
  copyText,
}: DebitDetailsCardProps) => {
  const { onCopy, hasCopied } = useClipboard(copyText)
  return (
    <Card variant="solid" bg="gray.50" color={['black', 'white']}>
      <CardBody gap="0" pt="10" px="lg">
        <HStack w="full">
          <VStack gap="xs">
            <Text fontSize="xl" fontWeight="medium">
              {title}
            </Text>
            <Text color="tertiary">{subtitle}</Text>

            {sessionId && (
              <Text>
                SessionID:{' '}
                <Text as="span" fontWeight="bold">
                  {sessionId}
                </Text>
              </Text>
            )}
          </VStack>
          {copyText && (
            <IconButton variant="ghost" onClick={onCopy} placeSelf="flex-end">
              {hasCopied ? <CheckIcon fontSize="3xl" /> : <CopyIcon fontSize="3xl" />}
            </IconButton>
          )}
        </HStack>
      </CardBody>
    </Card>
  )
}
