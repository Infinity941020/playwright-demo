# Playwright Demo Project

## Overview
This project is a simple UI test automation project using Playwright and TypeScript.

It demonstrates basic end-to-end testing for a login feature.

## Features
- Login success test
- Login failure tests (invalid user / invalid password / empty input)
- Page Object Model (POM) implementation
- Separation of test cases (success / failure)
- Git version control with GitHub

## Tech Stack
- Playwright
- TypeScript
- Node.js
- Git / GitHub

## Project Structure
pages/
  LoginPage.ts

tests/
  login/
    login-success.spec.ts
    login-failure.spec.ts

## How to Run Tests
npx playwright test

UI mode:
npx playwright test --ui

## Notes
This project was created for learning and practice purposes.
It demonstrates UI automation testing, Page Object Model design, and Git workflow.
