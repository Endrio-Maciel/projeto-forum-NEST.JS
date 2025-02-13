import { BadRequestException, Body, Controller, HttpCode, Param, Put,  } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";

const editquestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editquestionBodySchema)

type EditquestionBodySchema = z.infer<typeof editquestionBodySchema>

@Controller('/questions/:id')
export class EditquestionController {
constructor(
  private editquestion: EditQuestionUseCase
 ) {}
 
  @Put()
  @HttpCode(204)
  async handle(
  @Body(bodyValidationPipe) body: EditquestionBodySchema,
  @CurrentUser() user: UserPayload,
  @Param('id') questionId: string,
) {
    const { title, content } = body
    const userId = user.sub

    const result = await this .editquestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId
    }) 

     if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}