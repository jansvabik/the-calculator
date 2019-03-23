all:
	@echo "Not prepared yet. But tests are prepared (make test, make coverage)."

jest test tests:
	@jest --expand --verbose --silent

coverage:
	@jest --expand --verbose --coverage --silent
	@rm -rf ./coverage