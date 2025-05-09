import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdCopyEditor({ adCopy, onUpdate }) {
	const handleChange = (field, value) => {
		onUpdate({
			...adCopy,
			[field]: value,
		});
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-sm font-medium text-gray-700 mb-1">Headline (max 30 chars)</p>
				<Input
					value={adCopy.headline}
					onChange={(e) => handleChange('headline', e.target.value)}
					maxLength={30}
					placeholder="Ej: Soluciones de Marketing"
				/>
			</div>

			<div>
				<p className="text-sm font-medium text-gray-700 mb-1">Descripción (max 90 chars)</p>
				<Textarea
					value={adCopy.description}
					onChange={(e) => handleChange('description', e.target.value)}
					maxLength={90}
					rows={3}
					placeholder="Ej: Aumenta tus ventas con nuestras campañas digitales personalizadas."
				/>
			</div>
		</div>
	);
}
