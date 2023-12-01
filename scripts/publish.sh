#!/bin/bash

# exit with nonzero exit code if anything fails
set -e

AFFECTED_LIBS=$(npm run nx show projects -- --type lib --affected --base=$NX_BASE --head=$NX_HEAD)
echo "$AFFECTED_LIBS"

# If empty, exit the job
if [ -n "$AFFECTED_LIBS" ]; then

	# 1. Based on conventional commits, determine new version
	# 2. Create a tag
	# 3. Release to github
	npm run nx run workspace:version

	# Build and version the projects
	npm run build && npm run version

	# 1. Itereates through the list of libs in dist directory
	# 2. Packs the build
	# 3. Publishes the build - npm publish --provenance --access public
	cd dist/libs
	for package in */; do
		echo "Publishing $package to npm!"
		(cd "$package" && npm pack && npm publish --provenance --access public --dry-run)
		echo "Inside directory $package!"
	done

else
	# No change so successfully exit the script
	echo "No libs affected, exiting job successfully"
	exit 0
fi

