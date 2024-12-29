import type {Dict} from '@blake.regalia/belt';
import {fold} from '@blake.regalia/belt'


export function under<w_values>(h_map: Dict<Dict<w_values>>): Dict<w_values> {
	const h_out: Dict<w_values> = {};

	for(const [si_prefix, h_parts] of Object.entries(h_map)) {
		for(const [si_suffix, w_value] of Object.entries(h_parts)) {
			h_out[si_prefix+si_suffix] = w_value;
		}
	}

	return h_out;
}

export const off = (a_rules: string[]) => fold(a_rules, s => ({[s]:'off'}));
export const warn = (a_rules: string[]) => fold(a_rules, s => ({[s]:'warn'}));
export const error = (a_rules: string[]) => fold(a_rules, s => ({[s]:'error'}));