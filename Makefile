start: build execute

build:
	npm run build

execute:
	npm run start

dev:
	npm run dev

lint:
	npm run lint
	npm run format

up:
	docker compose up -d

down:
	docker compose down

build-image:
	docker compose build

shell:
	docker compose exec -it administrative bash
