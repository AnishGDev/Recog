# Recog

## Overview 
Recog is a cloud-based markdown editor that is capable of translating handwritten notes into text. Simply create a new document and upload a scanned image, and it will analyse the text and append it to the document. 

It also is a fully functional markdown editor capable of creating lists, bullet points, rendering code and formatting. All of your documents are stored in Google Firebase, which allows for seamless access and editing anywhere, anytime.

## Built with
- **Firebase** for authentication, storage and database
- **Microsoft Cognitive** for text recognition
- **React JS** for UI.
## Folder Structure
```
.
+-- public
|   +-- index.html
|   +-- manifest.json
|   +-- robots.txt
+-- src
|   +-- helpers
|   |   +-- auth.js
|   |   +-- history.js
|   +-- pages
|   |   +-- Create.js
|   |   +-- Home.js
|   |   +-- Login.js
|   +-- App.css
|   +-- App.js
|   +-- index.css
|   +-- index.js
|   +-- header.html
|   +-- serviceWorker.js
+-- firebase.json
|   +-- default.html
|   +-- post.html
+-- firestore.indexes.json
|   +-- 2007-10-29-why-every-programmer-should-play-nethack.textile
|   +-- 2009-04-26-barcamp-boston-4-roundup.textile
+-- firestore.rules
|   +-- members.yml
+-- package.json
+-- storage.rules
```
    
## Where to next? (planned features)
- Rendering KaTeX in markdown.
- Recognising mathematical text on paper.
- Multiple users editing one file. 
