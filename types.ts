export interface AppElement {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'hero' | 'product';
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    src?: string;
    label?: string;
    price?: string;
  };
  style: {
    backgroundColor?: string;
    textColor?: string;
    align?: 'left' | 'center' | 'right';
    padding?: string;
    borderRadius?: string;
  };
}

export interface AppState {
  appName: string;
  elements: AppElement[];
  themeColor: string;
}

export interface AIGenerationResponse {
  appName: string;
  elements: AppElement[];
  themeColor: string;
}
