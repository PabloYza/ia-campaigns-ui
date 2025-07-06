import React from 'react';
import { useSelector } from 'react-redux';

export default function SemrushPaidStrategy({ data }) {
	if (!data || data.length === 0) return null;

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm text-left border border-gray-200">
				<thead className="bg-gray-100 text-xs uppercase text-gray-600">
					<tr>
						<th className="px-3 py-2 w-40">Keyword</th>
						<th className="px-3 py-2 w-48">Dominio</th>
						<th className="px-3 py-2">URL</th>
					</tr>
				</thead>
				<tbody>
					{data.map(({ keyword, data: entries }, i) => (
						<React.Fragment key={i}>
							{entries.map((entry, j) => (
								<tr key={`${i}-${j}`} className="border-t border-gray-200">
									<td className="px-3 py-2 align-top">{j === 0 ? keyword : ''}</td>
									<td className="px-3 py-2 align-top text-gray-800">{entry["Domain"]}</td>
									<td className="px-3 py-2 align-top max-w-xs">
										<a
											href={entry["Url"]}
											target="_blank"
											rel="noopener noreferrer"
											title={entry["Url"]}
											className="text-blue-600 hover:underline block truncate"
										>
											{entry["Url"]}
										</a>
									</td>
								</tr>
							))}
						</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
}

