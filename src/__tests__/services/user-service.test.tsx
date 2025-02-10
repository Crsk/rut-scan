import { describe, it, expect, vi, beforeEach } from 'vitest'
import { objectToSnake } from 'ts-case-convert'
import { UserService as IUserService, UserRepository } from '@/core/adapters/user-repository.interface'
import { UserProps } from '@/core/domain/user/user-props.interface'
import { UserInMemoryRepository } from '@/domain/users/api/user-in-memory.repository'
import { UserService } from '@/domain/users/api/user.service'
import { createUser } from '@/domain/users/utils/create-user'
import { generateId } from '@/utils/generate-id'

vi.mock('@/utils/generate-id', () => ({
  generateId: () => 'test-id'
}))

describe('UserService', () => {
  let repository: UserRepository
  let service: IUserService

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    service = new UserService(repository)
  })

  describe('service', () => {
    it('should generate id', async () => {
      const addSpy = vi.spyOn(repository, 'add')

      // create a doc without id
      await service.add({ json: { name: 'no-id' } })

      // the repo receives the generated id
      expect(addSpy).toHaveBeenCalledWith({
        json: objectToSnake(createUser({ id: generateId(), name: 'no-id' }))
      })

      // the user was properly created
      const users = await service.getAll()
      expect(users.find(x => x.id === 'test-id')).toBeDefined()
      expect(users).toHaveLength(1)
    })
    it('should create users', async () => {
      const repoGetByIdSpy = vi.spyOn(repository, 'add')
      const sampleUsers: UserProps[] = [
        createUser({ id: '1', name: 'User 1', email: 'user1@mail.com' }),
        createUser({ id: '2', name: 'User 2', email: 'user2@mail.com' })
      ]

      // create the first user
      await service.add({ json: sampleUsers[0] })
      expect(repoGetByIdSpy).toHaveBeenCalledWith({ json: objectToSnake(sampleUsers[0]) })

      // get users, should be 1
      const users = await service.getAll()
      expect(users).toHaveLength(1)
      expect(users).toEqual([sampleUsers[0]])

      // create a second user
      await service.add({ json: sampleUsers[1] })
      expect(repoGetByIdSpy).toHaveBeenCalledWith({ json: objectToSnake(sampleUsers[1]) })

      // get users, should be 2
      const users2 = await service.getAll()
      expect(users2).toHaveLength(2)
      expect(users2).toEqual(sampleUsers)
    })

    it('should update user', async () => {
      const updateSpy = vi.spyOn(repository, 'update')
      const user = createUser({ id: '1', name: 'Original Name', email: 'test@mail.com' })

      // create initial user
      await service.add({ json: user })
      const users = await service.getAll()
      expect(users).toHaveLength(1)
      expect(users[0]).toEqual(user)

      // update the user
      const updates = { name: 'Updated Name' }
      await service.update({ id: '1', updated: updates })

      // verify repository was called properly
      expect(updateSpy).toHaveBeenCalledWith({ id: '1', updated: objectToSnake(updates) })

      // verify user was updated
      const updatedUsers = await service.getAll()
      expect(updatedUsers).toHaveLength(1)
      expect(updatedUsers[0]).toEqual({ ...user, ...updates })
    })
  })
})
