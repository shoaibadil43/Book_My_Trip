# Book My Trip

A responsive travel booking flow built with React, JavaScript, and CSS. Plan a trip step by step, review the details, and complete a demo checkout.

## Features

- Five-stage trip planning flow: traveler details, dates, guests, travel assistance, and payment, followed by confirmation.
- Form validation for required details, date selection, and end dates earlier than start dates.
- Previous-step navigation preserves entered trip details.
- Guest counters enforce a minimum of one adult and zero children or infants.
- Optional travel assistance selection.
- Demo payment method selection and booking summary.
- Responsive layout for phone, tablet, and desktop screens.

> **Payment is simulated.** No real payment is processed, and no card details are collected.
> Trip information is held in React state and is not saved to a database.

## Requirements

- Node.js and npm

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
src/
  components/
    App.jsx       Trip planning flow and UI components
  main.jsx        React application entry point
  styles.css      Application styles and responsive layouts
index.html        Vite HTML entry point
```
