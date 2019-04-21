SHELL:=/bin/bash

XLOGINS:=xdvora3a_xgurec00_xsvabi00_xzitka07

.PHONY: all calc profile pack clean run test jest electronbuilder electron pkg node doc cleandoc jsdoc

all: calc profile

calc: electronbuilder
	sudo electron-builder

profile: pkg
	pkg profiling.js --targets node6

pack: clean
	mkdir -p $(XLOGINS)/repo/
	make doc
	rsync -av --progress doc $(XLOGINS)
	make cleandoc
	mkdir $(XLOGINS)/install
	shopt -s dotglob
	rsync -av --progress ../ $(XLOGINS)/repo --exclude="src/$(XLOGINS)" --exclude="install"
	rsync -av --progress ../install $(XLOGINS)
	zip -r ../$(XLOGINS).zip --exclude=*.DS_Store* $(XLOGINS)
	rm -rf $(XLOGINS)

doc: cleandoc jsdoc
	jsdoc . -r -c JSDoc.conf -d doc -R README.md -t jsdoctemplate/default

clean: cleandoc
	rm -rf profiling .clinic dist $(XLOGINS) ../$(XLOGINS).zip

cleandoc:
	rm -rf doc

run: electron
	npm start

test: jest
	jest --expand --verbose --silent ./js/math.lib.test.js

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

electron: node 
	@if [[ "$(shell which electron)" == "" ]]; then \
		sudo npm i -g electron --unsafe-perm=true --allow-root; \
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
