# Blog System Documentation

This directory contains the markdown-based blog system for your portfolio site. The system allows you to easily create and manage blog posts using markdown files.

## How to Add a New Blog Post

### 1. Create a Markdown File

Create a new `.md` file in the `posts/` directory. Use a descriptive filename that will become the URL slug.

Example: `my-awesome-post.md`

### 2. Add Post Metadata

Add an entry to `posts.json` with the following information:

```json
{
    "slug": "my-awesome-post",
    "title": "My Awesome Post Title",
    "date": "2024-01-20",
    "readTime": 10,
    "excerpt": "A brief description of your post that will appear in the blog list.",
    "tags": ["tag1", "tag2", "tag3"]
}
```

**Fields:**

-   `slug`: URL-friendly version of your title (same as filename without .md)
-   `title`: The full title of your blog post
-   `date`: Publication date in YYYY-MM-DD format
-   `readTime`: Estimated reading time in minutes
-   `excerpt`: Short description (optional but recommended)
-   `tags`: Array of tags for categorization (optional)

### 3. Write Your Content

Write your blog post content in markdown format. The system supports:

-   **Headers**: `#`, `##`, `###`, `####`
-   **Bold**: `**text**`
-   **Italic**: `*text*`
-   **Code**: `` `code` `` and code blocks
-   **Links**: `[text](url)`
-   **Images**: `![alt](image-url)`
-   **Lists**: `- item` or `1. item`
-   **Blockquotes**: `> quote`
-   **Tables**: Standard markdown table syntax
-   **And more!**

### 4. Code Syntax Highlighting

The system automatically highlights code blocks. Specify the language for better highlighting:

```javascript
// JavaScript code
function hello() {
    console.log("Hello, World!");
}
```

```css
/* CSS code */
body {
    background-color: #1d1f21;
    color: #c9cacc;
}
```

```html
<!-- HTML code -->
<div class="container">
    <h1>Hello World</h1>
</div>
```

## File Structure

```
posts/
├── posts.json          # Blog post metadata
├── README.md          # This documentation
├── getting-started-with-web-development.md
├── modern-css-techniques.md
└── javascript-async-patterns.md
```

## Features

### Automatic Table of Contents

The system automatically generates a table of contents based on your headers (H1, H2, H3, H4).

### Responsive Design

All blog posts are fully responsive and work on all devices.

### Syntax Highlighting

Code blocks are automatically highlighted using highlight.js.

### SEO Friendly

Each post has proper meta tags and structured data.

### Fast Loading

Posts are loaded dynamically and cached for better performance.

## Tips for Writing

### Headers

Use headers to structure your content. The system will automatically create a table of contents:

```markdown
# Main Title

## Section 1

### Subsection 1.1

## Section 2
```

### Images

You can include images in your posts:

```markdown
![Alt text](path/to/image.jpg)
```

### Links

Add links to external resources:

```markdown
[Link text](https://example.com)
```

### Code Examples

Always specify the language for code blocks:

````markdown
```javascript
// Your JavaScript code here
```
````

```css
/* Your CSS code here */
```

````

### Lists
Use lists to organize information:

```markdown
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
- Item 3
````

## Customization

### Styling

The blog styling is in `styles/blog-styles.css`. You can customize:

-   Colors and themes
-   Typography
-   Layout and spacing
-   Animations and transitions

### JavaScript

The blog functionality is in `blog.js`. You can extend:

-   Post loading and rendering
-   Table of contents generation
-   Search functionality
-   Comments system

## Troubleshooting

### Post Not Showing

1. Check that the slug in `posts.json` matches the filename
2. Ensure the markdown file exists in the `posts/` directory
3. Verify the JSON syntax is valid

### Images Not Loading

1. Make sure image paths are correct
2. Check that images are in the correct directory
3. Use relative paths from the root of your site

### Code Highlighting Issues

1. Specify the correct language in code blocks
2. Check that the language is supported by highlight.js

## Best Practices

1. **Use descriptive filenames**: Make them URL-friendly
2. **Write good excerpts**: Keep them under 200 characters
3. **Use tags wisely**: Don't over-tag, use relevant categories
4. **Structure your content**: Use headers to organize your thoughts
5. **Include code examples**: When relevant, provide working code
6. **Add images**: Visual content makes posts more engaging
7. **Keep it readable**: Use proper spacing and formatting

## Example Post Structure

````markdown
# Your Post Title

Brief introduction to your topic.

## Main Section

Your main content here with paragraphs, code examples, and explanations.

### Subsection

More detailed information with examples:

```javascript
// Example code
function example() {
    return "Hello World";
}
```
````

## Conclusion

Wrap up your thoughts and provide next steps.

## Resources

-   [Link 1](https://example.com)
-   [Link 2](https://example.com)

```

Happy blogging! 🚀
```
