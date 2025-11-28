import { useEffect } from "react";
import { useSocketStore } from "../utils/data.utils.js";

const HomePage = () => {
	// Zustand store state and actions
	const { 
		formattedData, 
		connectionStatus, 
		error, 
		connect, 
		disconnect,
		clearError 
	} = useSocketStore();

	useEffect(() => {
		// Connect when component mounts
		connect();

		// Cleanup on unmount
		return () => {
			disconnect();
		};
	}, [connect, disconnect]);

	// Connection status indicator
	const getStatusIndicator = () => {
		switch (connectionStatus) {
			case 'connected':
				return <span className="text-green-600">🟢 Connected</span>;
			case 'connecting':
				return <span className="text-yellow-600">🟡 Connecting...</span>;
			case 'disconnected':
				return <span className="text-red-600">🔴 Disconnected</span>;
			case 'error':
				return <span className="text-red-600">❌ Connection Error</span>;
			default:
				return <span className="text-gray-600">⚪ Unknown</span>;
		}
	};

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-white font-fredoka">
			{/* Connection Status */}
			<div className="mb-4 px-4 py-2 rounded shadow bg-gray-50">
				{getStatusIndicator()}
			</div>

			{/* Error Display */}
			{error && (
				<div className="mb-4 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded shadow">
					<strong>Error:</strong> {error}
					<button 
						onClick={clearError}
						className="ml-2 text-red-600 hover:text-red-800"
					>
						×
					</button>
				</div>
			)}

			{/* Data Display */}
			<div className="w-full flex items-center justify-center py-4">
				{formattedData ? (
					<div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded shadow max-w-2xl">
						<strong>Live Sensor Data:</strong>
						
						{/* Formatted Values */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
							{Object.entries(formattedData.values).map(([key, value]) => (
								value.value && (
									<div key={key} className="text-center">
										<div className="text-sm text-green-600">{value.label}</div>
										<div className="text-xl font-bold">{value.value} {value.unit}</div>
									</div>
								)
							))}
						</div>

						{/* Metadata */}
						<div className="mt-4 pt-4 border-t border-green-300 text-sm">
							<div><strong>Device:</strong> {formattedData.metadata.device}</div>
							<div><strong>Last Update:</strong> {formattedData.metadata.timestamp}</div>
						</div>

						{/* Raw Data (for debugging) */}
						<details className="mt-4">
							<summary className="cursor-pointer text-sm text-green-700">Raw Data</summary>
							<pre className="whitespace-pre-wrap break-all text-xs mt-2 bg-green-50 p-2 rounded">
								{JSON.stringify(formattedData, null, 2)}
							</pre>
						</details>
					</div>
				) : (
					<div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 rounded shadow">
						{connectionStatus === 'connecting' ? 'Connecting to server...' : 'Waiting for live data from server...'}
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;