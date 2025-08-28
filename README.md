# SecurePass - Advanced Password Strength Checker

A modern, client-side password strength analyzer that evaluates passwords based on entropy, patterns, and security best practices.

## Features

- **Real-time Analysis**: Get instant feedback as you type
- **Entropy Calculation**: Measures password complexity in bits
- **Pattern Detection**: Identifies common patterns and dictionary words
- **Crack Time Estimation**: Estimates how long it would take to crack your password
- **Actionable Feedback**: Provides specific recommendations to improve password strength
- **Password Generator**: Creates strong, customizable passwords
- **Client-side Processing**: All analysis happens in your browser for maximum security
- **Responsive Design**: Works perfectly on desktop and mobile devices

## How It Works

The password strength checker evaluates several factors:

1. **Length**: Longer passwords are generally stronger
2. **Character Variety**: Use of uppercase, lowercase, numbers, and symbols
3. **Entropy**: Measures the unpredictability of the password
4. **Patterns**: Detection of common sequences, keyboard walks, and dictionary words

The algorithm calculates a score from 0-100 and provides specific feedback to improve your password.

## Usage

1. Type a password in the input field
2. View real-time analysis and feedback
3. Use the password generator to create strong passwords
4. Click on generated passwords to copy them to clipboard

## Technical Details

This application is built with:
- HTML5
- CSS3 (with Flexbox and CSS Grid)
- Vanilla JavaScript (no frameworks)

All processing happens client-side in the browser - no passwords are sent to any server.

## Installation

No installation required! Simply open `index.html` in a web browser.

For local development:
1. Clone or download this repository
2. Open `index.html` in your browser
3. Start editing files as needed

## Browser Compatibility

Works in all modern browsers including:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Screenshots

![Main Interface](assets/screenshot-main.png)
![Password Analysis](assets/screenshot-analysis.png)
![Password Generator](assets/screenshot-generator.png)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.