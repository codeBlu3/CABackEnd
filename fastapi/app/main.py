from typing import Optional

from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware


import os
import re
import json



import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from ftfy import fix_text
import networkx as nx
import pandas as pd

'''
'''



app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8888",
    "http://localhost:19006",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def pickleOut(obj, fname):
    fout =  open(fname, 'wb')
    pickle.dump(obj, fout)
    fout.close()
    print(f'object was successfully exported to {fname}')

def pickleIn(fname):
    fIn =  open(fname, 'rb')
    obj = pickle.load(fIn)
    fIn.close()
    print(f'object {fname} was successfully imported  ')
    return obj

def fixStrTextNorm(dstr):
    dstr = fix_text(dstr)
    dstr = dstr.lower()
    dstr = dstr.replace('|', '')
    dstr = dstr.strip()
    return dstr 

def dfObjColConverter(df, ltcols):
    for col in ltcols:
        if df[col].dtype == 'object':
            df[col] = df[col].fillna('') 
            df[col]  =  df[col].astype('str').apply(fixStrTextNorm)
    return df

def compNameGenerator(df, ltcols, sep = '| ' ):    
    return  df[ltcols].apply(lambda x: sep.join(x.dropna().astype(str).values), axis=1) 

def ngrams(string, n=3):
    string = re.sub(r'[,-./|]',r'', string)
    ngrams = zip(*[string[i:] for i in range(n)])
    return [''.join(ngram) for ngram in ngrams]

def dfMatchesTodDupID(df):
    g = nx.from_pandas_edgelist(df, 'DatabaseData', 'QueryData')
    ltconx = [{'compname': list(it)} for it in nx.connected_components(g)]
    dfgroup = pd.DataFrame(ltconx)
    dfgroup['groupID'] = dfgroup.index
    dfduptracker = dfgroup.explode('compname')
    return dfduptracker 



@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/headersbyfilename")
async def ltHeadersByFilename(request: Request):
    byteJson = await request.body()
    strRep = str(byteJson, 'UTF-8')
    filename = json.loads(strRep)
    filename= filename['filename']
    df = pd.read_csv(os.getcwd()  + f'/app/shared/{filename}')
    ltcolumns =  df.columns.to_list()

    return {'headerColumns': ltcolumns} 

#add multprocessing to speed up things //eto yung backend code na kailangan ni pasa sa gpu na prefect
#to pass file name is crucial here
#pass file name, jobid, headercols  


def bgDedupeJobRun(filename, ltcols, jobID):
    df = pd.read_csv(os.getcwd()  + f'/app/shared/{filename}')
    ltColumnsToMatch  =  sorted(ltcols)
    dfdp =  dfObjColConverter(df,ltColumnsToMatch) 
    dfdp['compname'] = compNameGenerator(dfdp, ltColumnsToMatch)
    origfname = os.getcwd()+f'/app/shared/pkl/dfdp{jobID}.pkl'
    try: 
        os.remove(resfname)
    except Exception as e:
        print(e)

    pickleOut(dfdp, origfname)
    dfdb =  dfdp.compname.drop_duplicates()
    vectorizer = TfidfVectorizer(min_df=1, analyzer=ngrams)
    db_tf_idf_matrix = vectorizer.fit_transform(dfdb)
    knn = NearestNeighbors(n_neighbors=10 , metric = 'cosine', n_jobs = -1 )
    knn.fit(db_tf_idf_matrix)
    D, I = knn.kneighbors(db_tf_idf_matrix, 10)  

    matches = []
    for r,indVals in enumerate(I):
        for c, dbloc in enumerate(indVals):
            temp = [D[r][c], dfdb.iloc[dbloc], dfdb.iloc[r]]
            matches.append(temp)

    dfdpmatches = pd.DataFrame(matches, columns = ['Kdistance','DatabaseData','QueryData'])
    dfdpmatches = dfdpmatches[(dfdpmatches['Kdistance'] > 0.000000001) & (dfdpmatches['Kdistance'] < 1)].sort_values('Kdistance', ascending = True)
    resfname = os.getcwd()+f'/app/shared/pkl/dfdpmatches{jobID}.pkl'
    try: 
        os.remove(resfname)
    except Exception as e:
        print(e)

    pickleOut(dfdpmatches, resfname)
    #estimated runtime???

    #diretso na mag query sa mongo database , wag na mag python call back. mahirapan tayo sa authentication 
    #call back to dito, update 
    # get email by jobID , add email, 



@app.post("/headersselected")
async def headersSelected(request: Request, background_tasks: BackgroundTasks):
    byteJson = await request.body()
    strRep = str(byteJson, 'UTF-8')
    data = json.loads(strRep)
    #print(data)

    filename = ''  
    jobID = '' 
    ltcols = [] 
    for it in data:
        for k, v in it.items():
            if k not in (['dpfilename', 'jobID']) and v:
                ltcols.append(k)
            elif k == 'dpfilename':
               filename = v
            elif k == 'jobID':
               jobID = v 
    background_tasks.add_task(bgDedupeJobRun, filename, ltcols, jobID)

    return {"status": "success"}

