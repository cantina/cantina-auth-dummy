
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		-t 20000 \
    --reporter $(REPORTER)

.PHONY: test
