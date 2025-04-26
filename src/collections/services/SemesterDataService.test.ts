import { clearCollection, testPayloadObject } from '@/../tests/utils'
import SemesterService from './SemesterDataService'
import { semesterCreateMock, semesterUpdateMock } from '@/../tests/mocks/Semester.mock'
import { afterEach, describe, expect, it } from 'vitest'

describe('Semester service tests', () => {
  const semesterService = new SemesterService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'semester')
  })

  it('should create a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    const fetchedSemester = await testPayloadObject.findByID({
      collection: 'semester',
      id: newSemester.id,
    })
    expect(newSemester).toEqual(fetchedSemester)
  })

  it('should get a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    const fetchedSemester = await semesterService.getSemester(newSemester.id)
    expect(newSemester).toEqual(fetchedSemester)
  })

  it('should get all semesters', async () => {
    const semester1 = await semesterService.createSemester(semesterCreateMock)
    const semester2 = await semesterService.createSemester(semesterCreateMock)
    const fetchedSemester = await semesterService.getAllSemesters()
    expect(fetchedSemester.docs.length).toEqual(2)
    expect(fetchedSemester.docs).toEqual(expect.arrayContaining([semester1, semester2]))
  })

  it('should return undefined if semester does not exist', async () => {
    await expect(semesterService.getSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should update a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    const updatedSemester = await semesterService.updateSemester(newSemester.id, semesterUpdateMock)
    console.log(updatedSemester.bookingOpenTime)
    expect(updatedSemester.name).toEqual('Semester 1 2026')
    expect(updatedSemester.bookingOpenDay).toEqual('wednesday')
  })

  it('should delete a semester', async () => {
    const newSemester = await semesterService.createSemester(semesterCreateMock)
    await semesterService.deleteSemester(newSemester.id)
    await expect(
      testPayloadObject.findByID({
        collection: 'semester',
        id: newSemester.id,
      }),
    ).rejects.toThrow('Not Found')
  })

  it('should throw an error if semester does not exist', async () => {
    await expect(semesterService.deleteSemester('nonexistent_id')).rejects.toThrow('Not Found')
  })
})
