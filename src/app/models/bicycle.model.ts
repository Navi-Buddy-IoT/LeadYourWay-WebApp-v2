export interface Bicycle {
  id: number;
  bicycleName: string;
  bicycleDescription: string;
  bicyclePrice: number;
  bicycleSize: string;
  bicycleModel: string;
  imageData: string;
  temperature: number;
}

export interface BicycleSave {
  bicycleName: string;
  bicycleDescription: string;
  bicyclePrice: number;
  bicycleSize: string;
  bicycleModel: string;
  imageData: string;
}
