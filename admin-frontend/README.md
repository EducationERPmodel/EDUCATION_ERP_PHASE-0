# Admin Frontend

This folder contains the Admin frontend for the Education ERP project.

## Conversion
- Existing JavaScript/JSX source files were converted to `.ts` or `.tsx`.
- Files containing JSX use `.tsx`.
- Non-JSX utility/API files use `.ts`.
- `tsconfig.json` has been added for Expo/TypeScript.
- The existing application logic was preserved; `// @ts-nocheck` is temporarily enabled per source file so the JavaScript-to-TypeScript migration does not change runtime behavior. Types can be added incrementally.

## Setup

From this directory:

```bash
npm install
npx expo start
```

If the project is being connected to the Education ERP backend, update the API base URL in:

`src/constants/index.ts`

The backend remains in the sibling `unified_backend` directory.
