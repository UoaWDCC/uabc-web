import { Popup } from "@repo/shared/enums"
import type {
  CreateMemberPopUpFormValues,
  CreateUserRequest,
  Gender,
  MembershipType,
  PlayLevel,
  University,
} from "@repo/shared/types"
import { AdminTableWithPaginatedQuery } from "@repo/ui/components/Composite"
import { CreateMemberPopUp } from "@repo/ui/components/Generic/CreateMemberPopUp"
import { Button } from "@repo/ui/components/Primitive"
import { Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import { useQueryState } from "nuqs"
import {
  useCreateUser,
  useResetAllMemberships,
  useUpdateUser,
} from "@/services/admin/user/AdminUserMutations"
import { useGetPaginatedUsers } from "@/services/admin/user/AdminUserQueries"

export const AdminMembers = () => {
  const notice = useNotice()

  const [openCreate, setOpenCreate] = useQueryState(Popup.CREATE_MEMBER)
  const { onClose: onCloseCreate } = useDisclosure()

  // TODO: make these refer to resetting members
  const { open: openConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure()
  const {
    open: openFinalConfirm,
    onOpen: onOpenFinalConfirm,
    onClose: onCloseFinalConfirm,
  } = useDisclosure()

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const resetAllMembershipsMutation = useResetAllMemberships()

  function handleAddConfirm(data: CreateMemberPopUpFormValues) {
    const createUserRequest: CreateUserRequest = {
      ...data,
      role: data.role as MembershipType,
      playLevel: data.playLevel as PlayLevel,
      gender: data.gender as Gender,
      university: data.university as University,
      image: null,
      emailVerification: {},
    }
    createUserMutation.mutate(createUserRequest, {
      onSuccess: () => {
        notice({
          title: "Creation successful",
          description: "User has been created",
          status: "success",
        })
      },
      onError: () => {
        notice({
          title: "Creation failed",
          description: "Failed to create user",
          status: "error",
        })
      },
    })
    setOpenCreate(null)
    onCloseCreate()
  }

  const handleResetConfirm = () => {
    onCloseConfirm()
    onOpenFinalConfirm()
  }

  const handleResetFinalConfirm = () => {
    onCloseFinalConfirm()
    resetAllMembershipsMutation.mutate(undefined, {
      onSuccess: () => {
        notice({
          title: "Membership reset successful",
          description: "All user memberships have been reset",
          status: "success",
        })
      },
      onError: () => {
        notice({
          title: "Membership reset failed",
          description: "Failed to reset user memberships",
          status: "error",
        })
      },
    })
  }

  return (
    <>
      <AdminTableWithPaginatedQuery
        onDelete={(id) => {
          deleteUserMutation.mutate(id, {
            onSuccess: () => {
              notice({
                title: "Deletion successful",
                description: "User has been deleted",
                status: "success",
              })
            },
            onError: () => {
              notice({
                title: "Deletion failed",
                description: "Failed to delete user",
                status: "error",
              })
            },
          })
        }}
        onEdit={(id, data) => {
          updateUserMutation.mutate(
            { id, data },
            {
              onSuccess: () => {
                notice({
                  title: "Update successful",
                  description: "User has been updated",
                  status: "success",
                })
              },
              onError: () => {
                notice({
                  title: "Update failed",
                  description: "Failed to update user",
                  status: "error",
                })
              },
            },
          )
        }}
        paginationWithEdges={false}
        useGetPaginatedData={useGetPaginatedUsers}
      />
      <Button colorScheme="danger" onClick={onOpenConfirm} placeSelf="start">
        Reset Memberships
      </Button>
      <CreateMemberPopUp
        onClose={onCloseCreate}
        onConfirm={(data) => handleAddConfirm(data)}
        open={openCreate === "true"}
      />
      <Dialog
        cancel="Cancel"
        header="Are you sure?"
        onCancel={onCloseConfirm}
        onClose={onCloseConfirm}
        onSuccess={handleResetConfirm}
        open={openConfirm}
        success={{
          children: "Reset",
          colorScheme: "danger",
        }}
      >
        This will reset all memberships. You cannot undo this action.
      </Dialog>
      <Dialog
        cancel="Cancel"
        header="Are you really sure?"
        onCancel={onCloseFinalConfirm}
        onClose={onCloseFinalConfirm}
        onSuccess={handleResetFinalConfirm}
        open={openFinalConfirm}
        success={{
          children: "Reset",
          colorScheme: "danger",
        }}
      >
        This will reset all memberships. You cannot undo this action.
      </Dialog>
    </>
  )
}
