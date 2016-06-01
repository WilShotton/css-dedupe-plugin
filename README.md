# CSS Dedupe Plugin
A Webpack plugin to remove duplicate CSS classes. 

Looks for CSS files in the Webpack output and removes any duplicate CSS classes.

### Usage

In Webpack config

```JavaScript
plugins: [
	new CSSDedupePlugin()
]
```

*Note: This process can be slow so is probably best for production builds only* 