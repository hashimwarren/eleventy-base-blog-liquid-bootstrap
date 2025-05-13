# Lessons Learned

- Eleventy configuration must return a configuration object rather than relying on deprecated setter methods like `setHtmlTemplateEngine` or `setTemplateFormats`. Attempts to use those methods resulted in `TypeError` errors.
- Forcing `templateFormats` to include only Liquid did not prevent the RSS plugin's internal "virtual templates" from failing due to Nunjucks defaults. The correct approach was to switch to the manual template method for the RSS feed.
- Liquid templates do not support Nunjucks tags such as `{% set %}`. Every occurrence of `{% set %}` in page or include files (e.g., `tags.liquid`, `blog.liquid`, `index.liquid`) had to be replaced with Liquid's `{% assign %}` syntax.
- Nunjucks `{% set %}` tags were replaced with Liquid `{% assign %}` tags in all templates. For example, in `content/index.liquid`, `{% set postsCount = collections.posts | length %}` was updated to `{% assign postsCount = collections.posts | length %}`.
- Arithmetic operations and slicing in Liquid require specific filters like `minus` and `slice`. For instance, `{% set postslist = collections.posts | head(-1 * numberOfLatestPostsToShow) %}` was updated to `{% assign postslist = collections.posts | slice: 0, numberOfLatestPostsToShow %}`.
- Include paths were updated to use `.liquid` extensions instead of `.njk` to match the new template format.
- Attempts to use non-standard plugin options like `templateConfig` inside the RSS plugin configuration were unsupported. Creating a dedicated Liquid feed template (`_includes/feed.liquid`) and manually adding the necessary Liquid filters (`dateToRfc3339`, `absoluteUrl`, `htmlBaseUrl`) resolved the feed build errors.
- Iterative testing and build attempts highlighted the importance of reading plugin documentation closely and validating each change step-by-step.

# Clean Room Migration Plan

## Phase 1: Preparation

- [ ] Create a new git branch: `git checkout -b feature/liquid-migration`
- [ ] Document current site functionality and create screenshots for later comparison
- [ ] Create a backup of the site output: `npx @11ty/eleventy --output=_site_original`

## Phase 2: Update Configuration

- [ ] Update eleventy.config.js:
  - [ ] Keep `njk` in templateFormats temporarily to support RSS plugin's internal templates
  - [ ] Set htmlTemplateEngine and markdownTemplateEngine to "liquid"
  - [ ] Add required Liquid filters for RSS: `dateToRfc3339`, `absoluteUrl`
  - [ ] Add custom filters to handle syntax differences (e.g., `head`, `min`, `max`)

## Phase 3: Create Manual Feed Template

- [ ] Create a Liquid feed template at `_includes/feed.liquid`
- [ ] Update RSS plugin config to use manual template: `feedTemplate: "./_includes/feed.liquid"`

## Phase 4: Convert Templates (Layout First Approach)

- [ ] Convert layout files:
  - [ ] Copy `_includes/layouts/base.njk` to `_includes/layouts/base.liquid`
  - [ ] Copy `_includes/layouts/home.njk` to `_includes/layouts/home.liquid`
  - [ ] Copy `_includes/layouts/post.njk` to `_includes/layouts/post.liquid`
- [ ] Convert includes:
  - [ ] Copy `_includes/postslist.njk` to `_includes/postslist.liquid`
  - [ ] (Add other includes as needed)
- [ ] Convert page templates:
  - [ ] Copy `content/index.njk` to `content/index.liquid`
  - [ ] Copy `content/blog.njk` to `content/blog.liquid`
  - [ ] Copy `content/tags.njk` to `content/tags.liquid`
  - [ ] Copy `content/tag-pages.njk` to `content/tag-pages.liquid`
  - [ ] Copy `content/sitemap.xml.njk` to `content/sitemap.xml.liquid`

## Phase 5: Update Template Syntax

- [ ] Replace Nunjucks syntax with Liquid syntax in all new `.liquid` files:
  - [ ] Replace `{% set variable = value %}` with `{% assign variable = value %}`
  - [ ] Replace `{{ variable or default }}` with `{{ variable | default: default }}`
  - [ ] Replace `-1 * value` with `value | times: -1`
  - [ ] Replace `array | head(n)` with `array | slice: 0, n`
  - [ ] Replace `loop.last`, `loop.first` with `forloop.last`, `forloop.first`
  - [ ] Replace Nunjucks comments `{# #}` with `{% comment %}{% endcomment %}`
  - [ ] Update include paths from `.njk` to `.liquid`
  - [ ] Update filter syntax: `filter(arg)` to `filter: arg`

## Phase 6: Update Data Files

- [ ] Update layout paths in all `.11tydata.js` files:
  - [ ] `content/blog/blog.11tydata.js` update layout path to `.liquid` extension
  - [ ] `content/content.11tydata.js` update layout path to `.liquid` extension

## Phase 7: Testing

- [ ] Run the build: `npx @11ty/eleventy`
- [ ] Fix any syntax errors one by one
- [ ] Verify output against original site:
  - [ ] Compare file counts: `find _site_original -type f | wc -l` vs `find _site -type f | wc -l`
  - [ ] Check for unprocessed tags: `grep -R "{%" _site`
  - [ ] Visual inspection of key pages
- [ ] Run the site locally and test all functionality: `npx @11ty/eleventy --serve`
  - [ ] Test navigation
  - [ ] Test blog listing and posts
  - [ ] Test tag pages
  - [ ] Verify RSS feed works

## Phase 8: Cleanup

- [ ] Remove Nunjucks files once confident everything works
- [ ] Remove `njk` from the templateFormats if possible (test if RSS plugin still works)
- [ ] Update README.md to reflect the Liquid templating engine
- [ ] Document migration process and any remaining issues

<!-- Existing instructions or notes below -->
