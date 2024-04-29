import {
  ReadResult,
  readBarcodesFromImageData,
  type ReaderOptions,
} from "zxing-wasm/reader";

class CameraService {
  private static readonly readerOptions: ReaderOptions = {
    tryHarder: true,
    formats: ["QRCode"],
  };

  public static async requestCameraAccess(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
  }

  public static async scanVideoFrame(
    video: HTMLVideoElement,
    scanAreaWidth: number,
    scanAreaHeight: number,
  ): Promise<ReadResult> {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const scanAreaLeft = (videoWidth - scanAreaWidth) / 2;
    const scanAreaTop = (videoHeight - scanAreaHeight) / 2;

    const context = new OffscreenCanvas(videoWidth, videoHeight).getContext(
      "2d",
    ) as OffscreenCanvasRenderingContext2D;

    context.drawImage(
      video,
      scanAreaLeft,
      scanAreaTop,
      scanAreaWidth,
      scanAreaHeight,
      0,
      0,
      scanAreaWidth,
      scanAreaHeight,
    );

    const imageData = context.getImageData(0, 0, scanAreaWidth, scanAreaHeight);

    const [processedData] = await readBarcodesFromImageData(
      imageData,
      CameraService.readerOptions,
    );

    return processedData;
  }
}

export { CameraService };
