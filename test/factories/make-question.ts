import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {Question, QuestionProps,} from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQUestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudio(data: Partial<QuestionProps> = {}) {
   
    const question = makeQuestion(data)
    return this.prisma.question.create({
      data: PrismaQUestionMapper.toPrisma(question),
    })

    return question
  }
}