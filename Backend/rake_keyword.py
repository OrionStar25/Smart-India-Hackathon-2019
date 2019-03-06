from summarizer import raw_data
from rake_nltk import Rake
r = Rake()
r.extract_keywords_from_text(raw_data)

print(r.get_ranked_phrases())