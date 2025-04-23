import { NextRequest } from 'next/server'
import SemesterService from '@/collections/services/SemesterService'
import { semesterCreateMock } from '@/../tests/mocks/Semester.mock'
import { clearCollection, paramsToPromise, testPayloadObject } from '@/../tests/utils'
import { DELETE } from './route'
import { StatusCodes } from 'http-status-codes'
import { afterEach, describe, expect, it } from 'vitest'

describe('tests /api/admin/semesters/[id]', () => {
  const semesterService = new SemesterService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'semester')
  })

  describe('DELETE /api/admin/semesters/[id]', () => {
    it('should delete a semester', async () => {
      const newSemester = await semesterService.createSemester(semesterCreateMock)
      const res = await DELETE({} as NextRequest, {
        params: paramsToPromise({ id: newSemester.id }),
      })
      expect(res.status).toBe(StatusCodes.NO_CONTENT)
      await expect(semesterService.getSemester(newSemester.id)).rejects.toThrow('Not Found')
    })

    it('should return a 404 error if the semester does not exist', async () => {
      const res = await DELETE({} as NextRequest, { params: paramsToPromise({ id: 'not found' }) })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    })
  })
})
