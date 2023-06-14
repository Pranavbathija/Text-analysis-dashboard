from flask import Flask
import numpy as np
import pandas as pd 
import spacy
from spacy import displacy
from flask import Flask, render_template, url_for,request,jsonify
from flask_cors import CORS,cross_origin
import nltk
from rake_nltk import Rake
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import contractions
stop_words = set(stopwords.words('english'))
from pathlib import Path


nltk.download('stopwords')
nltk.download('punkt')
nlp = spacy.load("en_core_web_sm")
nltk.download('vader_lexicon')

r=Rake()
sid = SentimentIntensityAnalyzer()
# depHtml={}
app=Flask(__name__)
# app.config["CORS_HEADERS"]='Content_type'
# CORS(app)

@app.route('/text_analysis_data', methods =["GET", "POST"])
@cross_origin(origin="*")
def text_analysis_data():
  if request.method == "POST":
    print("--------------------------------------------")
    print(request.json)
      # getting input with name = fname in HTML form
    ogText=request.json["text"]
    textval = request.json["text"].split(".")
    # print(request.json)
    for i in range(len(textval)):
      textval[i]=preprocess( request.json["checkbox"],textval[i])
    posText=[]
    nerText=[]
    keyText=[]
    polText=[]
    depHtml=[]
    depLink=[]
    
    print(textval)
    for text in textval:
      polText.append(textpolarity(text))
      keyText.append(keywordExt(text))
      posText.append(posTag(text))
      nerText.append(ner(text))
      depHtml.append(create_svg(text))
      create_svg(text)
    
    
    data={"textval":textval,"posText":posText,"nerText":nerText,"keyText":keyText,"polText":polText,"depLink":depLink,"checkbox":request.json["checkbox"],"orignalText":ogText,"depHtml":depHtml}
    
    data=jsonify(data)
    print(data.json)

    return data




  
def preprocess(checkbox,text):
  textlist=word_tokenize(text)
  text=" ".join(textlist)
  if checkbox["espace"]:
    text=remove_extra_spcs(text)
  if checkbox["lower"]:
    text=to_lower(text)

  if checkbox["contrac"]:
    text=expand_contractions(text)

  if checkbox["swords"]:
    text=remove_stop_words(text) 
  print(text)
  return text

def create_svg(text):
  doc = nlp(text)
  svg = displacy.render(doc, style="dep", jupyter=False)
  file_name = '-'.join([w.text for w in doc if not w.is_punct]) + ".html"
  

  html_template = """<html>
  <head>
  <title>Title</title>
  </head>
  <body>
  """+ svg +"""
    
  </body>
  </html>
  """
  
  return html_template


def remove_extra_spcs(x):
  res = " ".join(x.split())
  return res

def to_lower(x):
  return x.lower()
def expand_contractions(text):
  expanded_words = []   
  for word in text.split():
    expanded_words.append(contractions.fix(word))  
  expanded_text = ' '.join(expanded_words)
  return expanded_text





def remove_stop_words(text):
  word_tokens = word_tokenize(text)

  filtered_sentence = [w for w in word_tokens if not w.lower() in stop_words]

  filtered_sentence = []

  for w in word_tokens:
    if w not in stop_words:
      filtered_sentence.append(w)
  return " ".join(filtered_sentence)



def posTag(x):
  doc = nlp(x)
  s=[]
  for token in doc:
    # print(token.pos_)
    s.append(token.pos_)
  return " ".join(s)

def ner(x):
  doc = nlp(x)
  s=[]
  
  for ent in doc.ents:
    s.append(ent.text+":"+ent.label_)
  return ", ".join(s)
def keywordExt(x):
  r.extract_keywords_from_text(x)
  s=r.get_ranked_phrases()
  return ", ".join(s)


def textpolarity(x):
  pol=sid.polarity_scores(x)
  maxpol=0
  poltxt=""
  for k,v in pol.items():
    if v>maxpol:
      poltxt=k
      maxpol=v
  return poltxt

if __name__=="__main__":
    app.run(debug=True)