import type { ModelDescriptor } from './types';

const voices: ModelDescriptor['voices'] = [
	...['F1', 'F2', 'F3', 'F4', 'F5'].map((id, index) => ({
		id,
		name: `Studio ${index + 1}`,
		gender: 'Female' as const
	})),
	...['M1', 'M2', 'M3', 'M4', 'M5'].map((id, index) => ({
		id,
		name: `Narrator ${index + 1}`,
		gender: 'Male' as const
	}))
];

export const SUPERTONIC_MODEL: ModelDescriptor = {
	id: 'supertonic-3',
	name: 'Supertonic 3',
	repository: 'Supertone/supertonic-3',
	revision: '3cadd1ee6394adea1bd021217a0e650ede09a323',
	license: 'OpenRAIL-M',
	licenseUrl: 'https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE',
	sizeMb: 415,
	defaultVoice: 'F1',
	voices,
	languages: [
		{ code: 'na', name: 'Auto / language-agnostic' },
		{ code: 'en', name: 'English' },
		{ code: 'ar', name: 'Arabic' },
		{ code: 'bg', name: 'Bulgarian' },
		{ code: 'hr', name: 'Croatian' },
		{ code: 'cs', name: 'Czech' },
		{ code: 'da', name: 'Danish' },
		{ code: 'nl', name: 'Dutch' },
		{ code: 'et', name: 'Estonian' },
		{ code: 'fi', name: 'Finnish' },
		{ code: 'fr', name: 'French' },
		{ code: 'de', name: 'German' },
		{ code: 'el', name: 'Greek' },
		{ code: 'hi', name: 'Hindi' },
		{ code: 'hu', name: 'Hungarian' },
		{ code: 'id', name: 'Indonesian' },
		{ code: 'it', name: 'Italian' },
		{ code: 'ja', name: 'Japanese' },
		{ code: 'ko', name: 'Korean' },
		{ code: 'lv', name: 'Latvian' },
		{ code: 'lt', name: 'Lithuanian' },
		{ code: 'pl', name: 'Polish' },
		{ code: 'pt', name: 'Portuguese' },
		{ code: 'ro', name: 'Romanian' },
		{ code: 'ru', name: 'Russian' },
		{ code: 'sk', name: 'Slovak' },
		{ code: 'sl', name: 'Slovenian' },
		{ code: 'es', name: 'Spanish' },
		{ code: 'sv', name: 'Swedish' },
		{ code: 'tr', name: 'Turkish' },
		{ code: 'uk', name: 'Ukrainian' },
		{ code: 'vi', name: 'Vietnamese' }
	]
};

export function isSupportedVoice(value: string): boolean {
	return SUPERTONIC_MODEL.voices.some((voice) => voice.id === value);
}

export function isSupportedLanguage(value: string): boolean {
	return SUPERTONIC_MODEL.languages.some((language) => language.code === value);
}
