# DeepTWICH 

*In Development ...*

## Introduction

Welcome to DeepTWICH! This is an interactive visualization system that allows machine learning and healthcare professionals to build a better healthcare index.

- We retrieved geo-tagged tweets using keywords and built a pipeline consisting of data preprocessing, keyword and embedding extractions, and clustering to depict the neighborhood environment in terms of healthcare resources to predict outcomes of heart failure patients
- This interactive visualization system allows machine learning and health professionals to customize the entire pipeline and iteratively refine clustering by imposing pair-wise soft constraints on keywords 
- An abstract of the preceding research is published at [American Heart Association’s annual Scientific Sessions 2022](https://www.ahajournals.org/doi/abs/10.1161/circ.146.suppl_1.15011)
- This research is targetted at IEEE VIS’23; the current version of the abstract is shown below

### Abstract

Healthcare indices are used to evaluate the overall accessibility of public health resources for a given region and have been found to be especially useful for predicting post-treatment outcomes for a variety of diseases. Heart failure (HF) patients’ outcome after receiving treatment, for instance, has been discovered to be strongly correlated with the patient’s residing neighborhood, a variable yet to be incorporated into the process of healthcare indices’ generation. Based on preliminary research that shows census-level Twitter data can be utilized to capture neighborhood impact, we introduce \system, a visual analytic system for deep constrained clustering of Twitter data that helps improve this new data. Specifically, the system enables machine learning experts, healthcare professionals, and policymakers to (1) preprocess tweets retrieved by specified keywords, (2) extract keywords and their corresponding embeddings, and (3) customize, inspect, and refine a topic model through interactive clustering. Ultimately, this system allows for the iterative refinement of a more environment-reflective healthcare index.

### System Screenshots


<div align = "center">

| <img width="750" alt="elimination_tab" src="https://github.com/yunjiewu777/clus-vis/assets/85247180/1f1000b6-f1a1-426d-bb3b-a3f0d84b4d33"> | 
|:--:| 

</div>

## How to Run DeepTwich

Follow these steps to run DeepTwich:

1. **Clone the Repository**
   Clone the DeepTwich repository to your local machine 

2. **Set Up Firebase Cloud Storage**
   Set up a Firebase Cloud Storage account and obtain the necessary authentication information.

3. **Configure Authentication**
   Copy the authentication information to the file "flask-server/api/__init__.py". 

4. **Start the Server**
   Start the Flask server by running the appropriate command. For instance:
   ```
   cd DeepTwich/flask-server
   python main.py
   ```
   Make sure the server is up and running.

5. **Upload Demo Data**
   Send an "elimination/add" request to the server to upload the demo data.

6. **Start DeepTwich**
   Open the terminal, navigate to the main directory "DeepTwich," and run the following command:
   ```
   npm start
   ```
   This will start DeepTwich, and you'll be able to access it through your web browser.

Now, you should have DeepTwich up and running on your local machine. Enjoy using it!

## Contributors

- Yunjie(Ruby) Wu [@yunjiewu777](https://github.com/yunjiewu777)
- Xinran(Alexandra) Li [@shinrannli](https://github.com/shinrannli)
- Jing Zhang [@JZCS2018](https://github.com/JZCS2018)
- Joyce C Ho [@joyceho](https://github.com/joyceho)
- Emily Wall
