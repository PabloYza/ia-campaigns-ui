import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, ScanSearch, BarChart3 } from 'lucide-react';
import GoogleAdsStrategy from './tables/googleAdsStrategy';
import SemrushStrategy from './tables/semrushStrategy';

export default function KeywordStrategyPanel({
	initialKeywords,
	clientUrl,
	onFetchGoogle,
	googleAdsStrategy,
	semrushData,
	loadingGoogle,
	loadingSemrush,
	onFetchSemrush
}) {
	const [activeTab, setActiveTab] = useState('google');

	return (
		<div className="bg-white p-4 rounded-lg shadow-md border space-y-4">
			<h3 className="text-base font-semibold text-gray-800">🔍 Herramientas para KeyWords</h3>

			<div className="flex gap-4">
				<Button
					className="bg-blue-600 text-white flex items-center gap-2"
					onClick={onFetchGoogle}
					disabled={loadingGoogle}
					title="Generate paid strategy via Google Ads"
				>
					{loadingGoogle ? <Loader className="animate-spin w-4 h-4" /> : <ScanSearch className="w-4 h-4" />}
					Google Ads
				</Button>

				<Button
					className="bg-green-600 text-white flex items-center gap-2"
					onClick={onFetchSemrush}
					disabled={loadingSemrush}
					title="Analyze organic keyword potential via Semrush"
				>
					{loadingSemrush ? <Loader className="animate-spin w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
					Semrush
				</Button>
			</div>

			<div className="flex space-x-2 pt-2 text-sm">
				{['google', 'semrush'].map(tab => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-3 py-1 rounded-md border transition-all duration-150
							${activeTab === tab
								? "bg-blue-600 text-white border-blue-600"
								: "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100"
							}`}
					>
						{tab === 'google' ? 'Estrategia de Pago' : 'Estrategia Orgánica'}
					</button>
				))}
			</div>

			{activeTab === 'google' && <GoogleAdsStrategy data={googleAdsStrategy} />}
			{activeTab === 'semrush' && <SemrushStrategy data={semrushData} />}
		</div>
	);
}
