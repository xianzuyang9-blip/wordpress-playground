<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\Exception\ExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SymfonyPackageRadar
{
    public function __construct(
        private readonly HttpClientInterface $http,
    ) {
    }

    /**
     * @return array<int, array{name: string, version: string, description: string, time: string}>
     */
    public function inspect(array $packageNames): array
    {
        $packages = [];
        foreach ($packageNames as $packageName) {
            $packages[] = $this->inspectOne($packageName);
        }

        return $packages;
    }

    /**
     * @return array{name: string, version: string, description: string, time: string}
     */
    private function inspectOne(string $packageName): array
    {
        try {
            $response = $this->http->request(
                'GET',
                sprintf('https://repo.packagist.org/p2/%s.json', $packageName)
            );
            $data = $response->toArray(false);
            $versions = $data['packages'][$packageName] ?? [];
            $latest = $this->firstStableRelease($versions) ?? $versions[0] ?? [];

            return [
                'name' => $packageName,
                'version' => $latest['version'] ?? 'unknown',
                'description' => $latest['description'] ?? 'No description available.',
                'time' => $latest['time'] ?? 'unknown',
            ];
        } catch (ExceptionInterface $e) {
            return [
                'name' => $packageName,
                'version' => 'unavailable',
                'description' => sprintf(
                    'Packagist request failed: %s',
                    $e->getMessage()
                ),
                'time' => 'unavailable',
            ];
        }
    }

    private function firstStableRelease(array $versions): ?array
    {
        foreach ($versions as $version) {
            $name = strtolower($version['version'] ?? '');
            if (!str_contains($name, 'dev') &&
                !str_contains($name, 'alpha') &&
                !str_contains($name, 'beta') &&
                !str_contains($name, 'rc')) {
                return $version;
            }
        }

        return null;
    }
}
