# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Lloyd Hilaiel's personal website (lloyd.io) built with Jekyll and hosted on GitHub Pages. The site includes a blog with technical posts dating back to 2006, a work portfolio page, and a personal landing page.

## Architecture

- **Jekyll Static Site Generator**: Uses Jekyll with Liquid templating engine
- **Layouts**: Two main layouts in `_layouts/`
  - `default.html`: Standard page layout with header/footer includes
  - `post.html`: Blog post layout with social sharing
- **Content Structure**:
  - Blog posts in `_posts/` using Jekyll naming convention (YYYY-MM-DD-title)
  - Static pages: `index.html` (homepage), `blog/index.html` (blog listing), `work/index.html` (portfolio)
  - Shared includes in `_includes/` for header and footer
- **Assets**: CSS in `css/`, images in `i/`, JavaScript in `js/`
- **Configuration**: `_config.yml` defines site metadata, permalink structure, and Jekyll settings

## Development Commands

Since this is a Jekyll site, typical development workflow:

```bash
# Serve site locally (if Jekyll is installed)
jekyll serve

# Build site
jekyll build

# Clean build artifacts
jekyll clean
```

## Deployment

- **Branch**: Uses `gh-pages` branch as main branch
- **Hosting**: GitHub Pages deployment
- **Domain**: Custom domain configured via CNAME file
- **Publishing**: Direct pushes to `gh-pages` trigger automatic deployment

## Content Management

- **Blog Posts**: Add new posts to `_posts/` with proper Jekyll front matter and filename format
- **Pages**: Static pages use Jekyll front matter to specify layout and title
- **Projects**: Work portfolio data stored in `work/projects.json` as YAML front matter blocks
- **Styling**: Custom CSS with responsive design, uses web fonts (Ubuntu, Lekton)

## Key File Locations

- Site configuration: `_config.yml`
- Main stylesheet: `css/style.css`
- Blog post template: `_layouts/post.html`
- Homepage: `index.html`
- Blog listing: `blog/index.html`
- Work portfolio: `work/index.html`