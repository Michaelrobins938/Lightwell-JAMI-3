import React from 'react';
import { Timer, Activity } from 'lucide-react';

interface MetricsBarProps {
	latencyMs?: number | null;
	promptTokens?: number | null;
	completionTokens?: number | null;
	totalTokens?: number | null;
	className?: string;
}

export function MetricsBar({ latencyMs, promptTokens, completionTokens, totalTokens, className = '' }: MetricsBarProps) {
	const hasLatency = typeof latencyMs === 'number';
	const hasTokens = typeof totalTokens === 'number';

	if (!hasLatency && !hasTokens) return null;

	return (
		<div className={`flex items-center gap-4 text-xs text-gray-300 bg-gray-800 border-t border-gray-700 px-4 py-2 ${className}`}>
			{hasLatency && (
				<div className="flex items-center gap-1">
					<Timer className="w-3.5 h-3.5 text-gray-400" />
					<span>{Math.max(0, Math.round(latencyMs!))} ms</span>
				</div>
			)}
			{hasTokens && (
				<div className="flex items-center gap-2">
					<Activity className="w-3.5 h-3.5 text-gray-400" />
					<div className="flex items-center gap-3">
						<span title="Prompt tokens">P: {promptTokens ?? '-'}
						</span>
						<span title="Completion tokens">C: {completionTokens ?? '-'}
						</span>
						<span title="Total tokens">T: {totalTokens ?? '-'}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}


