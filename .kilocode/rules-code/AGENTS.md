# Code Mode Rules

## Component Patterns

- Use `cn()` from `@/lib/utils/cn` for ALL conditional className merging - never use template literals directly
- Import icons from `lucide-react` (already installed)
- Components use named exports: `export function ComponentName()`

## SEO Requirements

- Every page MUST export metadata using `createMetadata()` from `@/lib/seo/metadata`
- Article/guide pages use `createArticleMetadata()` instead

## Styling Conventions

- Google colors are pre-configured: `bg-google-blue`, `text-google-red`, etc.
- Container has responsive padding built-in - just use `className="container"`
- Hero sections: `min-h-[80vh]`, content sections: `py-32 md:py-48`
