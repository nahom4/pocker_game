\# Simplified Poker Game

This project is a \*\*Simplified Poker Game\*\* built with \*\*Next.js (TypeScript)\*\* for the frontend and \*\*FastAPI (Python)\*\* for the backend. It simulates a poker environment with basic poker actions and multiple game rounds.

\## Features

\- Multiplayer poker game simulation

\- Actions: Bet, Call, Fold, Raise, Check

\- Game rounds: Pre-Flop, Flop, Turn, River, Showdown

\- State management using Zustand

\- Real-time interaction with FastAPI

\## Technologies

\- \*\*Frontend\*\*: Next.js, TypeScript, Zustand

\- \*\*Backend\*\*: FastAPI, Python, PostgreSQL

\- \*\*Development\*\*: Docker, Docker Compose

\## Getting Started

\### Prerequisites

\- \[Docker\](https://www.docker.com/)

\- \[Node.js\](https://nodejs.org/) (v14+)

\- \[Python\](https://www.python.org/) (v3.8+)

\### Installation

1\. Clone the repository:

\`\`\`bash

git clone https://github.com/your-username/simplified-poker-game.git

cd simplified-poker-game

\`\`\`

2\. Build and run with Docker:

\`\`\`bash

docker-compose up -d --build --no-cache

\`\`\`

\### Running the Project

\- Access the frontend at \`http://localhost:3000\`

\- Access the backend at \`http://localhost:8000\`

\## Testing

To run tests:

1\. Build the Docker image:

\`\`\`bash

docker build -t your-project-name .

\`\`\`

2\. Run the tests:

\`\`\`bash

docker run your-project-name npm test # Adjust command as needed

\`\`\`

\## Contributing

Fork the repository, create a feature branch, and submit a pull request.

\## License

This project is licensed under the MIT License.

\---

Feel free to modify any section as necessary! Let me know if there are any additional details you'd like to include or if you want to adjust the language further.
