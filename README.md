# Web4 Protocol: The Next Generation of Decentralized Social Protocol

## Vision
Web4 Protocol is dedicated to creating a truly open, decentralized social network ecosystem where users regain control of their data and social relationships. We believe social networks should belong to users, not big tech companies.

### Why We Need Web4
- **Web2: Controlled by Big Tech**
  - Companies own and control all user data
  - Users face censorship and account bans
  - No true data ownership or freedom

- **Web3: Still Dependent**
  - Relying on third-party infrastructure
  - Limited control over data storage
  - High costs and technical barriers

- **Web4: True Independence**
  - We build, we own
  - Complete control over our website
  - True data sovereignty and freedom

## Technical Architecture

### index.html Core Features
- Provides basic HTML structure
- Built-in debug panel (debug-panel) for status and error display
- Debug utility class for logging and display
- Web4Layout class for application layout management
- Widget loading and application system
- Global error handling and DOM change monitoring

### 00_layout.js Core Features
#### Basic Layout Structure
Contains the following main containers:
- `wallet-container`: Wallet integration
- `theme-container`: Theme management
- `title-container`: Title display
- `post-container`: Post management
- `thread-container`: Thread discussions
- `build-container`: Build tools

### Main Workflow
1. **Initialization Phase**
   - Initialize Debug panel and Web4Layout
   - Load layout configuration from Irys network

2. **Widget Loading Sequence**
   - Theme widget
   - Wallet widget
   - Title, post, thread, and build widgets

3. **Component Features**
   - Each widget is an independent component
   - Contains standalone HTML, CSS, and JavaScript
   - Latest versions retrieved via GraphQL queries
   - Complete error handling and debug logging


## License
This project is licensed under the [MIT License](LICENSE)

