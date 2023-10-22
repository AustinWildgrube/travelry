import { manipulateAsync, type ImageResult, type SaveFormat } from 'expo-image-manipulator';

export const transformImageType = async (imageUri: string, type: SaveFormat): Promise<ImageResult> => {
  return await manipulateAsync(imageUri, [], { compress: 0.5, format: type, base64: true });
};
