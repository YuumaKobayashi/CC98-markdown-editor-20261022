export interface UserTitleDto {
  id: number;
  name: string;
  type: number;
  sortOrder: number;
  iconUri: string;
}

export interface PortraitStyleDto {
  width?: string;
  height?: string;
  position?: "absolute";
  left?: string;
  top?: string;
  zIndex?: string;
}

export interface PortraitConfigItemDto {
  style: PortraitStyleDto;
  imageUrl: string;
  portraitShadow: boolean;
}

export type PortraitConfigDto = Record<string, PortraitConfigItemDto>;
