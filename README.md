# Vulnera: Multi-Vulnerable Servers CLI

Vulnera is a command-line interface (CLI) tool that allows you to deploy and manage multiple vulnerable server environments for educational and testing purposes.

## Features

- **Choose Your Vulnerable Environment:** Select from a variety of pre-configured vulnerable server setups.
- **Educational Tool:** Learn about common security vulnerabilities and best practices in a safe, controlled environment.
- **Flexible and Customizable:** Easily deploy, manage, and interact with vulnerable servers via a simple CLI interface.

## Installation

### Download
```bash
git clone https://github.com/stringmanolo/vulnera.git
cd vulnera
```

### Install
```bash
./install.sh
```

## Usage

### Basic Usage

#### help
```bash
# show available commands
vulnera help
```

#### start a server
```bash
# vulnera start <server_name>
vulnera start clickjacking
```

#### list servers
```bash
# list all available servers
vulnera list
```

#### show server code
```bash
# vulnera code <server_name>
vulnera code clickjacking
```

#### show exploit
```bash
# vulnera exploit <server_name>
vulnera exploit clickjacking
```

#### update
```bash
vulnera update
```

## Contributing

Contributions are welcome! If you want to contribute to Vulnera, fork the repository and submit a pull request with your proposed changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, feel free to contact the maintainer at [Telegram](t.me/stringmanolo) or open an issue.
