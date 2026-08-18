.DEFAULT_GOAL := help

.PHONY: help setup start ios android doctor typecheck

help:
	@echo "LinkGym app"
	@echo "  make setup  Node + .env + deps + doctor (sócio: rode isto primeiro)"
	@echo "  make start  Expo Go / QR (SDK 54)"
	@echo "  make ios    simulador iOS (precisa Xcode)"
	@echo "  make doctor confere versões do Expo"

setup:
	node scripts/setup.cjs
	npm ci
	npx tsc --noEmit
	npx expo-doctor
	@echo ""
	@echo "Ambiente pronto. Próximo: make start"

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
