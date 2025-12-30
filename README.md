# Xfinds - Cross-Border Freight Comparison Platform

<div align="center">
  <img src="https://raw.githubusercontent.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison/main/public/ScreenShot/ScreenShot_2025-12-30_110255_958.png" alt="Xfinds Screenshot" width="900" />
  <p><em>Xfinds Cross-Border Freight Comparison Platform</em></p>
</div>

## Overview

Xfinds is a modern cross-border freight comparison platform that helps users find the best shipping rates from multiple agents. Compare prices, track shipments, and optimize your international shipping experience.

## Features

- 🔍 **Smart Search** - Search and compare products across multiple agents
- 💰 **Price Comparison** - Real-time price comparison with currency conversion
- 🛒 **Shopping Cart** - Manage items from different agents in one place
- 📊 **Agent Comparison** - Side-by-side comparison of shipping agents
- 🌐 **Multi-language Support** - Available in English and Chinese
- 🎨 **Modern UI** - Beautiful, responsive design with dark/light themes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Internationalization**: next-intl

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison.git

# Navigate to the project directory
cd xfinds-cross-border-freight-comparison

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── [locale]/         # Internationalized routes
│   └── api/              # API routes
├── components/           # React components
│   ├── ui/               # Base UI components
│   ├── shared/           # Shared components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and helpers
├── store/                # Zustand state stores
├── messages/             # i18n translation files
├── public/               # Static assets
└── data/                 # JSON data files
```

## Screenshots

<div align="center">
  <img src="https://raw.githubusercontent.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison/main/public/ScreenShot/ScreenShot_2025-12-30_114122_459.png" alt="Search Page" width="400" />
  <img src="https://raw.githubusercontent.com/TheNewMikeMusic/xfinds-cross-border-freight-comparison/main/public/ScreenShot/ScreenShot_2025-12-30_124445_841.png" alt="Product Page" width="400" />
</div>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.
