import { ListType } from "@repo/ui/components/Generic"
import { createEditorState, createListNode } from "@repo/ui/test-config/mocks/RichText.mock"

export const mockCasualMemberInformation = createEditorState([
  createListNode(ListType.ORDERED, [
    "Casual members can only attend 1 session a week.",
    "It is $10 per session and is to be paid before attending to secure your spot. We will send you an email for this, please do not pay unless we reach out to you.",
    "We aim to prioritize members over casuals!",
    "The number of casuals allowed per session may vary dependent on capacity",
  ]),
])

export const mockOnboardingGlobal = {
  casualMemberInformation: mockCasualMemberInformation,
}
