.DEFAULT_GOAL := help

.PHONY: help setup start ios android doctor typecheck

help:
	@echo "LinkGym app"
	@echo "  make setup  copia .env (se faltar) e instala as dependências"
	@echo "  make start  abre o Expo (SDK 54)"
	@echo "  make ios    simulador iOS"
	@echo "  make doctor confere versões do Expo"

setup:
	node scripts/setup.cjs
	npm install

start:
	npx expo start

ios:
	npx expo start --ios

android:
	npx expo start --android

doctor:
	npx expo-doctor

typecheck:
	npx tsc --noEmit
