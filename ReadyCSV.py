# -*- coding: utf-8 -*-
"""
Created on Tue Jul 25 18:27:46 2017

@author: Halvard
"""
import pandas as pd
import os

Pollster =  'InFact2'
Fylke =     'Østfold'

df = pd.read_csv('rawpolls/' + Pollster + '.csv', delimiter=';', encoding = "ISO-8859-1", header=1, skiprows=[3])



#Split and index date, rename columns to utf-8, then delete superfluous columns
df['Date'] = df.Måling.str.findall(r'\d+/\d-20\d{2}').str.join(', ')
df['Date'] = pd.to_datetime(df['Date'])
df = df.set_index(df['Date']).rename(columns = {'Høyre':'Hoyre', 'Rødt':'Rodt'})
del df['Måling']
del df['Date']

# Strip poll of polls mandates, convert strings to ints
Parties = ['Ap', 'Hoyre', 'Frp', 'SV', 'Sp', 'KrF', 'Venstre', 'MDG', 'Rodt', 'Andre']
for i in range(0,len(Parties)):
    df[Parties[i]].replace(regex=r' \(\d+\)',value=r'', inplace=True)
    df[Parties[i]].replace(regex=r',', value='.', inplace=True)
    df[Parties[i]] = pd.to_numeric(df[Parties[i]])
    
df.to_csv('pollsters/Fylker/' + Fylke + '/' + Pollster + '.csv',  sep=';', index_label='Date')
os.remove('rawpolls/' + Pollster + '.csv')