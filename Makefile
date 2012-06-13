
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		-t 10000 \
    --reporter $(REPORTER)

.PHONY: test
