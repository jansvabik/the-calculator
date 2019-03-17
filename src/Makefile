all:
	@echo "Not prepared yet. But tests are prepared (make test, make coverage)."

jest test tests:
	@jest --expand --silent --verbose

coverage:
	@jest --expand --silent --verbose --coverage
	@rm -rf ./coverage