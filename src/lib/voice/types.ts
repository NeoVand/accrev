export type SpeechBackend = 'webgpu' | 'wasm';
export type BackendPreference = 'auto' | SpeechBackend;

export interface VoiceDescriptor {
	id: string;
	name: string;
	gender: 'Female' | 'Male';
}

export interface LanguageDescriptor {
	code: string;
	name: string;
}

export interface ModelDescriptor {
	id: 'supertonic-3';
	name: string;
	repository: string;
	revision: string;
	license: 'OpenRAIL-M';
	licenseUrl: string;
	sizeMb: number;
	defaultVoice: string;
	voices: VoiceDescriptor[];
	languages: LanguageDescriptor[];
}

export interface DeviceCapabilities {
	webgpu: boolean;
	backend: SpeechBackend;
}

export interface LoadProgress {
	file?: string;
	status: string;
	progress: number;
	loaded?: number;
	total?: number;
}

export interface SynthesisMetrics {
	elapsedMs: number;
	audioDuration: number;
	backend: SpeechBackend;
}

export interface SynthesisResult {
	audio: Float32Array;
	sampleRate: number;
	metrics: SynthesisMetrics;
}
