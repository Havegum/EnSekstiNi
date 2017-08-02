import pandas as pd
import numpy as np
from datetime import datetime as dt
from bokeh.plotting import figure, output_file, show, ColumnDataSource
from bokeh.models import Range1d, HoverTool

# import polls

AvgDf = pd.read_csv('pollsters/avgPolling.csv', delimiter=';', index_col=['Date'], parse_dates=['Date'])
source= ColumnDataSource(AvgDf)
pollster = 'Poll of polls'

#There's got to be a better way to do this!
InFact =   pd.read_csv('pollsters/InFact.csv',   delimiter=';', index_col=['Date'], parse_dates=['Date'])
Norfakta = pd.read_csv('pollsters/Norfakta.csv', delimiter=';', index_col=['Date'], parse_dates=['Date'])
Norstat =  pd.read_csv('pollsters/Norstat.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
Opinion =  pd.read_csv('pollsters/Opinion.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
Respons =  pd.read_csv('pollsters/Respons.csv',  delimiter=';', index_col=['Date'], parse_dates=['Date'])
TNS =      pd.read_csv('pollsters/TNS.csv',      delimiter=';', index_col=['Date'], parse_dates=['Date'])
Sentio =   pd.read_csv('pollsters/Sentio.csv',   delimiter=';', index_col=['Date'], parse_dates=['Date'])
Ipsos =    pd.read_csv('pollsters/Ipsos.csv',    delimiter=';', index_col=['Date'], parse_dates=['Date'])


pollofpolls =    pd.read_csv('polls/pollofpolls-avgPolling.csv',    delimiter=';', index_col=['Date'], parse_dates=['Date'])

# Convert date boundries to floats
startDate = dt(2016,12,30).timestamp()*1000
endDate = dt(2017,10,1).timestamp()*1000
dataStart = dt(2010,1,1).timestamp()*1000

# List parties or something
Parties = ['Ap', 'Hoyre', 'Frp', 'SV', 'Sp', 'KrF', 'Venstre', 'MDG', 'Rodt', 'Andre']
PartyColors = {'Ap':'#F02844', 'Hoyre':'#34A4E2', 'Frp':'#2B4AAF', 'SV':'#F962D9', 'Sp':'#7D8000', 'KrF':'#FFBD0E', 'Venstre':'#00663C', 'MDG':'#52BC25', 'Rodt':'#9E0037', 'Andre':'#424451'}


# ##### DEFINE PLOT #####
p = figure(plot_width = 1100, plot_height = 600, x_axis_type = "datetime",
           tools = "xpan,xwheel_zoom,hover", toolbar_location = None,
           active_scroll = "xwheel_zoom",
           background_fill_color="#EEEEEE")

# Starting range and bounds
p.x_range = Range1d(start=startDate, end=endDate, bounds=(dataStart, None))
p.y_range = Range1d(start=0, end=50.1, bounds=None)

# Hover tool:
# ideally this should go in a static legend to the side or below the plot and
# have a vertical line annotation following the cursor ... #TODO i guess
p.line('Date', 40, source=source, name='hoverref', line_color=None, line_alpha=0)
p.select_one(HoverTool).mode = 'vline'
p.select_one(HoverTool).names = ['hoverref']
p.select_one(HoverTool).tooltips = """
<style>
    span {padding: 0px 5px;}
</style>

<div>
    <span style="color: #F02844">Ap: @Ap{1.1}</span>
    <span style="color: #34A4E2 ">Høyre: @Hoyre{1.1}</span>
    <span style="color: #2B4AAF ">Frp: @Frp{1.1}</span>
    <span style="color: #7D8000 ">Sp: @Sp{1.1}</span>
    <span style="color: #FFBD0E ">KrF: @KrF{1.1}</span>
    <br>
    <span style="color: #F962D9 ">SV: @SV{1.1}</span>
    <span style="color: #52BC25 ">MDG: @MDG{1.1}</span>
    <span style="color: #00663C ">Venstre: @Venstre{1.1}</span>
    <span style="color: #9E0037 ">Rødt: @Rodt{1.1}</span>
    <span style="color: #424451 ">Andre: @Andre{1.1}</span>
</div>
"""

# Title and title styling
p.title.text = "Pollster sammenligning: "+pollster
p.title.align = "center"
p.title.text_font = 'verdana'
p.title.text_font_size = "1.2em"
p.title.text_color = "#666666"

# Axis and grid stylings
p.yaxis.axis_line_width = 2
p.yaxis.axis_line_color = "#E5E5E5"
p.yaxis.major_tick_line_color = None

p.xaxis.axis_line_width = 2.5
p.xaxis.major_tick_line_width = 2

p.axis.minor_tick_line_color = None
p.axis.major_tick_line_cap = 'butt'
p.axis.major_label_text_font = 'verdana'
p.axis.major_label_text_font_size = "0.8em"
p.axis.major_label_text_color = "#666666"
p.axis.major_tick_in = -1

p.grid.grid_line_width = 2
p.grid.grid_line_color = "#E5E5E5"

p.min_border = 60
p.border_fill_color = "#EEEEEE"

# ##### -- #####

# Dot Styling function
def drawCircle(root, poller, party):
    root.circle(poller.index, np.array(getattr(poller, party)),
                line_color=PartyColors[party], fill_color=PartyColors[party], fill_alpha=0.4,
                line_alpha=0, line_width=1, size=6)
    return None


# Draw lines and points


# For all the parties, plot datapoints and average line

# Individual datapoints
   
# Plot our running average
for i in range(0,len(Parties)):
    p.line(AvgDf.index, np.array(getattr(AvgDf, Parties[i])), line_color=PartyColors[Parties[i]], line_width=2.5)
    
for i in range(0,len(Parties)):
    p.line(pollofpolls.index, np.array(getattr(pollofpolls, Parties[i])), line_color=PartyColors[Parties[i]], line_width=2.5, line_alpha=0.5)

output_file('pollofpolls.html')
show(p)