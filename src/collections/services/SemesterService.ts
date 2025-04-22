import { getPayload, PaginatedDocs } from 'payload'
import configPromise from '@payload-config'
import { CreateSemesterData, UpdateSemesterData } from '@/types/collections'
import { Semester } from '@/payload-types'

const payload = await getPayload({
  config: configPromise,
})

export default class SemesterService {
  public async getAllSemesters(): Promise<PaginatedDocs<Semester>> {
    return await payload.find({
      collection: 'semester',
    })
  }
  public async createSemester(createSemesterData: CreateSemesterData): Promise<Semester> {
    return await payload.create({
      collection: 'semester',
      data: createSemesterData,
    })
  }
  public async getSemester(semesterId: string): Promise<Semester> {
    return await payload.findByID({
      collection: 'semester',
      id: semesterId,
    })
  }
  public async updateSemester(
    semesterId: string,
    updateSemesterData: UpdateSemesterData,
  ): Promise<Semester> {
    return await payload.update({
      collection: 'semester',
      id: semesterId,
      data: updateSemesterData,
    })
  }
  public async deleteSemester(semesterId: string): Promise<void> {
    await payload.delete({
      collection: 'semester',
      id: semesterId,
    })
  }
}
