export type PermissionStatus = 'granted' | 'denied' | 'prompt';

export interface PermissionState {
  camera: PermissionStatus;
  microphone: PermissionStatus;
}

export interface VoiceAnalysisResult {
  feedback: string;
  pace: 'slow' | 'normal' | 'fast';
  tremor: boolean;
  fillers: number;
}
