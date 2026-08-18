.DEFAULT_GOAL := help

.PHONY: help setup start tunnel ios android doctor typecheck

help:
	@echo "LinkGym app"
	@echo "  make setup   Node + .env + deps + doctor"
	@echo "  make start   Expo Go + QR (mesmo Wi-Fi do Mac)"
	@echo "  make tunnel  Expo Go + QR (celular no 4G/5G)"
	@echo "  make ios     simulador iOS (precisa Xcode)"

setup:
	node scripts/setup.cjs
	npm ci
	npx tsc --noEmit
	npx expo-doctor
	@echo ""
	@echo "Ambiente pronto. Próximo: make start"
	@echo "Celular fora do Wi-Fi do Mac: make tunnel"

start:
	npx expo start --go

tunnel:
	npx expo start --go --tunnel

ios:
	npx expo start --ios

android:
	npx expo start --android

doctor:
	npx expo-doctor

typecheck:
	npx tsc --noEmit
