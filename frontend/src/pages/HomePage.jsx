import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const HomePage = () => {
	const [liveData, setLiveData] = useState(null);

	useEffect(() => {
		// Replace with your deployed Railway backend URL
		const socket = io("https://your-app.up.railway.app");
		socket.on("newData", (data) => {
			setLiveData(data);
		});
		return () => socket.disconnect();
	}, []);

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-white font-fredoka">
			<div className="w-full flex items-center justify-center py-4">
				{liveData ? (
					<div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded shadow">
						<strong>Live Data Received:</strong>
						<pre className="whitespace-pre-wrap break-all text-xs mt-2">{JSON.stringify(liveData, null, 2)}</pre>
					</div>
				) : (
					<div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 rounded shadow">
						Waiting for live data from server...
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
