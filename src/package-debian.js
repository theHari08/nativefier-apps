#!/usr/bin/env node

// Dependencies
const fse = require('fs-extra');
const installer = require('electron-installer-debian');
const path = require('path');
const rimraf = require('rimraf');

// Parameters
const packagePath = process.argv[2] || 'apps/unknown';

// Project
const buildApp = require('./build-app.js');
const packageJson = require(`../${packagePath}/package.json`);

// Target
const arch = 'x64';
const extension = 'deb';
const instructions = 'amd64';
const platform = 'linux';
const tag = 'x86_64';
const target = 'debian';
const out = `./build/${target}`;
const release = `./release/${target}`;

// Build application
buildApp(packagePath, packageJson, platform, arch, out, appPath => {
  // Prepare release
  fse.ensureDirSync(release);
  rimraf.sync(`${release}/${packageJson.name}-*.${extension}`);

  // Release options
  const installerOptions = {
    src: `${out}/${packageJson.name}-${platform}-${arch}`,
    name: packageJson.name,
    dest: release,
    icon: path.join(packagePath, packageJson.iconPng),
    license: packageJson.license,
    categories: [packageJson.category],
    options: {
      name: packageJson.name,
      productName: packageJson.productName,
      description: packageJson.description,
      productDescription: packageJson.description,
      version: packageJson.version,
      arch: instructions,
      icon: path.join(packagePath, packageJson.iconPng)
    }
  };

  // Release header
  console.log('');
  console.log('Building release (this may take a while) ...');

  // Release installer
  installer(installerOptions, err => {
    // Error handlings
    if (err) {
      console.error(err, err.stack);
      process.exit(1);
    }

    // Release footer
    console.log('Successfully created package at', installerOptions.dest);
    console.log('');
  });
});
