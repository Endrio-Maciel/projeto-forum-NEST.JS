import { Uploaader, UploadParams } from "@/domain/forum/application/storage/uploader";
import { randomUUID } from "crypto";

interface Upload {
    fileName: string
    url: string
}

export class FakeUpLoader implements Uploaader {
    public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string; }> {
    const url = randomUUID()
    
    this.uploads.push({
        fileName,
        url,
    })
    
    return { url };
    }
}