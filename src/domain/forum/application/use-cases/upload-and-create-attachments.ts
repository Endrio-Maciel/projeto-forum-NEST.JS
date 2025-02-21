import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmenttype } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploaader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
    InvalidAttachmenttype,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploaader,
  ) {}

  async execute({
   fileName,
   fileType,
   body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
        return left(new InvalidAttachmenttype(fileType));
      }

    const { url } = await this.uploader.upload({
        fileName,
        fileType,
        body,
    })  
      
    const attachment = Attachment.create({
        title: fileName,
        url,
    })  
    
    await this.attachmentsRepository.create(attachment)

    return right({
        attachment
    })
  }
}
