export const hasCompatibleImageExtension = (imagePath: string): boolean => {
  return imagePath.match(/.(jpg|jpeg|png|gif|webp)$/i) !== null;
}

export const hasCompatibleSoundExtension = (soundPath: string): boolean => {
  return soundPath.match(/.(mp3|ogg|m4a)$/i) !== null;
}

export const hasCompatibleVideoExtension = (videoPath: string): boolean => {
  return videoPath.match(/.(mp4|m4v|webm)$/i) !== null;
}

