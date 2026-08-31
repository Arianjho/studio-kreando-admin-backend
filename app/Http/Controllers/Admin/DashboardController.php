<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Media;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'unreadMessages' => Message::where('read', false)->count(),
                'totalMessages' => Message::count(),
                'projects' => Project::count(),
                'featuredProjects' => Project::where('featured', true)->count(),
                'categories' => Category::count(),
                'media' => Media::count(),
            ],
            'messagesByMonth' => $this->messagesByMonth(),
            'recentMessages' => Message::latest()
                ->take(5)
                ->get(['id', 'name', 'subject', 'read', 'created_at']),
        ]);
    }

    /**
     * Conteo de mensajes de los últimos 6 meses, agrupado por mes.
     * Los buckets se arman en PHP para no depender de funciones de fecha
     * específicas del motor (Postgres en dev, SQLite en tests).
     *
     * @return list<array{label: string, value: int}>
     */
    private function messagesByMonth(): array
    {
        $start = Carbon::now()->startOfMonth()->subMonths(5);

        $counts = Message::where('created_at', '>=', $start)
            ->get(['created_at'])
            ->groupBy(fn (Message $message) => $message->created_at->format('Y-m'))
            ->map->count();

        $months = [];

        for ($i = 0; $i < 6; $i++) {
            $month = (clone $start)->addMonths($i);

            $months[] = [
                'label' => $month->translatedFormat('M'),
                'value' => (int) ($counts[$month->format('Y-m')] ?? 0),
            ];
        }

        return $months;
    }
}
