import { Popup } from "@repo/shared/enums"
import type { GameSessionSchedule, Semester } from "@repo/shared/payload-types"
import type { CreateGameSchedulePopUpFormValues } from "@repo/shared/schemas"
import type { CreateSemesterData } from "@repo/shared/types"
import { timeInputToIso } from "@repo/shared/utils"
import { CreateGameSchedulePopUp, CreateSemesterPopUpFlow } from "@repo/ui/components/Generic"
import { Accordion, Button, Center, Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useCallback, useState } from "react"
import {
  useCreateGameSessionSchedule,
  useDeleteGameSessionSchedule,
  useUpdateGameSessionSchedule,
} from "@/services/admin/game-session-schedule/AdminGameSessionScheduleMutations"
import {
  useCreateSemester,
  useDeleteSemester,
  useUpdateSemester,
} from "@/services/admin/semester/AdminSemesterMutations"
import { useGetAllSemesters } from "@/services/semester/SemesterQueries"
import { SemesterScheduleAccordionItem } from "./SemesterScheduleAccordionItem"

export const AdminSemesters = () => {
  const notice = useNotice()

  const { data: allSemesters } = useGetAllSemesters()

  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set([0]))

  // Delete semester logic
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null)
  const {
    open: openDeleteSemester,
    onOpen: onOpenDeleteSemester,
    onClose: onCloseDeleteSemester,
  } = useDisclosure()
  const deleteSemesterMutation = useDeleteSemester()
  const handleDeleteSemesterConfirm = useCallback(() => {
    if (!semesterToDelete) {
      return
    }
    deleteSemesterMutation.mutate(semesterToDelete, {
      onSuccess: () => {
        notice({
          title: "Deletion successful",
          description: "Semester has been deleted",
          status: "success",
        })
        onCloseDeleteSemester()
        setSemesterToDelete(null)
      },
      onError: () => {
        notice({
          title: "Deletion failed",
          description: "Failed to delete semester",
          status: "error",
        })
      },
    })
  }, [deleteSemesterMutation, semesterToDelete, notice, onCloseDeleteSemester])

  // Create semester logic
  const [openCreateSemester, setOpenCreateSemester] = useQueryState(
    Popup.CREATE_SEMESTER,
    parseAsBoolean,
  )
  const createSemesterMutation = useCreateSemester()
  const handleCreateSemester = useCallback(
    (newSemester: CreateSemesterData) => {
      createSemesterMutation.mutate(newSemester, {
        onSuccess: () => {
          notice({
            title: "Creation successful",
            description: "Semester has been created",
            status: "success",
          })
        },
        onError: () => {
          notice({
            title: "Creation failed",
            description: "Failed to create semester",
            status: "error",
          })
        },
      })
    },
    [createSemesterMutation, notice],
  )

  // Edit semester logic
  const [semesterToEdit, setSemesterToEdit] = useState<Semester | null>(null)
  const {
    open: openUpdateSemester,
    onOpen: onOpenUpdateSemester,
    onClose: onCloseUpdateSemester,
  } = useDisclosure()
  const updateSemesterMutation = useUpdateSemester()
  const handleEditSemester = useCallback(
    (semester: Semester) => {
      setSemesterToEdit(semester)
      onOpenUpdateSemester()
    },
    [onOpenUpdateSemester],
  )
  const handleEditSemesterConfirm = useCallback(
    (data: CreateSemesterData) => {
      if (!semesterToEdit) {
        return
      }
      updateSemesterMutation.mutate(
        {
          id: semesterToEdit.id,
          data,
        },
        {
          onSuccess: () => {
            notice({
              title: "Update successful",
              description: "Semester has been updated",
              status: "success",
            })
            onCloseUpdateSemester()
            setSemesterToEdit(null)
          },
          onError: () => {
            notice({
              title: "Update failed",
              description: "Failed to update semester",
              status: "error",
            })
          },
        },
      )
    },
    [updateSemesterMutation, semesterToEdit, notice, onCloseUpdateSemester],
  )

  // Create game session schedule logic
  const [scheduleTargetSemesterId, setScheduleTargetSemesterId] = useState<string | null>(null)
  const {
    open: openCreateSchedule,
    onOpen: onOpenCreateSchedule,
    onClose: onCloseCreateSchedule,
  } = useDisclosure()
  const createScheduleMutation = useCreateGameSessionSchedule()
  const handleAddSchedule = useCallback(
    (semesterId: string) => {
      setScheduleTargetSemesterId(semesterId)
      onOpenCreateSchedule()
    },
    [onOpenCreateSchedule],
  )
  const handleCreateScheduleConfirm = useCallback(
    (data: CreateGameSchedulePopUpFormValues) => {
      if (!scheduleTargetSemesterId) {
        return
      }
      createScheduleMutation.mutate(
        {
          ...data,
          semester: scheduleTargetSemesterId,
          startTime: timeInputToIso(data.startTime),
          endTime: timeInputToIso(data.endTime),
        },
        {
          onSuccess: () => {
            notice({
              title: "Creation successful",
              description: "Session schedule has been created",
              status: "success",
            })
            onCloseCreateSchedule()
            setScheduleTargetSemesterId(null)
          },
          onError: () => {
            notice({
              title: "Creation failed",
              description: "Failed to create session schedule",
              status: "error",
            })
          },
        },
      )
    },
    [createScheduleMutation, scheduleTargetSemesterId, notice, onCloseCreateSchedule],
  )

  // Edit game session schedule logic
  const [scheduleToEdit, setScheduleToEdit] = useState<GameSessionSchedule | null>(null)
  const {
    open: openEditSchedule,
    onOpen: onOpenEditSchedule,
    onClose: onCloseEditSchedule,
  } = useDisclosure()
  const updateScheduleMutation = useUpdateGameSessionSchedule()
  const handleEditSchedule = useCallback(
    (schedule: GameSessionSchedule) => {
      setScheduleToEdit(schedule)
      onOpenEditSchedule()
    },
    [onOpenEditSchedule],
  )
  const handleEditScheduleConfirm = useCallback(
    (data: CreateGameSchedulePopUpFormValues) => {
      if (!scheduleToEdit) {
        return
      }
      updateScheduleMutation.mutate(
        {
          id: scheduleToEdit.id,
          data: {
            ...data,
            startTime: timeInputToIso(data.startTime),
            endTime: timeInputToIso(data.endTime),
          },
        },
        {
          onSuccess: () => {
            notice({
              title: "Update successful",
              description: "Session schedule has been updated",
              status: "success",
            })
            onCloseEditSchedule()
            setScheduleToEdit(null)
          },
          onError: () => {
            notice({
              title: "Update failed",
              description: "Failed to update session schedule",
              status: "error",
            })
          },
        },
      )
    },
    [updateScheduleMutation, scheduleToEdit, notice, onCloseEditSchedule],
  )

  // Delete game session logic
  const deleteScheduleMutation = useDeleteGameSessionSchedule()
  const handleDeleteSchedule = useCallback(
    (sessionId: string) => {
      deleteScheduleMutation.mutate(sessionId, {
        onSuccess: () => {
          notice({
            title: "Deletion successful",
            description: "Session schedule has been deleted",
            status: "success",
          })
        },
        onError: () => {
          notice({
            title: "Deletion failed",
            description: "Failed to delete session schedule",
            status: "error",
          })
        },
      })
    },
    [deleteScheduleMutation, notice],
  )

  return (
    <>
      <Button
        colorScheme="primary"
        onClick={() => {
          setOpenCreateSemester(true)
        }}
        placeSelf="start"
      >
        Create Semester
      </Button>
      {/* Main Admin Semesters accordion */}
      <Accordion
        defaultIndex={[0]}
        multiple
        onChange={(openIndexes) => {
          setExpandedIndexes(new Set(openIndexes as number[]))
        }}
      >
        {allSemesters?.data.length ? (
          allSemesters.data.map((sem, index) => (
            <SemesterScheduleAccordionItem
              enabled={expandedIndexes.has(index)}
              key={sem.id}
              onAddSchedule={() => handleAddSchedule(sem.id)}
              onDeleteSchedule={handleDeleteSchedule}
              onDeleteSemester={(semId) => {
                setSemesterToDelete(semId)
                onOpenDeleteSemester()
              }}
              onEditSchedule={handleEditSchedule}
              onEditSemester={handleEditSemester}
              semester={sem}
            />
          ))
        ) : (
          <Center>No semesters found</Center>
        )}
      </Accordion>
      {/* Action flows and confirmations */}
      <CreateGameSchedulePopUp
        key={scheduleTargetSemesterId}
        onClose={onCloseCreateSchedule}
        onConfirm={handleCreateScheduleConfirm}
        open={openCreateSchedule}
      />
      <CreateGameSchedulePopUp
        key={scheduleToEdit?.id}
        onClose={() => {
          onCloseEditSchedule()
          setScheduleToEdit(null)
        }}
        onConfirm={handleEditScheduleConfirm}
        open={openEditSchedule}
        scheduleToEdit={scheduleToEdit} // Editing schedule
        title="Edit Game Schedule"
      />
      <CreateSemesterPopUpFlow
        onClose={() => {
          setOpenCreateSemester(false)
        }}
        onComplete={handleCreateSemester}
        open={!!openCreateSemester}
      />
      <CreateSemesterPopUpFlow
        confirmationTitle="Semester Edit Confirmation"
        initialValues={
          semesterToEdit
            ? {
                ...semesterToEdit,
              }
            : undefined
        }
        key={semesterToEdit?.id}
        onClose={() => {
          onCloseUpdateSemester()
          setSemesterToEdit(null)
        }}
        onComplete={handleEditSemesterConfirm}
        open={openUpdateSemester}
      />
      <Dialog
        cancel="Cancel"
        header="Delete Semester"
        onCancel={onCloseDeleteSemester}
        onClose={onCloseDeleteSemester}
        onSuccess={handleDeleteSemesterConfirm}
        open={openDeleteSemester}
        success={{
          children: "Delete",
          colorScheme: "danger",
          loading: deleteSemesterMutation.isPending,
        }}
      >
        Are you sure you want to delete this semester? This action cannot be undone.
      </Dialog>
    </>
  )
}
