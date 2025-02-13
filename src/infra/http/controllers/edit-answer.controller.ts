import { BadRequestException, Body, Controller, HttpCode, Param, Put,  } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

const editanswerBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editanswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editanswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
constructor(
  private editanswer: EditAnswerUseCase
 ) {}
 
  @Put()
  @HttpCode(204)
  async handle(
  @Body(bodyValidationPipe) body: EditAnswerBodySchema,
  @CurrentUser() user: UserPayload,
  @Param('id') answerId: string,
) {
    const { content } = body
    const userId = user.sub

    const result = await this .editanswer.execute({
      content,
      authorId: userId,
      attachmentsIds: [],
      answerId
    }) 

     if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}