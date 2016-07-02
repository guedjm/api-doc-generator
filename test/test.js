const path = require('path');
const docApiGenerator = require('../');

describe('Testing doc-api-generator', function () {
  it('Should generate a documentation', function (done) {

    docApiGenerator.generateDocumentation(path.join(__dirname, '/fixture/api-service.yaml'),
      path.join(__dirname, '/fixture/CHANGELOG.md'),
      '1.0.0',
      path.join(__dirname, '/result'),
      done);
  });
});