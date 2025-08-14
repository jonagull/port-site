// Blog System JavaScript
class BlogSystem {
    constructor() {
        this.posts = [];
        this.currentPost = null;
        this.init();
    }

    async init() {
        // Configure marked.js for syntax highlighting and header IDs
        marked.setOptions({
            highlight: function (code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {}
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true,
            headerIds: true,
            headerPrefix: "heading-",
        });

        // Load blog posts
        await this.loadPosts();

        // Set up event listeners
        this.setupEventListeners();

        // Show blog list by default
        this.showBlogList();
    }

    async loadPosts() {
        try {
            // Load the posts configuration
            const response = await fetch("./posts/posts.json");
            this.posts = await response.json();

            // Sort posts by date (newest first)
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error("Error loading posts:", error);
            this.posts = [];
        }
    }

    setupEventListeners() {
        // Back to list button
        const backButton = document.getElementById("back-to-list");
        if (backButton) {
            backButton.addEventListener("click", () => {
                this.showBlogList();
            });
        }

        // Handle browser back/forward
        window.addEventListener("popstate", (event) => {
            if (event.state && event.state.post) {
                this.loadPost(event.state.post);
            } else {
                this.showBlogList();
            }
        });
    }

    showBlogList() {
        const blogList = document.getElementById("blog-list");
        const blogPost = document.getElementById("blog-post");

        blogList.style.display = "block";
        blogPost.style.display = "none";

        this.renderBlogList();

        // Update URL
        window.history.pushState({}, "", "/blog.html");
    }

    renderBlogList() {
        const container = document.getElementById("posts-container");

        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="loading">
                    <p>No blog posts found. Create some markdown files in the posts directory!</p>
                </div>
            `;
            return;
        }

        const postsHTML = this.posts
            .map(
                (post) => `
            <div class="post-card" onclick="blogSystem.loadPost('${
                post.slug
            }')">
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span>📅 ${new Date(post.date).toLocaleDateString()}</span>
                    <span>⏱️ ${post.readTime} min read</span>
                    ${
                        post.tags
                            ? `<span>🏷️ ${post.tags.join(", ")}</span>`
                            : ""
                    }
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <span class="read-more">Read more →</span>
            </div>
        `
            )
            .join("");

        container.innerHTML = postsHTML;
    }

    async loadPost(slug) {
        const post = this.posts.find((p) => p.slug === slug);
        if (!post) {
            console.error("Post not found:", slug);
            return;
        }

        this.currentPost = post;

        try {
            // Load markdown content
            const response = await fetch(`./posts/${slug}.md`);
            const markdown = await response.text();

            // Convert markdown to HTML
            const html = marked.parse(markdown);

            // Render the post
            this.renderPost(post, html);

            // Generate table of contents
            this.generateTOC();

            // Show post view
            this.showPostView();

            // Update URL
            window.history.pushState(
                { post: slug },
                "",
                `/blog.html?post=${slug}`
            );
        } catch (error) {
            console.error("Error loading post:", error);
            this.showError("Failed to load blog post");
        }
    }

    renderPost(post, html) {
        const container = document.getElementById("post-container");

        const postHTML = `
            <div class="post-content">
                ${html}
            </div>
        `;

        container.innerHTML = postHTML;

        // Apply syntax highlighting to code blocks
        hljs.highlightAll();
    }

    generateTOC() {
        const tocList = document.getElementById("toc_list");
        const headings = document.querySelectorAll(
            ".post-content h1, .post-content h2, .post-content h3, .post-content h4"
        );

        if (headings.length === 0) {
            tocList.innerHTML = "<li>No headings found</li>";
            return;
        }

        const tocItems = [];

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent;

            // Generate a slug from the heading text
            const slug = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const id = `heading-${index}-${slug}`;

            // Set the heading ID if not already set
            if (!heading.id) {
                heading.id = id;
            }

            const tocItem = {
                level: level,
                text: text,
                id: heading.id,
                children: [],
            };

            if (level === 1) {
                tocItems.push(tocItem);
            } else if (level === 2) {
                if (tocItems.length > 0) {
                    tocItems[tocItems.length - 1].children.push(tocItem);
                } else {
                    tocItems.push(tocItem);
                }
            } else if (level === 3) {
                if (tocItems.length > 0) {
                    const lastH1 = tocItems[tocItems.length - 1];
                    if (lastH1.children.length > 0) {
                        lastH1.children[
                            lastH1.children.length - 1
                        ].children.push(tocItem);
                    } else {
                        lastH1.children.push(tocItem);
                    }
                } else {
                    tocItems.push(tocItem);
                }
            }
        });

        const renderTOC = (items) => {
            return items
                .map(
                    (item) => `
                <li>
                    <a href="#${item.id}" data-heading-id="${
                        item.id
                    }" class="toc-link">${item.text}</a>
                    ${
                        item.children && item.children.length > 0
                            ? `<ul>${renderTOC(item.children)}</ul>`
                            : ""
                    }
                </li>
            `
                )
                .join("");
        };

        tocList.innerHTML = renderTOC(tocItems);

        // Set up scroll spy for TOC highlighting
        this.setupScrollSpy();

        // Add click event listeners to TOC links
        this.setupTOCLinks();
    }

    setupScrollSpy() {
        const headings = document.querySelectorAll(
            ".post-content h1, .post-content h2, .post-content h3, .post-content h4"
        );
        const tocLinks = document.querySelectorAll(".toc-link");

        if (headings.length === 0) return;

        const observerOptions = {
            rootMargin: "-20% 0px -80% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Remove active class from all TOC links
                    tocLinks.forEach((link) => link.classList.remove("active"));

                    // Add active class to corresponding TOC link
                    const activeLink = document.querySelector(
                        `[data-heading-id="${entry.target.id}"]`
                    );
                    if (activeLink) {
                        activeLink.classList.add("active");
                    }
                }
            });
        }, observerOptions);

        headings.forEach((heading) => observer.observe(heading));
    }

    setupTOCLinks() {
        const tocLinks = document.querySelectorAll(".toc-link");

        tocLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const targetId = link.getAttribute("href").substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Remove active class from all links
                    tocLinks.forEach((l) => l.classList.remove("active"));

                    // Add active class to clicked link
                    link.classList.add("active");

                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            });
        });
    }

    showPostView() {
        const blogList = document.getElementById("blog-list");
        const blogPost = document.getElementById("blog-post");

        blogList.style.display = "none";
        blogPost.style.display = "block";
    }

    showError(message) {
        const container = document.getElementById("post-container");
        container.innerHTML = `
            <div class="error">
                <h2>Error</h2>
                <p>${message}</p>
                <button onclick="blogSystem.showBlogList()">Back to Posts</button>
            </div>
        `;
    }
}

// Initialize the blog system when the page loads
let blogSystem;
document.addEventListener("DOMContentLoaded", () => {
    blogSystem = new BlogSystem();
});

// Handle direct links to posts
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get("post");

    if (postSlug) {
        // Wait for blog system to initialize
        setTimeout(() => {
            blogSystem.loadPost(postSlug);
        }, 100);
    }
});
