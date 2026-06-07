import type { SiteInfo } from '../../../lib/state/redux/slice-sites';
import type { SiteSettings } from '../../../lib/state/redux/site-management-api-middleware';
import type { SiteFormData } from './unconnected-site-settings-form';

/**
 * Returns setup-form defaults from the metadata saved for a Playground.
 *
 * Runtime configuration contains the values that were resolved from the
 * Blueprint and Query API, such as PHP, WordPress, and networking. `language`
 * and `multisite` are setup URL fields, so they come from `originalUrlParams`
 * instead of the resolved runtime configuration.
 */
export function getSetupFormDefaultValues(
	siteInfo: SiteInfo
): Partial<SiteFormData> {
	const searchParams = siteInfo.originalUrlParams?.searchParams || {};
	const runtimeConf = siteInfo.metadata?.runtimeConfiguration || {};
	const language = searchParams.language;
	const multisite = searchParams.multisite;
	return {
		phpVersion: runtimeConf?.phpVersion as any,
		wpVersion: runtimeConf?.wpVersion as any,
		withNetworking: runtimeConf?.networking,
		language: typeof language === 'string' ? language : '',
		multisite: multisite === 'yes',
	};
}

/**
 * Converts setup-form values to the settings shape accepted by the site API.
 *
 * The form names the networking checkbox `withNetworking` to read naturally in
 * the UI layer. Site creation and autosave recreation use `networking`, matching
 * the runtime configuration field stored in site metadata.
 */
export function getSiteSettingsFromFormData(data: SiteFormData): SiteSettings {
	return {
		phpVersion: data.phpVersion,
		wpVersion: data.wpVersion,
		networking: data.withNetworking,
		language: data.language,
		multisite: data.multisite,
	};
}
