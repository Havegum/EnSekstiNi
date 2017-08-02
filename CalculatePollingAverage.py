# -*- coding: utf-8 -*-
"""
Created 2017-07-14
@author: Halvard
"""
import pandas as pd
# import numpy as np
# from datetime import datetime as dt


#There's got to be a better way to do this!
InFact =   pd.read_csv('pollsters/InFact.csv',   delimiter=';', index_col=['Date'], parse_dates=['Date'])
Norfakta = pd.read_csv('pollsters/Norfakta.csv', delimiter=';', index_col=['Date'], parse_dates=['Date'])
Norstat =  pd.read_csv('pollsters/Norstat.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
Opinion =  pd.read_csv('pollsters/Opinion.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
Respons =  pd.read_csv('pollsters/Respons.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
TNS =      pd.read_csv('pollsters/TNS.csv',      delimiter=';', index_col=['Date'], parse_dates=['Date'])
Sentio =   pd.read_csv('pollsters/Sentio.csv',   delimiter=';', index_col=['Date'], parse_dates=['Date'])
Ipsos =    pd.read_csv('pollsters/Ipsos.csv',    delimiter=';', index_col=['Date'], parse_dates=['Date'])

# This is for detecting multiple polls from the same pollster
# in order to lower the weight of old polling data. #TODO!
InFact['Pollster'] =    'InFact'
Norfakta['Pollster'] =  'Norfakta'
Norstat['Pollster'] =   'Norstat'
Opinion['Pollster'] =   'Opinion'
Respons['Pollster'] =   'Respons'
TNS['Pollster'] =       'TNS'
Sentio['Pollster'] =    'Sentio'
Ipsos['Pollster'] =     'Ipsos'

Parties = ['Ap', 'Hoyre', 'Frp', 'SV', 'Sp', 'KrF', 'Venstre', 'MDG', 'Rodt', 'Andre']


def getPollWeight(pList, date): 
    WeightList = []
    for i in range(pList.index.size):
         WeightList.append( pd.Timedelta(date-pList.index[i]).days )
         WeightList[i] = 0.95**WeightList[i]
         # Exponential decay = 0.95^(days since polling)
    pList['Weight'] = WeightList
    return None


def createList(current_date, cutoff=60):
    # Start at inputday and go back %cutoff days    
    calc_start_date = current_date - pd.Timedelta(days=cutoff)
    # Create dataframe with all polls within period
    return  pd.concat([
            InFact[     current_date : calc_start_date],
            Norfakta[   current_date : calc_start_date],
            Norstat[    current_date : calc_start_date],
            Opinion[    current_date : calc_start_date],
            Respons[    current_date : calc_start_date], 
            TNS[        current_date : calc_start_date], 
            Sentio[     current_date : calc_start_date], 
            Ipsos[      current_date : calc_start_date]
            ])

    
def getDayAverage(pList, date):
    "calculates average polling on a day given a weighted list"  
    df = pd.DataFrame(columns=Parties, index=[date])
    for x in range(0, len(Parties) ):
        pList[ Parties[x] ] *= pList['Weight']    
        df[ Parties[x] ] = round( sum(pList[Parties[x]]) / sum(pList['Weight']), 1 )
    return df


def calcAvgFor(dateIndex):
    df = pd.DataFrame(columns=[Parties])
    
    for date in dateIndex:
        pollList = createList(date, cutoff=60)
        getPollWeight(pollList, date)
        df = pd.concat([ getDayAverage(pollList, date), df ])
    
    return df


dates = pd.DatetimeIndex(data=InFact.index)
dates = dates.append([Norfakta.index, Norstat.index, Opinion.index,
                   Respons.index, TNS.index, Sentio.index, Ipsos.index ])
dates = dates.sort_values()

tempDf = calcAvgFor(dates)
tempDf.to_csv('avgPolling.csv',  sep=';', index_label='Date')