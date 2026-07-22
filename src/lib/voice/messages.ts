import type {
	BackendPreference,
	DeviceCapabilities,
	ModelDescriptor,
	SpeechBackend,
	SynthesisMetrics
} from './types';

export type TtsWorkerRequest =
	| { type: 'capabilities'; requestId: string }
	| { type: 'load'; requestId: string; modelId: ModelDescriptor['id']; backend: BackendPreference }
	| {
			type: 'synthesize';
			requestId: string;
			text: string;
			voiceId: string;
			language: string;
			totalSteps: number;
			speed: number;
	  }
	| { type: 'cancel'; requestId: string }
	| { type: 'dispose'; requestId: string };

export type TtsWorkerResponse =
	| { type: 'capabilities'; requestId: string; capabilities: DeviceCapabilities }
	| {
			type: 'progress';
			requestId: string;
			file?: string;
			status: string;
			progress: number;
			loaded?: number;
			total?: number;
	  }
	| {
			type: 'loaded';
			requestId: string;
			modelId: ModelDescriptor['id'];
			backend: SpeechBackend;
	  }
	| {
			type: 'result';
			requestId: string;
			audio: Float32Array;
			sampleRate: number;
			metrics: SynthesisMetrics;
	  }
	| { type: 'disposed'; requestId: string }
	| { type: 'gpu-lost'; requestId: string; message: string }
	| { type: 'error'; requestId: string; message: string; recoverable: boolean };
