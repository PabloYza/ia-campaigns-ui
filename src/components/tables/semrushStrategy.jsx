import React from 'react';

export default function SemrushStrategy({ data }) {
	if (!data || data.length === 0) return null;

	return (
		<table className="w-full text-sm text-left border">
			<thead className="bg-gray-100 text-xs uppercase text-gray-600">
				<tr>
					<th className="px-3 py-2">Keyword</th>
					<th className="px-3 py-2">Volumen</th>
					<th className="px-3 py-2">CPC</th>
					<th className="px-3 py-2">Competencia</th>
					<th className="px-3 py-2">Resultados</th>
				</tr>
			</thead>
			<tbody>
				{data.map(({ keyword, data }, i) => (
					<tr key={i} className="border-t">
						<td className="px-3 py-2">{keyword}</td>
						<td className="px-3 py-2">{data[0]?.['Search Volume'] || '-'}</td>
						<td className="px-3 py-2">{data[0]?.['CPC'] || '-'}</td>
						<td className="px-3 py-2">{data[0]?.['Competition'] || '-'}</td>
						<td className="px-3 py-2">{data[0]?.['Number of Results'] || '-'}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
