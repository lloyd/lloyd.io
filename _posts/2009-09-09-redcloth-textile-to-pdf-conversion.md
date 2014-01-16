---
title: Redcloth/Textile to PDF conversion
layout: post
---

<p>A little make magic (leveraging redcloth and htmldoc) seems to have done the trick. Now high quality print output it ain't, but a good start!</p>

{% highlight make %}
bridges.pdf: bridges.html
	htmldoc -t pdf14 --webpage bridges.html > bridges.pdf

bridges.html: bridges.textile
    redcloth < bridges.textile > bridges.html

.PHONY: view
view: bridges.pdf
	xpdf bridges.pdf

.PHONY: clean
clean:
	@rm -f bridges.html bridges.pdf *~
{% endhighlight %}
