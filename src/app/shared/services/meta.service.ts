import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import {
  MetaConfig,
  OpenGraphConfig,
  TwitterCardConfig,
  CustomMetaTag,
  StructuredDataConfig,
} from '../interfaces/meta.interface';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Updates all meta tags based on the provided configuration
   */
  updateTags(config: MetaConfig): void {
    if (config.title) {
      this.updateTitle(config.title);
    }

    if (config.description) {
      this.updateDescription(config.description);
    }

    if (config.keywords) {
      this.updateKeywords(config.keywords);
    }

    if (config.author) {
      this.updateAuthor(config.author);
    }

    if (config.robots) {
      this.updateRobots(config.robots);
    }

    if (config.canonical) {
      this.updateCanonical(config.canonical);
    }

    if (config.openGraph) {
      this.updateOpenGraphTags(config.openGraph);
    }

    if (config.twitter) {
      this.updateTwitterCardTags(config.twitter);
    }

    if (config.customTags && config.customTags.length > 0) {
      this.updateCustomTags(config.customTags);
    }
  }

  /**
   * Updates the page title
   */
  updateTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  /**
   * Updates the meta description
   */
  updateDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  /**
   * Updates the meta keywords
   */
  updateKeywords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  /**
   * Updates the meta author
   */
  updateAuthor(author: string): void {
    this.meta.updateTag({ name: 'author', content: author });
  }

  /**
   * Updates the robots meta tag
   */
  updateRobots(robots: string): void {
    this.meta.updateTag({ name: 'robots', content: robots });
  }

  /**
   * Updates the canonical URL
   */
  updateCanonical(url: string): void {
    // Remove existing canonical link if present
    const existingCanonical = this.document.querySelector(
      'link[rel="canonical"]'
    );
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  /**
   * Updates Open Graph meta tags
   */
  updateOpenGraphTags(config: OpenGraphConfig): void {
    if (config.title) {
      this.meta.updateTag({ property: 'og:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({
        property: 'og:description',
        content: config.description,
      });
    }

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }

    if (config.imageAlt) {
      this.meta.updateTag({
        property: 'og:image:alt',
        content: config.imageAlt,
      });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    if (config.type) {
      this.meta.updateTag({ property: 'og:type', content: config.type });
    }

    if (config.siteName) {
      this.meta.updateTag({
        property: 'og:site_name',
        content: config.siteName,
      });
    }

    if (config.locale) {
      this.meta.updateTag({ property: 'og:locale', content: config.locale });
    }
  }

  /**
   * Updates Twitter Card meta tags
   */
  updateTwitterCardTags(config: TwitterCardConfig): void {
    if (config.card) {
      this.meta.updateTag({ name: 'twitter:card', content: config.card });
    }

    if (config.site) {
      this.meta.updateTag({ name: 'twitter:site', content: config.site });
    }

    if (config.creator) {
      this.meta.updateTag({ name: 'twitter:creator', content: config.creator });
    }

    if (config.title) {
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({
        name: 'twitter:description',
        content: config.description,
      });
    }

    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.imageAlt) {
      this.meta.updateTag({
        name: 'twitter:image:alt',
        content: config.imageAlt,
      });
    }
  }

  /**
   * Updates custom meta tags
   */
  updateCustomTags(tags: CustomMetaTag[]): void {
    tags.forEach((tag) => {
      const attributes: { [key: string]: string } = { content: tag.content };

      if (tag.name) attributes['name'] = tag.name;
      if (tag.property) attributes['property'] = tag.property;
      if (tag.httpEquiv) attributes['http-equiv'] = tag.httpEquiv;

      this.meta.updateTag(attributes);
    });
  }

  /**
   * Adds structured data (JSON-LD) to the page
   */
  addStructuredData(config: StructuredDataConfig): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': config.type,
      ...config.data,
    };

    script.textContent = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }

  /**
   * Removes all structured data scripts
   */
  clearStructuredData(): void {
    const scripts = this.document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    scripts.forEach((script) => script.remove());
  }

  /**
   * Sets default meta tags for the application
   */
  setDefaults(): void {
    const defaultConfig: MetaConfig = {
      title: 'Travel Ecommerce - Your Ultimate Travel Destination',
      description:
        'Discover amazing travel packages and experiences with our premium travel ecommerce platform.',
      keywords: 'travel, vacation, packages, tours, destinations, booking',
      author: 'Travel Ecommerce Team',
      robots: 'index, follow',
      openGraph: {
        type: 'website',
        siteName: 'Travel Ecommerce',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
      },
    };

    this.updateTags(defaultConfig);
  }

  /**
   * Removes a specific meta tag
   */
  removeTag(attrSelector: string): void {
    this.meta.removeTag(attrSelector);
  }

  /**
   * Gets the current page title
   */
  getTitle(): string {
    return this.title.getTitle();
  }

  /**
   * Gets a specific meta tag content
   */
  getTag(attrSelector: string): string | null {
    const tag = this.meta.getTag(attrSelector);
    return tag ? tag.content : null;
  }
}
