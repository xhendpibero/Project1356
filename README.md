# Project 1356

A countdown-driven life commitment system built with React Native. Project 1356 reframes self-development as a finite, shared countdown tied to identity rather than output.

## Philosophy

Project 1356 is:
- About **time**, not output
- About **commitment**, not motivation
- About **identity formation**, not optimization

Every user operates under a countdown, not a checklist. The deadline is finite and visible, while goals remain private and hidden. Pressure comes from time scarcity, not social comparison.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── navigation/      # Navigation configuration
├── screens/         # Screen components
├── services/        # Business logic services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. Install dependencies:
```sh
npm install
```

2. For iOS, install CocoaPods dependencies:
```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

### Running the App

1. Start Metro bundler:
```sh
npm start
```

2. Run on Android:
```sh
npm run android
```

3. Run on iOS:
```sh
npm run ios
```

### Testing

Run tests:
```sh
npm test
```

## License

This project is free and open source.

## Credits

Inspired by ArminMehdiz and the philosophy of shared deadlines and hidden goals.
