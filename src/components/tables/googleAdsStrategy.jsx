import React from 'react';
import { useSelector } from 'react-redux';

export default function GoogleAdsStrategy() {
	const data = useSelector((state) => state.strategy.googleAdsStrategy);

	if (!data || data.length === 0) return null;

	return (
		<table className="w-full text-sm text-left border">
			<thead className="bg-gray-100 text-xs uppercase text-gray-600">
				<tr>
					<th className="px-3 py-2">Keyword</th>
					<th className="px-3 py-2">Búsquedas/mes</th>
					<th className="px-3 py-2">Competencia</th>
					<th className="px-3 py-2">CPC (€)</th>
				</tr>
			</thead>
			<tbody>
				{data.map((item, i) => (
					<tr key={i} className="border-t">
						<td className="px-3 py-2">{item.keyword}</td>
						<td className="px-3 py-2">{item.avg_monthly_searches}</td>
						<td className="px-3 py-2 capitalize">{item.competition}</td>
						<td className="px-3 py-2">{item.suggested_bid}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
