import useBaseUrl from '@docusaurus/useBaseUrl';
import React, { useEffect } from 'react';

// php-code-snippet.js used to be served with a one-year browser cache.
// Keep this query so docs previews don't reuse stale pre-editable-default copies.
const SCRIPT_URL =
	'https://playground.wordpress.net/php-code-snippet.js?v=editable-by-default';

function usePhpSnippetScript() {
	useEffect(() => {
		if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
			return;
		}

		const script = document.createElement('script');
		script.type = 'module';
		script.src = SCRIPT_URL;
		document.head.appendChild(script);
	}, []);
}

function createSnippetHtml(zipUrl: string) {
	const blueprint = {
		preferredVersions: {
			php: '8.4',
			wp: false,
		},
		features: {
			networking: true,
		},
		steps: [
			{
				step: 'unzip',
				zipFile: {
					resource: 'url',
					url: zipUrl,
					caption: 'Downloading the bundled Symfony demo',
				},
				extractToPath: '/wordpress',
			},
		],
	};

	return String.raw`<script id="symfony-package-radar-blueprint" type="application/json">
${JSON.stringify(blueprint, null, 2)}
</script>

<php-snippet name="symfony-kernel.php" wp="none" blueprint="symfony-package-radar-blueprint">
  <script type="application/x-php">
<?php
chdir('/wordpress/symfony-package-radar');
require 'vendor/autoload.php';

$kernel = new App\Kernel('prod', false);
$request = Symfony\Component\HttpFoundation\Request::create('/api/packages');
$response = $kernel->handle($request);
$payload = json_decode($response->getContent(), true);
$kernel->terminate($request, $response);

echo $response->getStatusCode() . "\n";
echo $payload['packages'][0]['name'] . "\n";
  </script>
  <script type="text/expected-output">
200
symfony/framework-bundle
  </script>
</php-snippet>`;
}

export default function SymfonyPhpSnippetLiveExample() {
	usePhpSnippetScript();

	const zipUrl = useBaseUrl(
		'/blueprints/symfony-package-radar/symfony-package-radar.zip',
		{ absolute: true }
	);

	return (
		<div
			className="php-code-snippet-live-example"
			dangerouslySetInnerHTML={{ __html: createSnippetHtml(zipUrl) }}
		/>
	);
}
