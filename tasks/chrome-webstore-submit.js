#!/usr/bin/env node

/**
 * IMPORTANT NOTE:
 * This script has not been tested yet so use with caution. All of the code
 * below was written by co-pilot AI and reviewed by a human, the human that is
 * writing this note. It me, the human. I haven't had a chance to test this yet.
 *
 * Chrome Web Store Publishing Script
 *
 * This script automates the process of uploading and publishing an extension
 * to the Chrome Web Store using the Chrome Web Store API.
 *
 * Prerequisites:
 * 1. Create a Google Cloud Project and enable the Chrome Web Store API
 * 2. Create OAuth2 credentials or service account credentials
 * 3. Set up environment variables or config file with credentials
 * 4. Have your extension built and packaged at: dist/dubplus-extension.zip
 *
 * Usage: node chrome-webstore-submit.js
 */

import { constants } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URLS = {
  OAUTH_TOKEN: 'https://oauth2.googleapis.com/token',
  CHROME_WEBSTORE_BASE: 'https://www.googleapis.com/chromewebstore/v1.1/items',
  CHROME_WEBSTORE_UPLOAD:
    'https://www.googleapis.com/upload/chromewebstore/v1.1/items',
};

// Configuration - these should be set via environment variables or config file
const CONFIG = {
  CLIENT_ID: process.env.CHROME_WS_CLIENT_ID,
  CLIENT_SECRET: process.env.CHROME_WS_CLIENT_SECRET,
  REFRESH_TOKEN: process.env.CHROME_WS_REFRESH_TOKEN,
  EXTENSION_ID: process.env.CHROME_WS_EXTENSION_ID,
  ZIP_PATH:
    process.env.ZIP_PATH || join(__dirname, '../dist/dubplus-extension.zip'),
  PUBLISH_TARGET: process.env.PUBLISH_TARGET || 'default', // 'default' or 'trustedTesters'
};

class ChromeWebStorePublisher {
  constructor() {
    this.accessToken = null;
    this.validateConfig();
  }

  validateConfig() {
    const required = [
      'CLIENT_ID',
      'CLIENT_SECRET',
      'REFRESH_TOKEN',
      'EXTENSION_ID',
    ];
    const missing = required.filter((key) => !CONFIG[key]);

    if (missing.length > 0) {
      console.error(`❌ Missing required configuration:
${missing.map((key) => `  - ${key}`).join('\n')}

Please set the following environment variables:
  CHROME_WS_CLIENT_ID
  CHROME_WS_CLIENT_SECRET
  CHROME_WS_REFRESH_TOKEN
  CHROME_WS_EXTENSION_ID

Optional:
  PUBLISH_TARGET (default: "default", can be "trustedTesters")`);
      process.exit(1);
    }
  }

  async makeRequest(url, options = {}) {
    const { method = 'GET', headers = {}, body } = options;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = `HTTP ${response.status}: ${errorData.error?.message || response.statusText}`;
        } catch {
          // Keep the original error message if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      // Try to parse as JSON, fallback to text
      try {
        return await response.json();
      } catch {
        // If JSON parsing fails, get text instead
        return await response.text();
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  async getAccessToken() {
    console.log('🔑 Getting access token...');

    const body = new URLSearchParams({
      client_id: CONFIG.CLIENT_ID,
      client_secret: CONFIG.CLIENT_SECRET,
      refresh_token: CONFIG.REFRESH_TOKEN,
      grant_type: 'refresh_token',
    });

    try {
      const response = await this.makeRequest(API_URLS.OAUTH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
      /**
       * response will be an object that looks like this:
       * {
       *   "access_token" : "ya29...",
       *   "expires_in" : 3600,
       *   "refresh_token" : "1/rwn...",
       *   "scope": "https://www.googleapis.com/auth/chromewebstore",
       *   "token_type" : "Bearer",
       * }
       */
      this.accessToken = response.access_token;
      console.log('✅ Access token obtained');
      return this.accessToken;
    } catch (error) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  async uploadExtension() {
    console.log('📦 Uploading extension package...');

    try {
      await access(CONFIG.ZIP_PATH, constants.F_OK);
    } catch {
      throw new Error(`Extension ZIP file not found: ${CONFIG.ZIP_PATH}`);
    }

    try {
      const zipData = await readFile(CONFIG.ZIP_PATH);
      const url = `${API_URLS.CHROME_WEBSTORE_UPLOAD}/${CONFIG.EXTENSION_ID}`;

      const response = await this.makeRequest(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'x-goog-api-version': '2',
          'Content-Type': 'application/zip',
        },
        body: zipData,
      });

      if (response.uploadState === 'SUCCESS') {
        console.log('✅ Extension uploaded successfully');
        return response;
      } else {
        console.error('❌ Upload failed:', response);
        throw new Error(`Upload failed: ${response.uploadState}`);
      }
    } catch (error) {
      throw new Error(`Failed to upload extension: ${error.message}`);
    }
  }

  async publishExtension() {
    console.log(`🚀 Publishing extension to ${CONFIG.PUBLISH_TARGET}...`);

    let url = `${API_URLS.CHROME_WEBSTORE_BASE}/${CONFIG.EXTENSION_ID}/publish`;

    // Add publish target if not default
    if (CONFIG.PUBLISH_TARGET !== 'default') {
      url += `?publishTarget=${CONFIG.PUBLISH_TARGET}`;
    }

    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'x-goog-api-version': '2',
          'Content-Type': 'application/json',
        },
      });

      if (response.status && response.status.includes('OK')) {
        console.log('✅ Extension published successfully');
        return response;
      } else {
        console.error('❌ Publish failed:', response);
        throw new Error(`Publish failed: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      throw new Error(`Failed to publish extension: ${error.message}`);
    }
  }

  async getExtensionInfo() {
    console.log('ℹ️  Getting extension information...');

    const url = `${API_URLS.CHROME_WEBSTORE_BASE}/${CONFIG.EXTENSION_ID}`;

    try {
      const response = await this.makeRequest(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'x-goog-api-version': '2',
        },
      });

      console.log('📊 Extension Info:');
      console.log(`  - ID: ${response.id}`);
      console.log(`  - Status: ${response.status}`);
      console.log(`  - Version: ${response.version}`);
      if (response.publishedVersion) {
        console.log(`  - Published Version: ${response.publishedVersion}`);
      }
      return response;
    } catch (error) {
      console.warn(`⚠️  Could not get extension info: ${error.message}`);
      return null;
    }
  }

  async run() {
    try {
      console.log('🚀 Starting Chrome Web Store publication process...\n');

      // Check if zip file exists
      try {
        await access(CONFIG.ZIP_PATH, constants.F_OK);
        console.log(`📦 Using extension package: ${CONFIG.ZIP_PATH}`);
      } catch {
        throw new Error(
          `Extension ZIP file not found: ${CONFIG.ZIP_PATH}\nPlease ensure the extension has been built and packaged first.`,
        );
      }

      // Get access token
      await this.getAccessToken();

      // Get current extension info
      await this.getExtensionInfo();

      // Upload extension
      await this.uploadExtension();

      // Publish extension
      await this.publishExtension();

      // Get updated extension info
      console.log('\n📊 Final extension status:');
      await this.getExtensionInfo();

      console.log('\n🎉 Publication process completed successfully!');
    } catch (error) {
      console.error('\n❌ Publication failed:', error.message);
      process.exit(1);
    }
  }
}

const publisher = new ChromeWebStorePublisher();

try {
  await publisher.run();
} catch (error) {
  console.error('❌ Publication failed:', error.message);
  process.exit(1);
}
