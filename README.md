# PDF Certificate Generator

A Node.js script for automatically generating personalised PDF certificates from a custom PDF template and participant data.

## Features

* Generates individual certificates from a PDF template
* Adds each participant's name to the certificate
* Automatically reduces the font size for longer names
* Generates unique filenames using the participant's email and ID
* Creates the output folder automatically if it doesn't exist
* Allows the certificate template to be replaced and customised

## Built with

* Node.js
* pdf-lib
* fontkit

## Getting started

### Prerequisites

You need Node.js installed.

### Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/ppiippaa/pdf-certificate.git
cd pdf-certificate
npm install
```

## Usage

### 1. Add participant data

Add the participant information to `index.js`:

```js
const data = [
  { id: 1, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 2, name: "John Smith", email: "john.smith@example.com" },
];
```

Each participant should have:

* `id` – a unique identifier
* `name` – the name to appear on the certificate
* `email` – used to generate the output filename

### 2. Add a certificate template

Place your PDF certificate template in the `templates` folder.

The current example uses:

```text
templates/ENGLISH.pdf
```

The template can be replaced with a different certificate design. If you replace the template, update the template filename/path in `index.js` if necessary.

### 3. Adjust the name placement

The position of the participant's name is defined by the `x` and `y` coordinates in `index.js`:

```js
const x = 152;
const y = 460;
```

These coordinates are specific to the current template. If you use a different template, adjust them to place the name correctly.

### 4. Run the script

```bash
npm start
```

The generated certificates will be saved in the `output` folder.

## Output

Each certificate is named using the participant's email prefix and ID.

For example:

```text
jane.smith-certificate-1.pdf
john.smith-certificate-2.pdf
```

## Project structure

```text
pdf-certificate/
├── index.js
├── package.json
├── package-lock.json
├── templates/
│   └── ENGLISH.pdf
└── output/
```

## Notes

The script uses the Ubuntu font when adding participant names to the certificates. The font is downloaded when the script runs.
