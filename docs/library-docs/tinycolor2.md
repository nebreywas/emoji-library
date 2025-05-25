# TinyColor2 Integration Guide

TinyColor2 is a lightweight JavaScript library for color manipulation and conversion. It is used in this project to standardize and simplify color handling for UI and graphics.

## Installation

Install TinyColor2 using npm:

```sh
npm install tinycolor2
```

## TypeScript Support

TinyColor2 supports TypeScript, but if you encounter type errors (such as "Could not find a declaration file for module 'tinycolor2'"), you should install the type definitions:

```sh
npm install --save-dev @types/tinycolor2
```

This will ensure proper type checking and autocompletion in your TypeScript codebase.

## Basic Usage Example

```ts
import tinycolor from 'tinycolor2';

const color = tinycolor('#3498db');
console.log(color.lighten(20).toString()); // Lightened color
console.log(color.isValid()); // true if the color is valid
```

## Resources
- [TinyColor2 GitHub](https://github.com/bgrins/TinyColor)
- [TinyColor2 npm](https://www.npmjs.com/package/tinycolor2)

---

**Note:** If you add new color utilities or helpers using TinyColor2, consider documenting them here for team reference. 