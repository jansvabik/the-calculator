SHELL:=/bin/bash

.PHONY: all calc profile pack clean run test jest electronbuilder electron pkg node doc cleandocs jsdoc

all: calc profile

calc: electronbuilder
	sudo electron-builder

profile: pkg
	pkg profiling.js --targets node6

pack:
	zip -r the-calculator.zip --exclude=*.DS_Store* --exclude=*dev/* --exclude=*node_modules* .

doc: cleandocs jsdoc
	jsdoc . -r -c JSDoc.conf -d doc -R README.md -t jsdoctemplate/default

clean: cleandocs
	rm -rf profiling .clinic dist the-calculator.zip

cleandocs:
	rm -rf doc

run: electron
	npm start

test: jest
	jest --expand --verbose --silent ./js/math.lib.test.js

installer: electronpackager
	electron-packager .

jest: node
	@if [[ "$(shell which jest)" == "" ]]; then \
		sudo npm i -g jest; \
	fi

jsdoc: node
	@if [[ "$(shell which jsdoc)" == "" ]]; then \
		sudo npm i -g jsdoc; \
	fi

electronbuilder: node 
	@if [[ "$(shell which electron-builder)" == "" ]]; then \
		sudo npm i -g electron-builder; \
	fi

electronpackager:
	@if [[ "$(shell which electron-packager)" == "" ]]; then \
		sudo npm install electron --save --unsafe-perm=true --allow-root; \
		sudo npm i -g electron-packager; \
	fi

electron: node 
	@if [[ "$(shell which electron)" == "" ]]; then \
		sudo npm i -g electron; \
	fi

pkg: node
	@if [[ "$(shell which pkg)" == "" ]]; then \
		sudo npm i -g pkg; \
	fi

node:
	@if [[ "$(shell which curl)" == "" ]]; then \
		sudo apt-get --assume-yes install curl; \
	fi
	@if [[ "$(shell which node)" == "" ]]; then \
		curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -; \
		sudo apt-get --assume-yes install -y nodejs; \
	fi
