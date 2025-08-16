# Simplified Poker Game

This project is a **Simplified Poker Game** built with **Next.js (TypeScript)** for the frontend and **FastAPI (Python)** for the backend. It simulates a poker environment with basic poker actions and multiple game rounds.

## 🚀 Features

- **Multiplayer poker game simulation**
- **Poker Actions**: Bet, Call, Fold, Raise, Check, Allin
- **Game Rounds**: Pre-Flop, Flop, Turn, River, Showdown
- **State Management**: Zustand for frontend state
- **RESTful API**: FastAPI backend with clean architecture
- **Real-time Updates**: Live game state synchronization
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Architecture

The project follows a clean architecture pattern with:

- **Backend**: FastAPI with layered architecture (Controllers, Services, Repositories)
- **Frontend**: Next.js 14 with App Router and TypeScript
- **Database**: SQLite (development) with SQLAlchemy ORM
- **Testing**: Comprehensive test suites for both backend and frontend

## 📁 Project Structure

```
pocker_game/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── controllers/    # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   ├── repositories/   # Data access layer
│   │   └── infrastructure/ # External services
│   ├── tests/              # Backend tests
│   ├── Dockerfile          # Backend container
│   ├── pyproject.toml      # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable components
│   ├── e2e/              # End-to-end tests
│   ├── Dockerfile         # Frontend container
│   └── package.json       # Node.js dependencies
├── docker-compose.yml     # Multi-container setup
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **Pydantic** - Data validation and serialization
- **SQLAlchemy** - SQL toolkit and ORM
- **Poetry** - Python dependency management
- **Pytest** - Testing framework

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Playwright** - End-to-end testing

## 🚦 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.11+)

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/nahom4/pocker_game.git
   cd pocker_game
   ```

2. Build and run all services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Development
```bash
cd backend
poetry install
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
poetry run pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:e2e
```

## 🎯 Game Rules

The application implements standard Texas Hold'em rules:
- Each player receives 2 hole cards
- 5 community cards dealt in 3 stages: Flop (3 cards), Turn (1 card), River (1 card)
- Players make the best 5-card hand using any combination of their 2 hole cards and 5 community cards
- Standard poker hand rankings apply (Royal Flush, Straight Flush, etc.)

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=sqlite:///./poker.db
SECRET_KEY=your-secret-key
DEBUG=True
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:7995
```

## 🚀 Deployment

### Production Deployment
1. Set production environment variables
2. Build and run with Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (di"so "git checkout -b feature/amazing-feature")
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support
<div>

<h1></h1>
</div>
