type Dict<w_out> = Record<string, w_out>;

/**
 * Reduce an object's entries to an array via concatenation (with filtering)
 * @param w_src - value that will get passed to `Object.entries`
 * @param f_concat - callback having signature `(key, value, index) => item`
 * @param b_keep_undefs - by default, `undefined` items will be ommitted from return array unless this is truthy
 * @param a_out - optionally specifies the output array to merge items into
 * @returns an array of the `item` returned by {@link f_concat}
 */
export const concat_entries = <
	w_out extends any,
>(
	w_src: any,
	f_concat: (si_key: string, w_value: any, i_entry: number) => w_out,
	b_keep_undefs: boolean|0|1=0,
	a_out: w_out[]=[]
) => Object.entries(w_src).reduce((a_acc, [si_key, w_value], i_entry) => {
	// invoke callback and capture return value
	const w_add = f_concat(si_key, w_value, i_entry);

	// add result to array iff not undefined or if undefined values are explictly allowed
	if(undefined !== w_add || b_keep_undefs) a_acc.push(w_add);

	return a_acc;
}, a_out);


/**
 * Fold an array into an object via reduction, i.e., by transforming each value into an object and merging it into a single output.
 * 
 * Useful when the number of output entries per input entry can vary. For 1:1 multiplicity see also {@link collapse}.
 * 
 * Example:
 * ```ts
 * // turn a list of strings into a dict
 * fold(['a', 'b', 'c'], (value, index) => ({[value]: index}))
 * // output: {a:0, b:1, c:2}
 * ```
 * 
 * The return type is dynamically constructed with the following precedence:
 *  - 1. from explicit type arguments if given `fold<IterableItemValue, OutputKey, OutputValue>(...)`
 *  - 2. from the type of the {@link h_out} argument if it was defined
 *  - 3. from the return type of the {@link f_fold} callback
 * @param w_in - the {@link Iterable} input
 * @param f_fold - transforming callback function with signature
 *    ```ts
 *    type f_fold = (z_value: w_value, i_each: number) => Record<z_keys, w_value>
 *    ```
 * @param h_out - optionally specify the output object, an existing object to merge properties into
 * @returns the merged output object
 */
export const fold = <
	w_value,
	z_keys extends PropertyKey=string,
	w_out=any,
	h_output extends Record<z_keys, w_out> | undefined=Record<z_keys, w_out> | undefined,
	h_returned extends Record<z_keys, w_out>=Record<z_keys, w_out>,
	h_dest=undefined extends h_output
		? h_returned
		: h_output,
>(
	w_in: Iterable<w_value>,
	f_fold: (z_value: w_value, i_each: number) => h_returned,
	h_out: h_output={} as h_output
): h_dest => Array.from(w_in).reduce((h_acc, z_each, i_each) => Object.assign(h_acc!, f_fold(z_each, i_each)) as unknown as h_output, h_out) as unknown as h_dest;


export function under<w_values>(h_map: Dict<Dict<w_values>>): Dict<w_values> {
	const h_out: Dict<w_values> = {};

	for(const [si_prefix, h_parts] of Object.entries(h_map)) {
		for(const [si_suffix, w_value] of Object.entries(h_parts!)) {
			h_out[si_prefix+si_suffix] = w_value;
		}
	}

	return h_out;
}

export const off = (a_rules: string[]) => fold(a_rules, s => ({[s]:'off'}));
export const warn = (a_rules: string[]) => fold(a_rules, s => ({[s]:'warn'}));
export const error = (a_rules: string[]) => fold(a_rules, s => ({[s]:'error'}));