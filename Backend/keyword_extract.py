keyword_article = []
for k in keywords:
 k = re.sub(“\r\n”,””,k)
 if k in articlekeyword_article.append(k)