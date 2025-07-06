import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, BarChart3, DollarSign, Eye } from 'lucide-react';
import SemrushStrategy from './tables/semrushStrategy';
import SemrushPaidStrategy from './tables/semrushPaidStrategy';

export default function KeywordStrategyPanel({
	keywords,
	clientUrl,
	loadingSemrush,
	onFetchSemrush,
	onFetchPaidSemrush
}) {
	const [activeView, setActiveView] = useState('organic'); // 'organic' | 'paid'
	const [organicData, setOrganicData] = useState([]);
	const [paidData, setPaidData] = useState([]);

	const handleFetchOrganic = async () => {
		const data = await onFetchSemrush();
		setOrganicData(data);
	};

	const handleFetchPaid = async () => {
		const data = await onFetchPaidSemrush();
		setPaidData(data);
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md border space-y-4">
			<h3 className="text-base font-semibold text-gray-800">🔍 Estrategias Semrush</h3>

			{/* Fetch buttons */}
			<div className="flex gap-4">
				<Button
					className="bg-green-600 text-white flex items-center gap-2"
					onClick={handleFetchOrganic}
					disabled={loadingSemrush}
					title="Obtener estrategia orgánica"
				>
					{loadingSemrush ? <Loader className="animate-spin w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
					Fetch Orgánica
				</Button>

				<Button
					className="bg-blue-600 text-white flex items-center gap-2"
					onClick={handleFetchPaid}
					disabled={loadingSemrush}
					title="Obtener estrategia de pago"
				>
					{loadingSemrush ? <Loader className="animate-spin w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
					Fetch Pago
				</Button>
			</div>

			{/* View toggle */}
			{(organicData.length > 0 || paidData.length > 0) && (
				<div className="flex gap-4 mt-2">
					<Button
						variant={activeView === 'organic' ? 'default' : 'outline'}
						onClick={() => setActiveView('organic')}
						disabled={organicData.length === 0}
						className="flex items-center gap-2"
					>
						<Eye className="w-4 h-4" />
						Ver Orgánica
					</Button>
					<Button
						variant={activeView === 'paid' ? 'default' : 'outline'}
						onClick={() => setActiveView('paid')}
						disabled={paidData.length === 0}
						className="flex items-center gap-2"
					>
						<Eye className="w-4 h-4" />
						Ver Pago
					</Button>
				</div>
			)}

			{/* Table render */}
			{activeView === 'organic' && organicData.length > 0 && <SemrushStrategy data={organicData} />}
			{activeView === 'paid' && paidData.length > 0 && <SemrushPaidStrategy data={paidData} />}
		</div>
	);
}