@app.post("/dfmatches")
async def dfmatches(request: Request ):
    byteJson = await request.body()
    print(byteJson)
    strRep = str(byteJson, 'UTF-8')
    data = json.loads(strRep)
    jobID = data['jobID'] 

    resfname = os.getcwd()+f'/app/shared/pkl/dfdpmatches{jobID}.pkl'
    dfdpmatches = pickleIn(resfname)
    dfmatchesdata = dfdpmatches.to_json(orient='records')
    #print(dfmatchesdata)
    return dfmatchesdata  

#add jobid, this can be waited
@app.post("/kdistanceselection")
async def kdistanceselection(request: Request):
    #add try catch clause
    byteJson = await request.body()
    strRep = str(byteJson, 'UTF-8')
    data= json.loads(strRep)
    KdistanceThold = float(data['kdistance'])
    jobID = data['jobID'] 
    resfname = os.getcwd()+f'/app/shared/pkl/dfdpmatches{jobID}.pkl'
    dfdpmatches = pickleIn(resfname)
    dfOrigfname = os.getcwd()+f'/app/shared/pkl/dfdp{jobID}.pkl'
    dfdp = pickleIn(dfOrigfname)

    dfdpmatchesthold = dfdpmatches[dfdpmatches['Kdistance'] < KdistanceThold]
    dfdpdupid = dfMatchesTodDupID(dfdpmatchesthold)
    dfdpOrigWithDupId = dfdpdupid.merge(dfdp, on = 'compname', how = 'inner')
    pickleOut( dfdpOrigWithDupId, os.getcwd()+f'/app/shared/pkl/dfdpOrigWithDupId{jobID}.pkl')
    #dfmatchesdata = dfdpmatches.to_json(orient='records')
    #return dfmatchesdata  
    return {"status": "success"}



@app.post("/dfdpOrigWithDupId")
async def dfdpOrigWithDupIdData(request: Request):
    byteJson = await request.body()
    strRep = str(byteJson, 'UTF-8')
    data= json.loads(strRep)
    jobID = data['jobID'] 
    resfname = os.getcwd()+f'/app/shared/pkl/dfdpOrigWithDupId{jobID}.pkl'
    dfdpOrigWithDupId = pickleIn(resfname)
    dfdpOrigWithDupIdData =  dfdpOrigWithDupId.to_json(orient='records')
    #print(dfmatchesdata)
    return dfdpOrigWithDupIdData 



@app.post("/dfResultsHeaders")
async def dfdpOrigWithDupIdHeader(request: Request):
    byteJson = await request.body()
    strRep = str(byteJson, 'UTF-8')
    data= json.loads(strRep)
    jobID = data['jobID'] 
    resfname = os.getcwd()+f'/app/shared/pkl/dfdpOrigWithDupId{jobID}.pkl'
    dfdpOrigWithDupId = pickleIn(resfname)
    ltcolumns =  dfdpOrigWithDupId.columns.to_list()

    #print(ltcolumns )
    return {'headerColumns': ltcolumns} 

@app.get("/dfCsvHeaders")
def dfdpOrigHeaders():
    df = pd.read_csv(os.getcwd()  + '/app/shared/pi.csv')
    ltcolumns =  df.columns.to_list()

    #print(ltcolumns )
    return {'headerColumns': ltcolumns} 


'''
def vwDpKdistance(request):
    if request.method == 'POST' :
        KdistanceThold = float(request.POST['KdistanceThold'])
        resfname = os.getcwd()+'/pkl/dfdpmatches.pkl'
        dfdpmatches = pickleIn(resfname)
        dfdp = pickleIn( os.getcwd()+'/pkl/dfdp.pkl')
        dfdpmatchesthold = dfdpmatches[dfdpmatches['Kdistance'] < KdistanceThold]
        dfdpdupid = dfMatchesTodDupID(dfdpmatchesthold)
        dfdpOrigWithDupId = dfdpdupid.merge(dfdp, on = 'compname', how = 'inner')
        pickleOut( dfdpOrigWithDupId, os.getcwd()+'/pkl/dfdpOrigWithDupId.pkl')

        response = redirect('/dpresults')
        return response


    resfname = os.getcwd()+'/pkl/dfdpmatches.pkl'
    dfdpmatches = pickleIn(resfname)
    template = "datadrivenapp/dpKdistance.html"
    context = { 
            'dfdpmatches': dfdpmatches,
            }
    return render(request, template, context)


def vwDpResults(request):

    resfname = os.getcwd()+'/pkl/dfdpOrigWithDupId.pkl'
    dfdpOrigWithDupId = pickleIn(resfname)
    ltColumns = list(dfdpOrigWithDupId.columns)
    #to add untagged natural duplicates


    template = "datadrivenapp/dpResults.html"
    context = { 
            'dfdpOrigWithDupId': dfdpOrigWithDupId,
            'ltColumns': ltColumns,
            }
    return render(request, template, context)


'''





