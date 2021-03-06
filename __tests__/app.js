'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const helper = require('../generators/app/promptingHelpers');
const chalk = require('chalk');

describe('generator-http-fake-backend → server with custom header', () => {
  beforeAll(done => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        serverPort: 8081,
        apiPrefix: '/api',
        customHeader: true,
        customHeaderName: 'HeaderName',
        customHeaderValue: 'HeaderValue'
      })
      .on('end', done);
  });

  describe('file creation', () => {
    it('should create dot files', () => {
      assert.file([
        '.editorconfig',
        '.env',
        '.gitattributes',
        '.gitignore'
      ]);
    });

    describe('.env', () => {
      it('should contain the prompted port number', () => {
        assert.fileContent('.env', /SERVER_PORT=8081/);
      });
      it('should contain the prompted api url prefix', () => {
        assert.fileContent('.env', /API_PREFIX=\/api/);
      });
      it('should contain the prompted custom header name', () => {
        assert.fileContent('.env', /CUSTOM_HEADER_NAME=HeaderName/);
      });
      it('should contain the prompted custom header value', () => {
        assert.fileContent('.env', /CUSTOM_HEADER_VALUE=HeaderValue/);
      });
    });

    it('should create meta files', () => {
      assert.file([
        'LICENSE',
        'nodemon.json',
        'package.json',
        'README.md',
        'yarn.lock'
      ]);
    });

    it('should create JS files in root directory', () => {
      assert.file([
        'config.js',
        'index.js',
        'manifest.js',
        'server.js'
      ]);
    });

    it('should create response-files directory', () => {
      assert.file([
        'response-files/.gitkeep'
      ]);
    });

    it('should create server files', () => {
      assert.file([
        'server/api/setup/lib/getContentDisposition.js',
        'server/api/setup/lib/getCustomResponseHeader.js',
        'server/api/setup/index.js',
        'server/api/setup/supportedMethod.js',
        'server/api/setup/unsupportedMethods.js',
        'server/web/index.js',
        'server/web/public/assets/css/styles.css',
        'server/web/public.js',
        'server/web/views/helpers/json.js',
        'server/web/views/helpers/methods.js',
        'server/web/views/helpers/removeCurlyBraces.js',
        'server/web/views/index.hbs',
        'server/web/views/layout/layout.hbs',
        'server/web/views/partials/footer.hbs',
        'server/web/views/partials/header.hbs'
      ]);
    });

    it('should create test files', () => {
      assert.file([
        'test/config.js',
        'test/index.js',
        'test/manifest.js',
        'test/server/api/customResponseHeader.js',
        'test/server/api/endpoint.js',
        'test/server/api/fakeStatusCode.js',
        'test/server/api/fileTypes.js',
        'test/server/api/fixtures/example.pdf',
        'test/server/api/fixtures/response.html',
        'test/server/api/fixtures/response.json',
        'test/server/api/fixtures/response.txt',
        'test/server/web/index.js'
      ]);
    });
  });
});

describe('generator-http-fake-backend → server without custom header', () => {
  beforeAll(done => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        serverPort: 8081,
        apiPrefix: '/api',
        customHeader: false
      })
      .on('end', done);
  });

  describe('.env', () => {
    it('should contain the prompted custom header name', () => {
      assert.fileContent('.env', /CUSTOM_HEADER_NAME=\n/);
    });
    it('should contain the prompted custom header value', () => {
      assert.fileContent('.env', /CUSTOM_HEADER_VALUE=\n/);
    });
  });
});

describe('generator-http-fake-backend → server → prompting helpers', () => {
  describe('→ validateApiPrefix()', () => {
    it('should accept a leading slash', () => {
      assert.equal(helper.validateApiPrefix('/api'), true);
    });
    it('should fail with a trailing slash', () => {
      assert.equal(helper.validateApiPrefix('/api/'), chalk.red('please enter API prefix without trailing  `/`.'));
    });
    it('should fail when missing a leading slash', () => {
      assert.equal(helper.validateApiPrefix('api'), chalk.red('API prefix has to begin with a `/`.'));
    });
  });

  describe('→ validateCustomHeader()', () => {
    it('should accept a non empty string', () => {
      assert.equal(helper.validateCustomHeader('x-powered-by'), true);
    });
    it('should fail with a empty string', () => {
      assert.equal(helper.validateCustomHeader(''), chalk.red('Can’t be an empty string.'));
    });
    it('should fail with a empty string', () => {
      assert.equal(helper.validateCustomHeader('   '), chalk.red('Can’t be an empty string.'));
    });
  });
});
