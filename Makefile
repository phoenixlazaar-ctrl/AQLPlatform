.PHONY: all

all:
	@test -f public/index.html
	@echo "Netlify static site is ready"
