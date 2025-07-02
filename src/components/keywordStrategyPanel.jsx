import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader, BarChart3 } from 'lucide-react';
import SemrushStrategy from './tables/semrushStrategy';

export default function KeywordStrategyPanel({
	semrushData,
	loadingSemrush,
	onFetchSemrush
}) {
	return (
		<div className="bg-white p-4 rounded-lg shadow-md border space-y-4">
			<h3 className="text-base font-semibold text-gray-800">🔍 Herramienta Semrush (orgánica)</h3>

			<Button
				className="bg-green-600 text-white flex items-center gap-2"
				onClick={onFetchSemrush}
				disabled={loadingSemrush}
				title="Analizar potencial orgánico con Semrush"
			>
				{loadingSemrush ? <Loader className="animate-spin w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
				Semrush
			</Button>

			<SemrushStrategy data={semrushData} />
		</div>
	);
}
