---
title: Run PHP frameworks
slug: /guides/php-frameworks
description: Use WordPress Playground as a generic PHP Playground for frameworks like Symfony by disabling WordPress and loading a Blueprint.
---

import SymfonyPhpSnippetLiveExample from '@site/src/components/SymfonyPhpSnippetLiveExample';

# Run PHP frameworks

WordPress Playground can run more than WordPress. It is also a browser-hosted
PHP runtime with a virtual filesystem, networking support, and Blueprints for
preparing files before PHP starts. If a framework can run on PHP without native
services or platform-specific binaries, you can often load it into Playground.

Use this guide when you want to demo a PHP framework, reproduce a PHP bug, or
teach framework code without asking readers to install PHP, Composer, or a local
web server.

## Start without WordPress

Set `preferredVersions.wp` to `false` in a Blueprint to skip the WordPress zip
entirely:

```json
{
	"preferredVersions": {
		"php": "8.4",
		"wp": false
	},
	"steps": []
}
```

For inline examples that use the `<php-snippet>` web component, use `wp="none"`
for the same behavior:

```html
<php-snippet name="pure-php.php" wp="none">
	<script type="application/x-php">
		<?php echo file_exists( '/wordpress/wp-load.php' ) ? 'yes' : 'no';
	</script>
	<script type="text/expected-output">
		no
	</script>
</php-snippet>
```

You still get the Playground PHP runtime and virtual filesystem; you just don't
pay the cost of downloading or booting WordPress.

## Bundle framework dependencies

A PHP framework usually needs many files in `vendor/`. You can install those
files ahead of time, zip the app, and let a Blueprint unzip it into the virtual
filesystem:

```json
{
	"preferredVersions": {
		"php": "8.4",
		"wp": false
	},
	"features": {
		"networking": true
	},
	"steps": [
		{
			"step": "unzip",
			"zipFile": {
				"resource": "url",
				"url": "https://example.com/my-framework-demo.zip"
			},
			"extractToPath": "/wordpress"
		}
	]
}
```

Bundling avoids waiting for Composer, Git, npm, Sass, or other build tools in the
browser. It also makes the demo more reproducible because every reader receives
the same dependency tree.

## Run a Symfony example

The example below loads a bundled Symfony app with a Blueprint, boots Symfony's
kernel, and handles the `/api/packages` route. The same bundle powers the full
[Symfony Package Radar demo](https://playground.wordpress.net/?blueprint-url=https://wordpress.github.io/wordpress-playground/blueprints/symfony-package-radar/blueprint.json).

<SymfonyPhpSnippetLiveExample />

The Blueprint behind the snippet uses `preferredVersions.wp: false`, unzips a
Symfony app into `/wordpress/symfony-package-radar`, and enables Playground
networking so Symfony HttpClient can read package metadata from Packagist.

You can also inspect the standalone assets directly:

- [Open the full Symfony demo](https://playground.wordpress.net/?blueprint-url=https://wordpress.github.io/wordpress-playground/blueprints/symfony-package-radar/blueprint.json)
- [Read the Blueprint JSON](https://wordpress.github.io/wordpress-playground/blueprints/symfony-package-radar/blueprint.json)

## What works well

Playground is a good fit for PHP framework demos that:

- run from PHP files and Composer-installed dependencies;
- can use SQLite, the filesystem, or remote HTTP APIs instead of external
  daemons;
- avoid native PHP extensions that are not compiled into the selected Playground
  PHP build;
- do not require Node.js, Sass, or another frontend build step at runtime.

If a project needs a build step, run it before creating the zip. If it needs a
server rewrite rule, route requests through the framework front controller or add
a small `index.php` shim in the bundle.
