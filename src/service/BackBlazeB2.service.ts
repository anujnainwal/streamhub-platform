// @ts-ignore

import B2 from "backblaze-b2";
import { createHash } from "crypto";

export class BackblazeB2Service {
  private static instance: BackblazeB2Service;
  private b2: B2;
  private isAuthorized = false;

  private constructor() {
    this.b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID!,
      applicationKey: process.env.B2_APPLICATION_KEY!,
    });
  }

  /**
   * Singleton instance of BackblazeB2Service
   */
  public static getInstance(): BackblazeB2Service {
    if (!BackblazeB2Service.instance) {
      BackblazeB2Service.instance = new BackblazeB2Service();
    }
    return BackblazeB2Service.instance;
  }

  /**
   * Authorize B2 client if not already done
   */
  private async authorizeIfNeeded(): Promise<void> {
    if (!this.isAuthorized) {
      await this.b2.authorize();
      this.isAuthorized = true;
    }
  }

  /**
   * Starts a new large file upload session
   * @param bucketId - B2 bucket ID
   * @param fileName - File name to save
   * @param mimeType - MIME type
   * @returns fileId
   */
  public async startLargeFile(
    bucketId: string,
    fileName: string,
    mimeType = "application/octet-stream"
  ): Promise<string> {
    await this.authorizeIfNeeded();
    const { data } = await this.b2.startLargeFile({
      bucketId,
      fileName,
      contentType: mimeType,
    });
    return data.fileId;
  }

  /**
   * Upload a single chunk/part of a large file
   * @param fileId - File ID from startLargeFile
   * @param partNumber - Chunk part number (starts from 1)
   * @param chunkBuffer - Chunk binary data
   * @returns Uploaded partNumber and SHA1
   */
  public async uploadPart(
    fileId: string,
    partNumber: number,
    chunkBuffer: Buffer
  ): Promise<{ partNumber: number; sha1: string }> {
    await this.authorizeIfNeeded();
    const { data: uploadPartData } = await this.b2.getUploadPartUrl({ fileId });

    const sha1 = this.getSha1(chunkBuffer);

    await this.b2.uploadPart({
      uploadUrl: uploadPartData.uploadUrl,
      uploadAuthToken: uploadPartData.authorizationToken,
      partNumber,
      data: chunkBuffer,
      hash: sha1,
    });

    return { partNumber, sha1 };
  }

  /**
   * Finish a large file upload by passing all part SHA1s
   * @param fileId - File ID to finish
   * @param partSha1Array - Array of part hashes in order
   * @returns File metadata
   */
  public async finishLargeFile(
    fileId: string,
    partSha1Array: string[]
  ): Promise<any> {
    await this.authorizeIfNeeded();
    const { data } = await this.b2.finishLargeFile({
      fileId,
      partSha1Array,
    });
    return data;
  }

  /**
   * Cancel an in-progress large file upload
   * @param fileId - File ID to cancel
   */
  public async cancelLargeFile(fileId: string): Promise<void> {
    await this.authorizeIfNeeded();
    await this.b2.cancelLargeFile({ fileId });
  }

  /**
   * Generate SHA1 hash of a buffer
   * @param buffer - Chunk data
   * @returns SHA1 hash
   */
  private getSha1(buffer: Buffer): string {
    return createHash("sha1").update(buffer).digest("hex");
  }
}
