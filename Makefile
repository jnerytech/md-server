.PHONY: install

install:
	nvm install $(shell cat .nvmrc) && nvm use $(shell cat .nvmrc) && npm install && npm link
