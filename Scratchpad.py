# -*- coding: utf-8 -*-
"""
Created on Sat Jul 15 13:21:25 2017

@author: Halvard
"""

import pandas as pd


InfactVG =           pd.read_csv('polls/InFactVG.csv',          delimiter=';',  index_col=['Date'], parse_dates=['Date'])
NorfaktaNatKK =      pd.read_csv('polls/NorfaktaNatKK.csv',     delimiter=';',  index_col=['Date'], parse_dates=['Date'])
NorstatNRK =         pd.read_csv('polls/NorstatNRK.csv',        delimiter=';',  index_col=['Date'], parse_dates=['Date'])
NorfaktaVL =         pd.read_csv('polls/NorfaktaVL.csv',        delimiter=';',  index_col=['Date'], parse_dates=['Date'])
InFactLF =           pd.read_csv('polls/InFactLF.csv',          delimiter=';',  index_col=['Date'], parse_dates=['Date'])
OpinionANB =         pd.read_csv('polls/OpinionANB.csv',        delimiter=';',  index_col=['Date'], parse_dates=['Date'])
ResponsAftenposten = pd.read_csv('polls/ResponsAftenposten.csv',delimiter=';',  index_col=['Date'], parse_dates=['Date'])
TNSTV2 =             pd.read_csv('polls/TNSTV2.csv',            delimiter=';',  index_col=['Date'], parse_dates=['Date'])
SentioDN =           pd.read_csv('polls/SentioDN.csv',          delimiter=';',  index_col=['Date'], parse_dates=['Date'])
IpsosDB =            pd.read_csv('polls/IpsosDB.csv',           delimiter=';',  index_col=['Date'], parse_dates=['Date'])


InFact = pd.concat([InfactVG, InFactLF]).sort_index(         ).to_csv('pollsters/InFact.csv',   sep=';', index_label='Date')
Norfakta = pd.concat([NorfaktaNatKK, NorfaktaVL]).sort_index().to_csv('pollsters/Norfakta.csv', sep=';', index_label='Date')
Norstat = NorstatNRK.sort_index(                             ).to_csv('pollsters/Norstat.csv',  sep=';', index_label='Date')
Opinion = OpinionANB.sort_index(                             ).to_csv('pollsters/Opinion.csv',  sep=';', index_label='Date')
Respons = ResponsAftenposten.sort_index(                     ).to_csv('pollsters/Respons.csv',  sep=';', index_label='Date')
TNS = TNSTV2.sort_index(                                     ).to_csv('pollsters/TNS.csv',      sep=';', index_label='Date')
Sentio = SentioDN.sort_index(                                ).to_csv('pollsters/Sentio.csv',   sep=';', index_label='Date')
Ipsos = IpsosDB.sort_index(                                  ).to_csv('pollsters/Ipsos.csv',    sep=';', index_label='Date')
