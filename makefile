help:
	@echo "valid make argument are:"
	@echo "    make wc (file line counts)"
	@echo "    make github (update github repository)"

wc:
	wc *.js */*.js | sort -nr

github:
	git push origin master
