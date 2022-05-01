const { io } = require('socket.io-client');
const config = require('./config');

// Establish connection to server.
const socket = io(config.API_URL, {
	auth: {
		APIKey: config.API_KEY,
	},
});

// Retrieve server data and send to server
function getData() {
	let onlineCount = GetNumPlayerIndices();

	let players = [];

	for (let i = 0; i < onlineCount; i++) {
		let playerSrc = i + 1

		let name = GetPlayerName(playerSrc);

		let ped = GetPlayerPed(
			playerSrc
		);

		let playerPos = GetEntityCoords(ped, true)

		players.push({
			name,
			// This is the embed description, you can edit this to whatever you like!
			description: `X: \`\`${playerPos[0]}\`\`
				Y: \`\`${playerPos[1]}\`\`
				Z: \`\`${playerPos[2]}\`\``
		})
	}

	return {
		playerCount: onlineCount,
		players: players,
	};
}

socket.on('connected', () => {
	console.log('connected to API');

	// Start Interval
	setInterval(
		() => socket.emit('setData', getData()),
		config.RefreshInterval
	);
});
