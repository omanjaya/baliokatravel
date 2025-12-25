<?php

namespace App\Console\Commands;

use App\Models\Activity;
use App\Models\Area;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    protected $description = 'Generate XML sitemap for SEO';

    public function handle(): int
    {
        $this->info('Generating sitemap...');

        $urls = collect();

        // Static pages
        $urls->push([
            'loc' => config('app.url'),
            'priority' => '1.0',
            'changefreq' => 'daily',
        ]);

        $urls->push([
            'loc' => config('app.url') . '/search',
            'priority' => '0.9',
            'changefreq' => 'daily',
        ]);

        // Areas
        $areas = Area::where('status', 'active')->get();
        foreach ($areas as $area) {
            $urls->push([
                'loc' => route('areas.show', $area),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $area->updated_at->toAtomString(),
            ]);
        }

        // Activities
        $activities = Activity::where('status', 'active')->get();
        foreach ($activities as $activity) {
            $urls->push([
                'loc' => route('activities.show', $activity->slug),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $activity->updated_at->toAtomString(),
            ]);
        }

        // Generate XML
        $xml = $this->generateXml($urls);

        // Save to public folder
        file_put_contents(public_path('sitemap.xml'), $xml);

        $this->info("Sitemap generated with {$urls->count()} URLs: public/sitemap.xml");

        return Command::SUCCESS;
    }

    private function generateXml($urls): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$url['loc']}</loc>\n";
            
            if (isset($url['lastmod'])) {
                $xml .= "    <lastmod>{$url['lastmod']}</lastmod>\n";
            }
            
            if (isset($url['changefreq'])) {
                $xml .= "    <changefreq>{$url['changefreq']}</changefreq>\n";
            }
            
            if (isset($url['priority'])) {
                $xml .= "    <priority>{$url['priority']}</priority>\n";
            }
            
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
